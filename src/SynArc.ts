import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  parseUnits,
  formatUnits,
  fallback,
  encodeFunctionData,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ARC_TESTNET } from './constants'
import {
  SynArcConfig,
  ProposalParams,
  VoteChoice,
  TreasuryBalance,
  CreatorStats,
  CreatorDAOParams,
  CreatorProfile,
  CreatorCampaign,
  CreatorDAOTemplate,
  RebalanceProposalParams,
  AgentAction,
  MonitorTreasuryResult,
} from './types'
import { GOVERNOR_ABI, TREASURY_ABI, TOKEN_ABI, ERC20_ABI, TOKEN_MESSENGER_ABI } from './abis'

export class SynArc {
  private config: SynArcConfig
  private privateKeyAccount: any = null
  public publicClient: any
  public walletClient: any | null = null
  public walletType: string = 'read-only'

  constructor(config: SynArcConfig) {
    this.config = config

    // Build transport with fallbacks
    const transport = fallback([
      http(config.rpcUrl || 'https://rpc.testnet.arc.network'),
      http('https://arc-testnet.drpc.org'),
      http('https://5042002.rpc.thirdweb.com'),
    ])

    // Always create public client for reads
    this.publicClient = createPublicClient({
      chain: ARC_TESTNET,
      transport,
    })

    // Setup wallet client based on what was provided
    if (config.privateKey) {
      // AI Agent — private key
      const account = privateKeyToAccount(config.privateKey)
      this.privateKeyAccount = account
      this.walletClient = createWalletClient({
        account,
        chain: ARC_TESTNET,
        transport,
      })
      this.walletType = 'private-key'

    } else if (config.provider) {
      // Any EIP-1193 provider — MetaMask, Privy, Circle, Coinbase etc
      this.walletClient = createWalletClient({
        chain: ARC_TESTNET,
        transport: custom(config.provider),
      })
      this.walletType = 'injected'

    } else if (config.walletClient) {
      // Pre-built custom viem walletClient
      this.walletClient = config.walletClient
      this.walletType = 'custom'

    } else {
      // Read-only mode — no wallet
      this.walletType = 'read-only'
    }
  }

  // Check if wallet is available
  isReadOnly(): boolean {
    return this.walletType === 'read-only'
  }

  // Get connected address
  async getAddress(): Promise<`0x${string}` | null> {
    if (this.walletType === 'private-key' && this.privateKeyAccount) {
      return this.privateKeyAccount.address
    }
    if (!this.walletClient) return null
    const [address] = await this.walletClient.getAddresses()
    return address || null
  }

  // ─── GOVERNANCE ────────────────────────────────────────

  async createProposal(params: ProposalParams): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')

    let targets = params.targets || ['0x0000000000000000000000000000000000000000' as `0x${string}`]
    let values = params.values || [0n]
    let calldatas = params.calldatas || ['0x' as `0x${string}`]
    let descriptionDetail = params.description

    if (params.template === 'funding') {
      const recipient = params.templateParams?.recipient
      const amount = params.templateParams?.amountUSDC
      if (!recipient || amount === undefined) {
        throw new Error("Funding template requires 'recipient' and 'amountUSDC' parameters.")
      }

      const amountRaw = parseUnits(amount.toString() as `${number}`, 6)
      // Encode withdraw(recipient, amount) to Treasury
      const withdrawCalldata = encodeFunctionData({
        abi: TREASURY_ABI,
        functionName: 'withdraw',
        args: [recipient, amountRaw],
      })

      targets = [this.config.treasuryAddress]
      values = [0n]
      calldatas = [withdrawCalldata]
      descriptionDetail = `[Creator Funding Request: ${amount} USDC to ${recipient}]\n\n${params.description}`
    } else if (params.template === 'milestone') {
      const milestoneId = params.templateParams?.milestoneId || 0
      const milestoneTitle = params.templateParams?.milestoneTitle || 'Milestone Completion'
      descriptionDetail = `[Creator Milestone #${milestoneId} Release Request: ${milestoneTitle}]\n\n${params.description}`
    }

    const description = `${params.title}\n\n${descriptionDetail}`

    const txHash = await this.walletClient.writeContract({
      address: this.config.governorAddress,
      abi: GOVERNOR_ABI,
      functionName: 'propose',
      args: [targets, values, calldatas, description],
      account: this.getSigner(address),
    })

    await this.publicClient.waitForTransactionReceipt({ hash: txHash })
    return txHash
  }

  async vote(proposalId: string, choice: VoteChoice): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')

    const support = choice === 'For' ? 1 : choice === 'Against' ? 0 : 2

    // Check and auto-delegate first
    await this.ensureDelegated()

    const txHash = await this.walletClient.writeContract({
      address: this.config.governorAddress,
      abi: GOVERNOR_ABI,
      functionName: 'castVote',
      args: [BigInt(proposalId), support],
      account: this.getSigner(address),
    })

    await this.publicClient.waitForTransactionReceipt({ hash: txHash })
    return txHash
  }

  async delegate(delegateeAddress?: `0x${string}`): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')
    const target = delegateeAddress || address

    const txHash = await this.walletClient.writeContract({
      address: this.config.tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'delegate',
      args: [target],
      account: this.getSigner(address),
    })

    await this.publicClient.waitForTransactionReceipt({ hash: txHash })
    return txHash
  }

  async getVotingPower(walletAddress: `0x${string}`): Promise<string> {
    const balance = await this.publicClient.readContract({
      address: this.config.tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'balanceOf',
      args: [walletAddress],
    })
    return formatUnits(balance as bigint, 18)
  }

  async getProposals(): Promise<any[]> {
    const eventAbi = GOVERNOR_ABI.find((x: any) => x.type === 'event' && x.name === 'ProposalCreated')
    if (!eventAbi) {
      throw new Error('ProposalCreated event ABI not found')
    }
    const logs = await this.publicClient.getLogs({
      address: this.config.governorAddress,
      event: eventAbi,
      fromBlock: 0n,
    })
    return logs.map((log: any) => log.args)
  }

  async getProposalState(proposalId: string): Promise<string> {
    const state = await this.publicClient.readContract({
      address: this.config.governorAddress,
      abi: GOVERNOR_ABI,
      functionName: 'state',
      args: [BigInt(proposalId)],
    })
    const states = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed']
    return states[Number(state)] || 'Unknown'
  }

  // ─── TREASURY ──────────────────────────────────────────

  async getTreasuryBalance(): Promise<TreasuryBalance> {
    const [usdc, eurc] = await Promise.all([
      this.publicClient.readContract({
        address: this.config.treasuryAddress,
        abi: TREASURY_ABI,
        functionName: 'usdcBalance',
      }),
      this.publicClient.readContract({
        address: this.config.treasuryAddress,
        abi: TREASURY_ABI,
        functionName: 'eurcBalance',
      }),
    ])

    const usdcFormatted = formatUnits(usdc as bigint, 6)
    const eurcFormatted = formatUnits(eurc as bigint, 6)

    return {
      usdc: usdcFormatted,
      eurc: eurcFormatted,
      totalUSD: (parseFloat(usdcFormatted) + parseFloat(eurcFormatted)).toFixed(2)
    }
  }

  async depositUSDC(amount: string): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')
    const amountRaw = parseUnits(amount as `${number}`, 6)
    const usdcAddress = this.config.usdcAddress || '0x3600000000000000000000000000000000000000'

    // Approve
    const approveTx = await this.walletClient.writeContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [this.config.treasuryAddress, amountRaw],
      account: this.getSigner(address),
    })
    await this.publicClient.waitForTransactionReceipt({ hash: approveTx })

    // Deposit
    const depositTx = await this.walletClient.writeContract({
      address: this.config.treasuryAddress,
      abi: TREASURY_ABI,
      functionName: 'depositUSDC',
      args: [amountRaw],
      account: this.getSigner(address),
    })
    await this.publicClient.waitForTransactionReceipt({ hash: depositTx })
    return depositTx
  }

  async depositEURC(amount: string): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')
    const amountRaw = parseUnits(amount as `${number}`, 6)
    const eurcAddress = this.config.eurcAddress || '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a'

    // Approve
    const approveTx = await this.walletClient.writeContract({
      address: eurcAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [this.config.treasuryAddress, amountRaw],
      account: this.getSigner(address),
    })
    await this.publicClient.waitForTransactionReceipt({ hash: approveTx })

    // Deposit
    const depositTx = await this.walletClient.writeContract({
      address: this.config.treasuryAddress,
      abi: TREASURY_ABI,
      functionName: 'depositEURC',
      args: [amountRaw],
      account: this.getSigner(address),
    })
    await this.publicClient.waitForTransactionReceipt({ hash: depositTx })
    return depositTx
  }

  // ─── CREATOR ECONOMY & NANOPAYMENTS ─────────────────────

  async supportCreator(creatorWallet: `0x${string}`, amount: string | number): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')
    const amountRaw = parseUnits(amount.toString() as `${number}`, 6)
    const usdcAddress = this.config.usdcAddress || '0x3600000000000000000000000000000000000000'

    // Send direct USDC nanopayment
    const txHash = await this.walletClient.writeContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [creatorWallet, amountRaw],
      account: this.getSigner(address),
    })

    await this.publicClient.waitForTransactionReceipt({ hash: txHash })
    return txHash
  }

  async getCreatorStats(creatorWallet: `0x${string}`): Promise<CreatorStats> {
    const usdcAddress = this.config.usdcAddress || '0x3600000000000000000000000000000000000000'
    const [power, usdc] = await Promise.all([
      this.getVotingPower(creatorWallet),
      this.publicClient.readContract({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [creatorWallet],
      }),
    ])

    return {
      votingPower: power,
      balanceUSDC: formatUnits(usdc as bigint, 6),
    }
  }

  /**
   * createCreatorDAO
   * Launches a new Creator DAO by submitting an on-chain governance proposal.
   * The proposal encodes a treasury withdrawal (the funding goal) to the creator's wallet.
   * Token holders vote to approve the campaign; execution releases the funds.
   */
  async createCreatorDAO(params: CreatorDAOParams): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')

    const recipient = params.recipient || address
    const goalRaw = parseUnits(params.goalUSDC.toString() as `${number}`, 6)
    const template: CreatorDAOTemplate = params.template || 'general'

    // Encode treasury withdraw call as the proposal action
    const withdrawCalldata = encodeFunctionData({
      abi: TREASURY_ABI,
      functionName: 'withdraw',
      args: [recipient, goalRaw],
    })

    // Build milestone text if provided
    const milestoneText = params.milestones && params.milestones.length > 0
      ? `\n\n**Milestones:**\n${params.milestones.map((m, i) => `${i + 1}. ${m}`).join('\n')}`
      : ''

    const description =
      `[CreatorDAO:${template.toUpperCase()}] ${params.name}\n\n` +
      `${params.description}${milestoneText}\n\n` +
      `Goal: ${params.goalUSDC} USDC → ${recipient}`

    const txHash = await this.walletClient.writeContract({
      address: this.config.governorAddress,
      abi: GOVERNOR_ABI,
      functionName: 'propose',
      args: [[this.config.treasuryAddress], [0n], [withdrawCalldata], description],
      account: this.getSigner(address),
    })

    await this.publicClient.waitForTransactionReceipt({ hash: txHash })
    return txHash
  }

  /**
   * getCreatorProfile
   * Returns on-chain stats for a creator wallet. If `creatorApiUrl` is configured,
   * it also merges off-chain metadata (name, bio, slug, totalRaisedUSDC, supporterCount).
   * Falls back gracefully to on-chain-only data when the API is unavailable.
   */
  async getCreatorProfile(slugOrAddress: string): Promise<CreatorProfile> {
    // Resolve address — if it looks like a 0x address use it directly, else try API
    let creatorAddress: `0x${string}` | null = null
    let offChain: Partial<CreatorProfile> = {}

    if (slugOrAddress.startsWith('0x')) {
      creatorAddress = slugOrAddress as `0x${string}`
    }

    // Try off-chain API if configured
    if (this.config.creatorApiUrl) {
      try {
        const res = await fetch(`${this.config.creatorApiUrl}/creators/${encodeURIComponent(slugOrAddress)}`)
        if (res.ok) {
          const data = await res.json()
          offChain = data
          if (!creatorAddress && data.address) {
            creatorAddress = data.address as `0x${string}`
          }
        }
      } catch (_) {
        // Silently fall through to on-chain only
      }
    }

    if (!creatorAddress) {
      throw new Error(
        `Cannot resolve creator address for "${slugOrAddress}". ` +
        'Provide a 0x address or configure creatorApiUrl in SynArcConfig.'
      )
    }

    const stats = await this.getCreatorStats(creatorAddress)

    return {
      address: creatorAddress,
      slug: offChain.slug || slugOrAddress,
      name: offChain.name || creatorAddress,
      bio: offChain.bio || '',
      template: offChain.template || 'general',
      stats,
      totalRaisedUSDC: offChain.totalRaisedUSDC || '0.00',
      supporterCount: offChain.supporterCount || 0,
    }
  }

  /**
   * getCreatorCampaigns
   * Returns a list of active Creator DAO campaigns derived from on-chain
   * ProposalCreated events whose descriptions match the [CreatorDAO:*] tag.
   * If `creatorApiUrl` is configured, enriched off-chain data is used instead.
   */
  async getCreatorCampaigns(): Promise<CreatorCampaign[]> {
    // Try off-chain API first
    if (this.config.creatorApiUrl) {
      try {
        const res = await fetch(`${this.config.creatorApiUrl}/campaigns?status=active`)
        if (res.ok) {
          const data = await res.json()
          return data as CreatorCampaign[]
        }
      } catch (_) {
        // Fall through to on-chain
      }
    }

    // Derive campaigns from on-chain ProposalCreated events
    const proposals = await this.getProposals()
    const campaigns: CreatorCampaign[] = []

    for (const p of proposals) {
      const desc: string = p.description || ''
      const match = desc.match(/^\[CreatorDAO:([A-Z]+)\] (.+)$/m)
      if (!match) continue

      const template = match[1].toLowerCase() as CreatorDAOTemplate
      const name = match[2].trim()

      // Parse goal from description
      const goalMatch = desc.match(/Goal:\s*([\d.]+)\s*USDC/)
      const goalUSDC = goalMatch ? goalMatch[1] : '0'

      // Parse proposalId
      const proposalId: string = p.proposalId?.toString() || ''

      // Get current state
      let isActive = false
      if (proposalId) {
        try {
          const state = await this.getProposalState(proposalId)
          isActive = state === 'Active' || state === 'Pending'
        } catch (_) {}
      }

      // Parse milestones from description
      const milestoneMatches = [...desc.matchAll(/^\d+\.\s+(.+)$/gm)]
      const milestones = milestoneMatches.map((m, i) => ({
        id: i + 1,
        title: m[1].trim(),
        completed: false,
      }))

      campaigns.push({
        id: proposalId,
        creatorAddress: p.proposer as `0x${string}`,
        name,
        description: desc.split('\n\n')[1] || '',
        template,
        goalUSDC,
        raisedUSDC: '0.00',  // On-chain only: would need transfer event scanning
        progress: 0,
        isActive,
        milestones,
      })
    }

    return campaigns
  }

  // ─── TREASURY REBALANCER AGENT ───────────────────────────

  /**
   * createRebalanceProposal
   * Creates a governance proposal to rebalance a specified amount of treasury USDC.
   * Proposes to withdraw the USDC to the executor/agent wallet to prepare for CCTP.
   */
  async createRebalanceProposal(params: RebalanceProposalParams): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')

    const amountRaw = parseUnits(params.amountUSDC.toString() as `${number}`, 6)
    const agentAddress = this.privateKeyAccount?.address || address

    // Encode withdrawUSDC(recipient, amount) to Treasury
    const withdrawCalldata = encodeFunctionData({
      abi: TREASURY_ABI,
      functionName: 'withdrawUSDC',
      args: [agentAddress, amountRaw],
    })

    const title = params.title || `Treasury Rebalance: Move ${params.amountUSDC} USDC to ${params.targetChain}`
    const description = 
      `${title}\n\n` +
      `[TreasuryRebalance]\n` +
      `Amount: ${params.amountUSDC} USDC\n` +
      `Target Chain: ${params.targetChain}\n` +
      `Target Domain: ${params.targetDomain}\n` +
      `Recipient: ${params.mintRecipient}\n` +
      `Reason: ${params.reason}`

    const txHash = await this.walletClient.writeContract({
      address: this.config.governorAddress,
      abi: GOVERNOR_ABI,
      functionName: 'propose',
      args: [[this.config.treasuryAddress], [0n], [withdrawCalldata], description],
      account: this.getSigner(address),
    })

    await this.publicClient.waitForTransactionReceipt({ hash: txHash })
    return txHash
  }

  /**
   * executeCCTPRebalance
   * Executes the Circle CCTP cross-chain transfer of USDC.
   * Must be called after the corresponding governance rebalance proposal passes and executes,
   * which transfers the treasury USDC into the agent's executor wallet.
   */
  async executeCCTPRebalance(proposalId: string): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')

    // Find the proposal to extract rebalance details
    const proposals = await this.getProposals()
    const proposal = proposals.find(p => p.proposalId?.toString() === proposalId)
    if (!proposal) {
      throw new Error(`Proposal with ID ${proposalId} not found.`)
    }

    const state = await this.getProposalState(proposalId)
    if (state !== 'Executed') {
      throw new Error(`Cannot execute CCTP rebalance. Proposal state is "${state}", expected "Executed".`)
    }

    const desc: string = proposal.description || ''
    const amountMatch = desc.match(/Amount:\s*([\d.]+)\s*USDC/)
    const domainMatch = desc.match(/Target Domain:\s*(\d+)/)
    const recipientMatch = desc.match(/Recipient:\s*(0x[a-fA-F0-9]{40})/)

    if (!amountMatch || !domainMatch || !recipientMatch) {
      throw new Error('Failed to parse rebalance details from proposal description.')
    }

    const amountUSDC = amountMatch[1]
    const targetDomain = parseInt(domainMatch[1], 10)
    const mintRecipient = recipientMatch[1] as `0x${string}`

    const amountRaw = parseUnits(amountUSDC as `${number}`, 6)
    const usdcAddress = this.config.usdcAddress || '0x3600000000000000000000000000000000000000'
    const tokenMessengerAddress = this.config.tokenMessengerAddress

    if (!tokenMessengerAddress) {
      throw new Error('tokenMessengerAddress must be configured in SynArcConfig to execute CCTP')
    }

    // 1. Approve USDC transfer to CCTP TokenMessenger
    const approveTx = await this.walletClient.writeContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [tokenMessengerAddress, amountRaw],
      account: this.getSigner(address),
    })
    await this.publicClient.waitForTransactionReceipt({ hash: approveTx })

    // 2. Format recipient address to 32 bytes
    const recipientBytes32 = ('0x' + mintRecipient.slice(2).padStart(64, '0')) as `0x${string}`

    // 3. Initiate burn and bridge transfer
    const bridgeTx = await this.walletClient.writeContract({
      address: tokenMessengerAddress,
      abi: TOKEN_MESSENGER_ABI,
      functionName: 'depositForBurn',
      args: [amountRaw, targetDomain, recipientBytes32, usdcAddress],
      account: this.getSigner(address),
    })
    await this.publicClient.waitForTransactionReceipt({ hash: bridgeTx })

    return bridgeTx
  }

  /**
   * monitorTreasury
   * Queries treasury balances and compares current USDC against target threshold limits,
   * returning rebalance suggestions if action is needed.
   */
  async monitorTreasury(): Promise<MonitorTreasuryResult> {
    const balances = await this.getTreasuryBalance()
    const currentBalanceUSDC = parseFloat(balances.usdc)

    const threshold = this.config.rebalanceThresholdUSDC !== undefined
      ? parseFloat(this.config.rebalanceThresholdUSDC.toString())
      : 10000.0

    const needsRebalance = currentBalanceUSDC > threshold
    const suggestedAmountUSDC = needsRebalance
      ? (currentBalanceUSDC * 0.5).toFixed(2)
      : '0.00'

    return {
      needsRebalance,
      currentBalanceUSDC: balances.usdc,
      suggestedAmountUSDC,
      suggestedTargetChain: 'Ethereum',
      suggestedTargetDomain: 0,
      reason: needsRebalance
        ? `USDC treasury balance of ${balances.usdc} exceeds the threshold of ${threshold}. Rebalancing recommended.`
        : 'USDC treasury balance is within healthy limits.'
    }
  }

  /**
   * getAgentActions
   * Retrieves a history of all treasury rebalance proposal and bridge execution events.
   */
  async getAgentActions(): Promise<AgentAction[]> {
    const proposals = await this.getProposals()
    const actions: AgentAction[] = []

    for (const p of proposals) {
      const desc: string = p.description || ''
      if (!desc.includes('[TreasuryRebalance]')) continue

      const amountMatch = desc.match(/Amount:\s*([\d.]+)\s*USDC/)
      const chainMatch = desc.match(/Target Chain:\s*([^\n]+)/)
      const domainMatch = desc.match(/Target Domain:\s*(\d+)/)
      const recipientMatch = desc.match(/Recipient:\s*(0x[a-fA-F0-9]{40})/)

      if (!amountMatch || !chainMatch || !domainMatch || !recipientMatch) continue

      const amountUSDC = amountMatch[1]
      const targetChain = chainMatch[1].trim()
      const targetDomain = parseInt(domainMatch[1], 10)
      const recipient = recipientMatch[1] as `0x${string}`
      const proposalId = p.proposalId?.toString() || ''

      let state = 'Unknown'
      if (proposalId) {
        try {
          state = await this.getProposalState(proposalId)
        } catch (_) {}
      }

      actions.push({
        id: proposalId,
        type: state === 'Executed' ? 'RebalanceExecuted' : 'RebalanceProposed',
        amountUSDC,
        targetChain,
        targetDomain,
        recipient,
        status: state,
        timestamp: Number(p.startBlock || 0n)
      })
    }

    return actions
  }

  // ─── HELPERS ───────────────────────────────────────────

  private requireWallet(): void {
    if (this.isReadOnly()) {
      throw new Error('Wallet required. Provide privateKey, provider, or walletClient in config.')
    }
  }

  private getSigner(address: `0x${string}`): any {
    return this.privateKeyAccount || address
  }

  private async ensureDelegated(): Promise<void> {
    const address = await this.getAddress()
    if (!address) return

    const currentDelegate = await this.publicClient.readContract({
      address: this.config.tokenAddress,
      abi: TOKEN_ABI,
      functionName: 'delegates',
      args: [address],
    })
    if (currentDelegate === '0x0000000000000000000000000000000000000000') {
      await this.delegate(address)
    }
  }
}
