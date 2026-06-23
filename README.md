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

## Creator Economy

The SynArc SDK is purpose-built for the **Creator Economy** — enabling individual creators, fan communities, and autonomous AI agents to raise funds, govern campaigns, and send payments entirely on-chain.

### createCreatorDAO

Launch a new Creator DAO by submitting an on-chain governance proposal. Token holders vote to approve the campaign; once the proposal passes and executes, USDC is released from the treasury to the creator's wallet.

```typescript
import { SynArc, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  provider: window.ethereum,
})

// Launch a music creator's campaign
const txHash = await synarc.createCreatorDAO({
  name: 'Lepton — Debut EP',
  description: 'Fund the production and release of my debut EP on Arc Network.',
  goalUSDC: 500,
  template: 'music',
  milestones: [
    'Studio recording sessions complete',
    'Mixing and mastering finalized',
    'EP released on streaming platforms',
  ],
})
console.log(`Creator DAO proposal submitted! Tx: ${txHash}`)
```

**Supported templates:** `'music'` | `'video'` | `'art'` | `'writing'` | `'software'` | `'general'`

**Parameters (`CreatorDAOParams`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ✅ | Display name of the DAO / campaign |
| `description` | `string` | ✅ | Short description of the creator's goal |
| `goalUSDC` | `string \| number` | ✅ | Target funding amount in USDC |
| `template` | `CreatorDAOTemplate` | — | Pre-built campaign type (default: `'general'`) |
| `recipient` | `0x${string}` | — | Payout wallet; defaults to caller's address |
| `milestones` | `string[]` | — | Optional milestone titles for milestone-gated funding |

---

### supportCreator

Send a direct USDC nanopayment to a creator's wallet. Works for micro-amounts like `$0.01` or `$0.10` — ideal for Lepton-style low-latency fan micropayments.

```typescript
// Fan sends $0.10 to Lepton
await synarc.supportCreator('0xLeptonWalletAddress', 0.10)

// Fan sends $1.00
await synarc.supportCreator('0xLeptonWalletAddress', 1.00)

// AI agent sends $5.00 autonomously
await synarc.supportCreator('0xLeptonWalletAddress', 5.00)
```

---

### getCreatorProfile

Fetch a creator's full profile including on-chain stats (voting power, USDC balance) merged with optional off-chain metadata (name, bio, slug, raised totals).

```typescript
// Look up by wallet address (always works)
const profile = await synarc.getCreatorProfile('0xLeptonWalletAddress')

// Look up by slug — requires creatorApiUrl in config
const profileBySlug = await synarc.getCreatorProfile('lepton')

console.log(profile.name)                // 'Lepton'
console.log(profile.bio)                 // 'Electronic music producer...'
console.log(profile.stats.balanceUSDC)  // '42.50'
console.log(profile.totalRaisedUSDC)    // '1250.00'
console.log(profile.supporterCount)     // 87
```

**With off-chain API:**
```typescript
const synarc = new SynArc({
  ...SYNARC_TESTNET,
  creatorApiUrl: 'https://api.synarcdao.xyz',
})

const profile = await synarc.getCreatorProfile('lepton')
```

**Returns (`CreatorProfile`):**

| Field | Type | Description |
|-------|------|-------------|
| `address` | `0x${string}` | Creator's wallet address |
| `slug` | `string` | Human-readable slug (e.g. `'lepton'`) |
| `name` | `string` | Display name |
| `bio` | `string` | Short bio |
| `template` | `CreatorDAOTemplate` | Campaign template type |
| `stats` | `CreatorStats` | On-chain `{ votingPower, balanceUSDC }` |
| `totalRaisedUSDC` | `string` | All-time USDC raised |
| `supporterCount` | `number` | Number of unique supporters |

---

### getCreatorCampaigns

List all active Creator DAO campaigns. Scans on-chain `ProposalCreated` events for `[CreatorDAO:*]` tagged proposals, or fetches enriched data from the configured `creatorApiUrl`.

```typescript
const campaigns = await synarc.getCreatorCampaigns()

campaigns.forEach(c => {
  console.log(`${c.name} (${c.template}) — Goal: ${c.goalUSDC} USDC`)
  console.log(`  Progress: ${c.progress}% — Active: ${c.isActive}`)
  c.milestones.forEach(m => console.log(`  [${m.completed ? '✅' : '⬜'}] ${m.title}`))
})
```

**Returns (`CreatorCampaign[]`):**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | On-chain proposal ID |
| `creatorAddress` | `0x${string}` | Creator's wallet address |
| `name` | `string` | Campaign name |
| `description` | `string` | Campaign description |
| `template` | `CreatorDAOTemplate` | Campaign type |
| `goalUSDC` | `string` | Funding goal in USDC |
| `raisedUSDC` | `string` | Amount raised so far |
| `progress` | `number` | Percentage of goal (0–100) |
| `isActive` | `boolean` | Whether accepting support |
| `milestones` | `Array<{ id, title, completed }>` | Milestone list |

---

### AI Agent — Full Creator Economy Workflow

```typescript
import { SynArc, SYNARC_TESTNET } from 'synarc-agent-sdk'

const agent = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
  rpcUrl: 'https://rpc.testnet.arc.network',
  creatorApiUrl: 'https://api.synarcdao.xyz',
})

// 1. Discover active campaigns
const campaigns = await agent.getCreatorCampaigns()
console.log(`Found ${campaigns.length} active Creator DAOs`)

// 2. Get Lepton's profile
const lepton = await agent.getCreatorProfile('lepton')
console.log(`Lepton has raised ${lepton.totalRaisedUSDC} USDC from ${lepton.supporterCount} supporters`)

// 3. Autonomously send a $0.50 nanopayment to support
if (lepton.stats.balanceUSDC < '100') {
  const tx = await agent.supportCreator(lepton.address, 0.50)
  console.log(`Sent $0.50 nanopayment to Lepton! Tx: ${tx}`)
}

// 4. Launch a new Creator DAO for a new creator
const daoTx = await agent.createCreatorDAO({
  name: 'New Artist — Visual Album',
  description: 'Funding a visual album project combining original music and short films.',
  goalUSDC: 1000,
  template: 'video',
  milestones: [
    'Script and storyboard complete',
    'Filming wrapped',
    'Post-production complete',
    'Visual album released',
  ],
})
console.log(`New Creator DAO launched! Tx: ${daoTx}`)
```

---

## Treasury Agent

The SynArc SDK provides a built-in **Treasury Rebalancer Agent** submodule. This allows developers to construct autonomous AI agents that monitor treasury funds, propose rebalances, and execute cross-chain USDC bridging via Circle's Cross-Chain Transfer Protocol (CCTP).

### 1. Monitor Treasury
Query the current treasury balance and automatically identify rebalancing opportunities based on configured threshold parameters:
```typescript
import { SynArc, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  ...SYNARC_TESTNET,
  rebalanceThresholdUSDC: 50000, // Trigger rebalance suggestion when USDC > 50,000
})

const check = await synarc.monitorTreasury()
if (check.needsRebalance) {
  console.log(`Recommendation: Bridge ${check.suggestedAmountUSDC} USDC to ${check.suggestedTargetChain}`)
}
```

### 2. Propose Rebalance
Submit a governance proposal to rebalance a specified amount of treasury USDC. This proposes to withdraw the USDC to the executor/agent wallet so that it can be bridged:
```typescript
const txHash = await synarc.createRebalanceProposal({
  amountUSDC: 25000,
  targetChain: 'Arbitrum',
  targetDomain: 3, // Circle CCTP Domain ID for Arbitrum
  mintRecipient: '0xRecipientAddressOnArbitrum',
  reason: 'Optimize yield opportunities and secure treasury allocations.',
})
console.log(`Rebalance proposal submitted! Tx: ${txHash}`)
```

### 3. Execute CCTP Rebalance
Once the proposal passes voting and is executed on-chain, the agent wallet receives the treasury USDC. The agent then calls `approve` and executes Circle's CCTP `depositForBurn` to bridge the funds:
```typescript
const agent = new SynArc({
  ...SYNARC_TESTNET,
  tokenMessengerAddress: '0xCircleTokenMessengerAddress',
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
})

const bridgeTx = await agent.executeCCTPRebalance('proposalId')
console.log(`Cross-chain rebalance initiated! CCTP Tx: ${bridgeTx}`)
```

### 4. Full Autonomous Agent Workflow
```typescript
import { SynArc, SYNARC_TESTNET, SynArcTreasuryAgent } from 'synarc-agent-sdk'

const synarc = new SynArc({
  ...SYNARC_TESTNET,
  tokenMessengerAddress: '0xd0C3da4E20F0D24dB1cE8f1fF36814Ea8F60309e', // CCTP Messenger
  rebalanceThresholdUSDC: 50000,
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
  rpcUrl: 'https://rpc.testnet.arc.network',
})

const rebalancer = new SynArcTreasuryAgent(synarc)

// 1. Monitor Treasury
const status = await rebalancer.monitorTreasury()
if (status.needsRebalance) {
  // 2. Submit proposal autonomously
  const proposalTx = await rebalancer.createRebalanceProposal({
    amountUSDC: status.suggestedAmountUSDC,
    targetChain: status.suggestedTargetChain,
    targetDomain: status.suggestedTargetDomain,
    mintRecipient: '0xAgentRecipientWalletOnEthereum',
    reason: status.reason,
  })
  console.log(`Rebalance proposed: ${proposalTx}`)
}

// 3. Inspect actions log
const actions = await rebalancer.getAgentActions()
for (const action of actions) {
  if (action.status === 'Executed' && action.type === 'RebalanceProposed') {
    // 4. Execute CCTP rebalance autonomously
    const bridgeTx = await rebalancer.executeCCTPRebalance(action.id)
    console.log(`Executed CCTP bridge for proposal ${action.id}. Tx: ${bridgeTx}`)
  }
}
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
- `tokenMessengerAddress?: string` — (Optional) Circle CCTP Token Messenger contract address.
- `rebalanceThresholdUSDC?: string | number` — (Optional) USDC threshold triggering rebalance monitoring suggestions.
- `creatorApiUrl?: string` — (Optional) Off-chain creator registry API for slug resolution and enriched metadata.
- `rpcUrl?: string` — (Optional) Custom RPC node URL.
- `privateKey?: string` — (Optional) 0x-prefixed private key for server environments (AI Agents).
- `provider?: any` — (Optional) EIP-1193 Ethereum provider.
- `walletClient?: any` — (Optional) Pre-built custom `viem` WalletClient.

### Creator & Nanopayment Methods

#### `createCreatorDAO(params: CreatorDAOParams): Promise<string>`
Launches a new Creator DAO by submitting an on-chain governance proposal that encodes a treasury withdrawal to the creator's wallet. Token holders vote to approve; execution releases funds. Returns the transaction hash.

#### `supportCreator(creatorWallet: string, amount: string | number): Promise<string>`
Executes an on-chain USDC transfer transaction sending a nanopayment directly to the creator's wallet. Parses decimals automatically (6 decimals for USDC). Returns the transaction hash.

#### `getCreatorProfile(slugOrAddress: string): Promise<CreatorProfile>`
Fetches on-chain stats for a creator wallet merged with optional off-chain metadata. Accepts a 0x address (always) or human-readable slug (requires `creatorApiUrl`). Returns a full `CreatorProfile` object.

#### `getCreatorCampaigns(): Promise<CreatorCampaign[]>`
Returns all active Creator DAO campaigns. Scans on-chain `ProposalCreated` events for `[CreatorDAO:*]` tagged proposals, or fetches from `creatorApiUrl` if configured.

#### `getCreatorStats(creatorWallet: string): Promise<CreatorStats>`
Queries and returns the creator's voting power and USDC wallet balance:
```typescript
interface CreatorStats {
  votingPower: string // Format: 18 decimals (SYN token)
  balanceUSDC: string // Format: 6 decimals (USDC token)
}
```

### Treasury Agent Methods

#### `createRebalanceProposal(params: RebalanceProposalParams): Promise<string>`
Submits an on-chain governance proposal to withdraw a specified amount of treasury USDC to the agent's executor wallet. Once the proposal passes, the agent can bridge the funds. Returns the transaction hash.

#### `executeCCTPRebalance(proposalId: string): Promise<string>`
Calls USDC approval and the CCTP `TokenMessenger` contract's `depositForBurn` function to initiate a cross-chain transfer of the rebalanced funds. Must be called after the corresponding governance proposal is Executed. Returns the transaction hash.

#### `monitorTreasury(): Promise<MonitorTreasuryResult>`
Queries treasury USDC balances and evaluates them against the configured threshold, suggesting rebalances and target domain details.

#### `getAgentActions(): Promise<AgentAction[]>`
Scans ProposalCreated events to return a history of all proposed and executed treasury rebalances.

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
- `SynArcCreator`: Exposes `createCreatorDAO`, `supportCreator`, `getCreatorProfile`, `getCreatorStats`, and `getCreatorCampaigns`.
- `SynArcGovernance`: Exposes proposal and voting functions.
- `SynArcTreasury`: Exposes treasury balance and deposit methods.
- `SynArcTreasuryAgent`: Exposes `monitorTreasury`, `createRebalanceProposal`, `executeCCTPRebalance`, and `getAgentActions`.

```typescript
import { SynArcTreasuryAgent, SYNARC_TESTNET } from 'synarc-agent-sdk'

const agent = new SynArcTreasuryAgent({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  tokenMessengerAddress: '0xCircleMessengerAddress',
})

// Monitor rebalance recommendations
const report = await agent.monitorTreasury()
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
