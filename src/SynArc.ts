import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  parseUnits,
  formatUnits,
  fallback,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ARC_TESTNET } from './constants'
import { SynArcConfig, ProposalParams, VoteChoice, TreasuryBalance } from './types'
import { GOVERNOR_ABI, TREASURY_ABI, TOKEN_ABI, ERC20_ABI } from './abis'

export class SynArc {
  private config: SynArcConfig
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
    if (!this.walletClient) return null
    const [address] = await this.walletClient.getAddresses()
    return address || null
  }

  // ─── GOVERNANCE ────────────────────────────────────────

  async createProposal(params: ProposalParams): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')

    const description = `${params.title}\n\n${params.description}`
    const targets = params.targets || ['0x0000000000000000000000000000000000000000' as `0x${string}`]
    const values = params.values || [0n]
    const calldatas = params.calldatas || ['0x' as `0x${string}`]

    const txHash = await this.walletClient.writeContract({
      address: this.config.governorAddress,
      abi: GOVERNOR_ABI,
      functionName: 'propose',
      args: [targets, values, calldatas, description],
      account: address,
      gas: 500000n,
      gasPrice: 10000000n,
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
      account: address,
      gas: 300000n,
      gasPrice: 10000000n,
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
      account: address,
      gas: 100000n,
      gasPrice: 10000000n,
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
    const amountRaw = parseUnits(amount, 6)
    const usdcAddress = this.config.usdcAddress || '0x3600000000000000000000000000000000000000'

    // Approve
    const approveTx = await this.walletClient.writeContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [this.config.treasuryAddress, amountRaw],
      account: address,
      gas: 100000n,
      gasPrice: 10000000n,
    })
    await this.publicClient.waitForTransactionReceipt({ hash: approveTx })

    // Deposit
    const depositTx = await this.walletClient.writeContract({
      address: this.config.treasuryAddress,
      abi: TREASURY_ABI,
      functionName: 'depositUSDC',
      args: [amountRaw],
      account: address,
      gas: 200000n,
      gasPrice: 10000000n,
    })
    await this.publicClient.waitForTransactionReceipt({ hash: depositTx })
    return depositTx
  }

  async depositEURC(amount: string): Promise<string> {
    this.requireWallet()
    const address = await this.getAddress()
    if (!address) throw new Error('No address found for connected wallet')
    const amountRaw = parseUnits(amount, 6)
    const eurcAddress = this.config.eurcAddress || '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a'

    // Approve
    const approveTx = await this.walletClient.writeContract({
      address: eurcAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [this.config.treasuryAddress, amountRaw],
      account: address,
      gas: 100000n,
      gasPrice: 10000000n,
    })
    await this.publicClient.waitForTransactionReceipt({ hash: approveTx })

    // Deposit
    const depositTx = await this.walletClient.writeContract({
      address: this.config.treasuryAddress,
      abi: TREASURY_ABI,
      functionName: 'depositEURC',
      args: [amountRaw],
      account: address,
      gas: 200000n,
      gasPrice: 10000000n,
    })
    await this.publicClient.waitForTransactionReceipt({ hash: depositTx })
    return depositTx
  }

  // ─── HELPERS ───────────────────────────────────────────

  private requireWallet(): void {
    if (this.isReadOnly()) {
      throw new Error('Wallet required. Provide privateKey, provider, or walletClient in config.')
    }
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
