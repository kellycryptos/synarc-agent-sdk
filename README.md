# synarc-agent-sdk

SDK for integrating SynArc Creator Economy, nanopayments, governance, and treasury on the Arc Network. 
Built to empower **Creators, Fans, Communities, and Autonomous AI Agents** to fund, govern, and participate in the decentralized creator economy.

---

## Features
- **Wallet-Agnostic Setup:** Native EIP-1193 provider support covering MetaMask, Rabby, Privy, Circle Programmable Wallets, Coinbase Wallet, WalletConnect, or raw private keys.
- **USDC Nanopayments (Lepton):** Low-cost direct micropayments/donations to creator wallets on the Arc Network.
- **Creator-Governed DAOs:** Launch community-funded campaigns, set milestones, and govern treasury allocations via smart contracts.
- **AI Agent Native:** Built-in support for autonomous AI agents executing proposals, voting, or analyzing and supporting creator campaigns.
- **Read-Only Mode:** Inspect creator stats, query proposal histories, and check balances without wallet connections.

---

## Install

```bash
npm install synarc-agent-sdk
```

---

## Quick Start

### 1. Read-Only Mode (Check Creator Stats)
Inspect creator parameters directly from the blockchain without connecting a wallet:
```typescript
import { SynArc, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
})

// Query creator voting power and USDC balance
const stats = await synarc.getCreatorStats('0xCreatorWalletAddress')
console.log(`Creator Voting Power: ${stats.votingPower} SYN`)
console.log(`USDC Balance: ${stats.balanceUSDC} USDC`)
```

### 2. Fan Nanopayment (Direct USDC Support)
Send a direct USDC micropayment to support your favorite creator:
```typescript
import { SynArc, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  provider: window.ethereum, // EIP-1193 provider from MetaMask
})

// Send a 5 USDC nanopayment directly to the creator's wallet
const txHash = await synarc.supportCreator(
  '0xCreatorWalletAddress',
  5.00
)
console.log(`Nanopayment sent! Tx: ${txHash}`)
```

### 3. Creator DAO Funding Proposal
Creators can submit proposal requests using templates to pull funds from the community treasury once milestones are achieved:
```typescript
import { SynArc, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  provider: window.ethereum,
})

// Request release of 250 USDC from the Treasury to the Creator
const txHash = await synarc.createProposal({
  title: 'Milestone 1 Release: Debut Single Production',
  description: 'Requesting the release of funds as recording has been completed.',
  template: 'funding',
  templateParams: {
    recipient: '0xCreatorWalletAddress',
    amountUSDC: 250.00
  }
})
console.log(`Funding proposal created! Tx: ${txHash}`)
```

### 4. AI Agent Autonomously Supporting a Creator
AI agents running server-side can monitor campaign stats, calculate milestones, and programmatically vote or send support:
```typescript
import { SynArc, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
  rpcUrl: 'https://rpc.testnet.arc.network',
})

// 1. Fetch current campaign stats
const stats = await synarc.getCreatorStats('0xCreatorWalletAddress')

// 2. Perform autonomous decision making
if (parseFloat(stats.balanceUSDC) < 100.00) {
  console.log('Campaign funds are low. Sending 10 USDC support nanopayment...')
  await synarc.supportCreator('0xCreatorWalletAddress', 10.00)
}

// 3. Vote on active proposals
await synarc.vote('proposalId', 'For')
```

---

## Wallet Integrations

### MetaMask / Rabby / OKX (Injected)
```typescript
const synarc = new SynArc({
  ...contracts,
  provider: window.ethereum,
})
```

### Privy Embedded Wallet
```typescript
import { useWallets } from '@privy-io/react-auth'

const { wallets } = useWallets()
const provider = await wallets[0].getEip1193Provider()

const synarc = new SynArc({
  ...contracts,
  provider,
})
```

### Circle Programmable Wallet
```typescript
const provider = await circleWallet.getEip1193Provider()

const synarc = new SynArc({
  ...contracts,
  provider,
})
```

### Coinbase Wallet
```typescript
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'

const coinbase = new CoinbaseWalletSDK({ appName: 'SynArc' })
const provider = coinbase.makeWeb3Provider()

const synarc = new SynArc({
  ...contracts,
  provider,
})
```

### WalletConnect
```typescript
import { EthereumProvider } from '@walletconnect/ethereum-provider'

const provider = await EthereumProvider.init({ projectId: '...' })

const synarc = new SynArc({
  ...contracts,
  provider,
})
```

---

## API Reference

### SynArc Configuration
The `SynArc` constructor accepts a `SynArcConfig` configuration:
- `governorAddress: string` — Address of the deployed Governor contract.
- `treasuryAddress: string` — Address of the Treasury contract.
- `tokenAddress: string` — Address of the Governance Token (SynArcToken).
- `eurcAddress?: string` — (Optional) EURC Token address on Arc Testnet.
- `usdcAddress?: string` — (Optional) USDC Token address on Arc Testnet.
- `rpcUrl?: string` — (Optional) Custom RPC node URL.
- `privateKey?: string` — (Optional) 0x-prefixed private key for server environments (AI Agents).
- `provider?: any` — (Optional) EIP-1193 Ethereum provider.
- `walletClient?: any` — (Optional) Pre-built custom `viem` WalletClient.

### Creator & Nanopayment Methods

#### `supportCreator(creatorWallet: string, amount: string | number): Promise<string>`
Executes an on-chain USDC transfer transaction sending a nanopayment directly to the creator's wallet. Parses decimals automatically (6 decimals for USDC). Returns the transaction hash.

#### `getCreatorStats(creatorWallet: string): Promise<CreatorStats>`
Queries and returns the creator's voting power and USDC wallet balance in a single formatted object:
```typescript
interface CreatorStats {
  votingPower: string // Format: 18 decimals (SYN token)
  balanceUSDC: string // Format: 6 decimals (USDC token)
}
```

### Governance Methods

#### `createProposal(params: ProposalParams): Promise<string>`
Submits a new proposal. Supports pre-encoded templates for creator DAO flows:
- **`funding` template:** Automatically encodes a `withdraw(recipient, amount)` call to the treasury. Requires `recipient` and `amountUSDC` in `templateParams`.
- **`milestone` template:** Inserts structured milestone release metadata into the proposal description.
- **`general` template:** Standard proposal format.

```typescript
interface ProposalParams {
  title: string
  description: string
  targets?: string[]
  values?: bigint[]
  calldatas?: string[]
  template?: 'funding' | 'milestone' | 'general'
  templateParams?: {
    recipient?: string
    amountUSDC?: string | number
    milestoneId?: number
    milestoneTitle?: string
  }
}
```

#### `vote(proposalId: string, choice: VoteChoice): Promise<string>`
Casts a vote on a proposal. Choices are `'For'`, `'Against'`, or `'Abstain'`. Automatically delegates voting power to the caller if not already delegated. Returns the transaction hash.

#### `delegate(delegateeAddress?: string): Promise<string>`
Delegates voting power to the target address. Defaults to the caller's own address. Returns the transaction hash.

#### `getVotingPower(walletAddress: string): Promise<string>`
Queries the current voting power of a wallet address.

#### `getProposals(): Promise<any[]>`
Queries all historical `ProposalCreated` events from block zero.

#### `getProposalState(proposalId: string): Promise<string>`
Returns the current state of a proposal (`'Pending'`, `'Active'`, `'Canceled'`, `'Defeated'`, `'Succeeded'`, `'Queued'`, `'Expired'`, `'Executed'`, or `'Unknown'`).

### Treasury Methods

#### `getTreasuryBalance(): Promise<TreasuryBalance>`
Retrieves the formatted USDC and EURC balances currently held in the Treasury.

#### `depositUSDC(amount: string): Promise<string>`
Deposits USDC to the Treasury. Handles approval and deposit transactions.

#### `depositEURC(amount: string): Promise<string>`
Deposits EURC to the Treasury. Handles approval and deposit transactions.

---

## Sub-Modules

To keep integrations modular, the SDK exposes sub-classes:
- `SynArcCreator`: Exposes `supportCreator` and `getCreatorStats`.
- `SynArcGovernance`: Exposes proposal and voting functions.
- `SynArcTreasury`: Exposes treasury balance and deposit methods.

```typescript
import { SynArcCreator, SYNARC_TESTNET } from 'synarc-agent-sdk'

const creatorHub = new SynArcCreator({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
})

const stats = await creatorHub.getCreatorStats('0xCreatorWallet')
```

---

## Networks

| Network | Chain ID | Status | RPC URL |
|---------|----------|--------|---------|
| Arc Testnet | 5042002 | ✅ Live | `https://rpc.testnet.arc.network` |
| Arc Mainnet | TBA | 🔜 Soon | TBA |

## Links
- **Live App:** [synarcdao.xyz](https://synarcdao.xyz)
- **GitHub:** [kellycryptos/SynArc](https://github.com/kellycryptos/SynArc)
- **Block Explorer:** [testnet.arcscan.app](https://testnet.arcscan.app)

## License
MIT
