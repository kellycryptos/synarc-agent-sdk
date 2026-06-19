export interface SynArcConfig {
  governorAddress: `0x${string}`
  treasuryAddress: `0x${string}`
  tokenAddress: `0x${string}`
  eurcAddress?: `0x${string}`
  usdcAddress?: `0x${string}`
  rpcUrl?: string

  // Optional off-chain creator registry API for getCreatorProfile / getCreatorCampaigns
  creatorApiUrl?: string

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
  /** Target amount in USDC to raise */
  goalUSDC: string | number
  /** Pre-built campaign template type */
  template?: CreatorDAOTemplate
  /** Optional: recipient wallet; defaults to the caller's address */
  recipient?: `0x${string}`
  /** Optional: milestone titles for milestone-gated funding */
  milestones?: string[]
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
