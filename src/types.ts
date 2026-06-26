export interface SynArcConfig {
  governorAddress: `0x${string}`
  treasuryAddress: `0x${string}`
  tokenAddress: `0x${string}`
  eurcAddress?: `0x${string}`
  usdcAddress?: `0x${string}`
  rpcUrl?: string

  // Optional off-chain creator registry API for getCreatorProfile / getCreatorCampaigns
  creatorApiUrl?: string

  // Optional Circle CCTP Token Messenger contract address
  tokenMessengerAddress?: `0x${string}`
  // Optional USDC threshold for triggering rebalance monitoring recommendations
  rebalanceThresholdUSDC?: string | number

  // Optional on-chain agent contract address
  agentAddress?: `0x${string}`

  // Choose ONE of these wallet options:
  privateKey?: `0x${string}`     // AI agents — server side
  provider?: any                  // Any EIP-1193 provider — browser wallets
  walletClient?: any              // Pre-built viem walletClient
}

export type WalletType =
  | 'private-key'   // AI agent
  | 'injected'      // MetaMask, Rabby, OKX, Privy, Circle, Coinbase, WalletConnect, etc.
  | 'custom'        // Pre-built custom viem walletClient
  | 'read-only'     // No wallet — read-only mode

export interface ProposalParams {
  title: string
  description: string
  targets?: `0x${string}`[]
  values?: bigint[]
  calldatas?: `0x${string}`[]
  votingDurationDays?: number

  // Creator templates:
  template?: 'funding' | 'milestone' | 'general'
  templateParams?: {
    recipient?: `0x${string}`
    amountUSDC?: string | number
    milestoneId?: number
    milestoneTitle?: string
  }
}

export interface CreatorStats {
  votingPower: string
  balanceUSDC: string
}

// ─── CREATOR DAO ─────────────────────────────────────────

export type CreatorDAOTemplate = 'music' | 'video' | 'art' | 'writing' | 'software' | 'general'

export interface CreatorDAOParams {
  /** Display name of the DAO / campaign */
  name: string
  /** Short description of the creator's goal */
  description: string
  /** Target amount in USDC to raise (alias for goal) */
  goalUSDC?: string | number
  /** Target amount in USDC to raise */
  goal?: string | number
  /** Pre-built campaign template type */
  template?: CreatorDAOTemplate
  /** Optional: recipient wallet; defaults to the caller's address (alias for recipientWallet) */
  recipient?: `0x${string}`
  /** Optional: recipient wallet; defaults to the caller's address */
  recipientWallet?: `0x${string}`
  /** Optional: milestone titles for milestone-gated funding */
  milestones?: string[]
  /** Optional: duration of the campaign in days */
  durationDays?: number
  /** Optional: cover image URL */
  imageUrl?: string
  /** Optional: whether this campaign is for an autonomous AI agent */
  isAgent?: boolean
  /** Optional: campaign category override */
  category?: string
}

export interface CreatorProfile {
  /** Creator wallet address */
  address: `0x${string}`
  /** Human-readable slug (e.g. 'lepton') */
  slug: string
  /** Display name */
  name: string
  /** Short bio */
  bio: string
  /** Template used for the creator's DAO */
  template: CreatorDAOTemplate
  /** On-chain stats */
  stats: CreatorStats
  /** Total USDC raised all-time */
  totalRaisedUSDC: string
  /** Number of supporters who have sent payments */
  supporterCount: number
}

export interface CreatorCampaign {
  /** Unique campaign identifier */
  id: string
  /** Creator wallet address */
  creatorAddress: `0x${string}`
  /** Campaign / DAO name */
  name: string
  /** Campaign description */
  description: string
  /** Template type */
  template: CreatorDAOTemplate
  /** Funding goal in USDC (formatted) */
  goalUSDC: string
  /** Amount raised so far in USDC (formatted) */
  raisedUSDC: string
  /** Percentage of goal reached (0–100) */
  progress: number
  /** Whether the campaign is currently accepting support */
  isActive: boolean
  /** Milestones, if any */
  milestones: Array<{ id: number; title: string; completed: boolean }>
}

export interface ProposalData {
  id: string
  title: string
  description: string
  proposer: string
  state: ProposalState
  forVotes: bigint
  againstVotes: bigint
  abstainVotes: bigint
  startBlock: bigint
  endBlock: bigint
}

export type ProposalState =
  | 'Pending'
  | 'Active'
  | 'Defeated'
  | 'Succeeded'
  | 'Executed'
  | 'Canceled'

export type VoteChoice = 'For' | 'Against' | 'Abstain'

export interface TreasuryBalance {
  usdc: string
  eurc: string
  totalUSD: string
}

// ─── TREASURY REBALANCER AGENT ───────────────────────────

export interface RebalanceProposalParams {
  /** The amount of USDC to rebalance */
  amountUSDC: string | number
  /** The source chain name (e.g. 'Arc') */
  sourceChain?: string
  /** The target chain name (e.g. 'Ethereum') */
  targetChain: string
  /** Circle CCTP Domain ID of target chain */
  targetDomain: number
  /** Recipient address on target chain */
  mintRecipient: `0x${string}`
  /** Reason for the rebalance */
  reason: string
  /** Optional custom title for the rebalance proposal */
  title?: string
}

export interface AgentAction {
  /** The proposal ID associated with the rebalance action */
  id: string
  /** Action type: proposed or executed CCTP transfer */
  type: 'RebalanceProposed' | 'RebalanceExecuted'
  /** Amount in USDC */
  amountUSDC: string
  /** Destination chain name */
  targetChain: string
  /** Destination CCTP domain ID */
  targetDomain: number
  /** Recipient address on destination chain */
  recipient: `0x${string}`
  /** Governance proposal status (e.g. 'Executed', 'Active', 'Defeated') */
  status: string
  /** Transaction hash of CCTP execution, if applicable */
  txHash?: string
  /** Block number proxy or timestamp */
  timestamp: number
}

export interface MonitorTreasuryResult {
  /** Whether the treasury needs rebalancing based on USDC threshold */
  needsRebalance: boolean
  /** Current USDC balance in treasury */
  currentBalanceUSDC: string
  /** Suggested USDC amount to bridge */
  suggestedAmountUSDC: string
  /** Recommended destination chain */
  suggestedTargetChain: string
  /** Recommended destination CCTP domain ID */
  suggestedTargetDomain: number
  /** Human-readable explanation of recommendation */
  reason: string
}

export interface QueuedWithdrawal {
  id: bigint
  recipient: `0x${string}`
  amount: bigint
  token: `0x${string}`
  tokenSymbol: string
  description: string
  executionTime: bigint
  executed: boolean
  canceled: boolean
}

export interface QueuedAgentWithdrawal {
  id: bigint
  token: `0x${string}`
  recipient: `0x${string}`
  amount: bigint
  executionTime: bigint
  executed: boolean
  canceled: boolean
}

export interface CreatorDAOMilestone {
  title: string
  amount: string
  description: string
  status: 'pending' | 'active' | 'completed'
}

export interface CreatorDAO {
  id: string
  title: string
  description: string
  category: string
  goal: string
  raised: string
  contributors: number
  state: 'Active' | 'Voting' | 'Completed' | 'Refunded'
  isAgent: boolean
  creator: `0x${string}`
  recipient: `0x${string}`
  deadline: string
  milestones: CreatorDAOMilestone[]
  escrowAddress: `0x${string}`
  imageUrl?: string
  twitter?: string | null
}


