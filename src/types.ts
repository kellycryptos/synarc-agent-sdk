export interface SynArcConfig {
  governorAddress: `0x${string}`
  treasuryAddress: `0x${string}`
  tokenAddress: `0x${string}`
  eurcAddress?: `0x${string}`
  usdcAddress?: `0x${string}`
  rpcUrl?: string

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
