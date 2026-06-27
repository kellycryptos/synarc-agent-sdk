# synarc-agent-sdk

> **The official SDK for SynArc** — build Creator DAOs, autonomous treasury agents, and cross-chain payment flows on the Arc Network.

Most community treasury tools require manual intervention, governance bottlenecks, and fragile bridging mechanics. SynArc fixes that by combining **milestone-gated Creator DAOs**, an **Automated Treasury Guard**, and **Circle CCTP** into one composable SDK.

---

## Features

- **Creator DAO Deployment** — Deploy `SynArcCrowdfund` escrow contracts directly from your wallet. Funds are milestone-gated and only released to the creator when the community approves.
- **USDC Nanopayments** — Direct micro-payments to creator wallets on Arc Network; any amount from `$0.01` upward.
- **Automated Treasury Guard** — Autonomous agent supporting Auto Rebalancing (CCTP), Auto Payments (scheduled with 24h timelock), and Risk Monitoring with emergency pause.
- **Bidirectional CCTP Bridge** — Native Circle burn-and-mint; Arc Testnet ↔ Ethereum Sepolia without wrapper tokens.
- **Wallet-Agnostic** — MetaMask, Privy, Circle Programmable Wallets, Coinbase, WalletConnect, or raw private keys.
- **Read-Only Mode** — Query balances, campaigns, and treasury stats without connecting a wallet.

---

## Install

```bash
npm install synarc-agent-sdk
```

---

## Deployed Contracts (Arc Testnet — Chain ID 5042002)

| Contract | Address |
|----------|---------|
| **SynArcGovernor** | `0x83Fa2adf3f66e4951D7E9F2576a79e9d644aE25e` |
| **SynArcTreasury** | `0xFE0F6bF45D363d34CD5fC1781594a7471736dC18` |
| **SynArcToken** | `0xBd0C6b83DaBF2c04Ab762C262ea0B036d2D1368e` |
| **Treasury Agent** | `0x88BdF819466C1802ce6C780a9fbdF3A314cab07D` |
| **USDC (Arc Testnet)** | `0x3600000000000000000000000000000000000000` |
| **EURC (Arc Testnet)** | `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a` |
| **CCTP Token Messenger** | `0xd0C3da4E20F0D24dB1cE8f1fF36814Ea8F60309e` |

---

## Quick Start

### Read-Only (Check Balances)

```typescript
import { SynArc, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
})

const balance = await synarc.getTreasuryBalance()
console.log(`Treasury: ${balance.usdc} USDC / ${balance.eurc} EURC`)
```

### Fan Nanopayment (Direct USDC Support)

```typescript
const synarc = new SynArc({
  ...SYNARC_TESTNET,
  provider: window.ethereum, // EIP-1193 provider
})

// Send $5 USDC directly to a creator's wallet
const txHash = await synarc.supportCreator('0xCreatorWalletAddress', 5.00)
console.log(`Payment sent! Tx: ${txHash}`)
```

---

## Creator DAO

The Creator DAO system deploys an isolated `SynArcCrowdfund` escrow contract directly from the user's wallet. Supporters fund the escrow; funds are released to the creator when milestones pass community vote.

### createCreatorDAO

Deploy a new Creator DAO escrow contract:

```typescript
import { SynArc, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  ...SYNARC_TESTNET,
  provider: window.ethereum,
  creatorApiUrl: 'https://api.synarcdao.xyz', // optional: auto-registers campaign
})

const txHash = await synarc.createCreatorDAO({
  name: 'Debut EP — Kelly Music',
  description: 'Fund the production and release of my debut EP on Arc Network.',
  goalUSDC: 500,
  durationDays: 30,
  recipientWallet: '0xYourWalletAddress', // optional, defaults to caller
  imageUrl: 'https://example.com/cover.jpg', // optional
  template: 'music',
})
console.log(`Creator DAO deployed! Tx: ${txHash}`)
```

**Parameters (`CreatorDAOParams`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ✅ | Campaign / project name |
| `description` | `string` | ✅ | Short description of the creator's goal |
| `goalUSDC` | `string \| number` | ✅ | Target funding amount in USDC (also accepts `goal`) |
| `durationDays` | `number` | — | Campaign duration in days (default: `30`, range: 7–90) |
| `recipientWallet` | `0x${string}` | — | Payout wallet; defaults to caller's address (also accepts `recipient`) |
| `imageUrl` | `string` | — | Cover image URL for the campaign |
| `template` | `CreatorDAOTemplate` | — | Campaign type: `'music' \| 'art' \| 'writing' \| 'software' \| 'general'` |
| `isAgent` | `boolean` | — | Set `true` for AI agent treasury funds |
| `category` | `string` | — | Category label override |

---

### supportCreatorDAO

Fund a deployed Creator DAO escrow. Approves USDC and calls `fund()` on the contract:

```typescript
// Fund a Creator DAO with 50 USDC
const txHash = await synarc.supportCreatorDAO(
  '0xEscrowContractAddress',
  50
)
console.log(`Funded! Tx: ${txHash}`)
```

---

### getCreatorDAO

Read on-chain data from a deployed `SynArcCrowdfund` contract:

```typescript
const dao = await synarc.getCreatorDAO('0xEscrowContractAddress')

console.log(dao.title)          // 'Debut EP — Kelly Music'
console.log(dao.goal)           // '500.000000'
console.log(dao.raised)         // '320.000000'
console.log(dao.contributors)   // 12
console.log(dao.state)          // 'Active'
console.log(dao.milestones)     // [{ title, amount, description, status }]
```

**Returns (`CreatorDAO`):**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Escrow contract address |
| `title` | `string` | Campaign title |
| `description` | `string` | Campaign description |
| `category` | `string` | Category label |
| `goal` | `string` | Funding goal in USDC |
| `raised` | `string` | Amount raised so far |
| `contributors` | `number` | Number of unique contributors |
| `state` | `'Active' \| 'Voting' \| 'Completed' \| 'Refunded'` | Campaign state |
| `isAgent` | `boolean` | Whether this is an AI agent fund |
| `creator` | `0x${string}` | Deployer wallet |
| `recipient` | `0x${string}` | Payout wallet |
| `deadline` | `string` | ISO timestamp of campaign deadline |
| `milestones` | `CreatorDAOMilestone[]` | Milestone list |
| `escrowAddress` | `0x${string}` | Escrow contract address |

---

### getCreatorDAOs

List active Creator DAO campaigns (fetches from `creatorApiUrl` if configured):

```typescript
const daos = await synarc.getCreatorDAOs()
daos.forEach(d => {
  console.log(`${d.title} — ${d.raised}/${d.goal} USDC (${d.state})`)
})
```

---

### supportCreator

Send a direct USDC nanopayment straight to a creator's wallet (not an escrow):

```typescript
// Send $0.10 micropayment
await synarc.supportCreator('0xCreatorWalletAddress', 0.10)

// AI agent sends $5.00 autonomously
await synarc.supportCreator('0xCreatorWalletAddress', 5.00)
```

---

### getCreatorProfile

Fetch a creator's on-chain stats merged with optional off-chain metadata:

```typescript
// By wallet address
const profile = await synarc.getCreatorProfile('0xCreatorWalletAddress')

// By slug — requires creatorApiUrl in config
const profile = await synarc.getCreatorProfile('kelly-music')

console.log(profile.name)               // 'Kelly Music'
console.log(profile.stats.balanceUSDC) // '42.50'
console.log(profile.totalRaisedUSDC)   // '1250.00'
console.log(profile.supporterCount)    // 87
```

---

## Treasury Agent

The **Automated Treasury Guard** is an autonomous agent that protects workspace funds, automates payments, monitors risk, and bridges USDC cross-chain via Circle CCTP.

### Setup

```typescript
import { SynArc, SynArcTreasuryAgent, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  ...SYNARC_TESTNET,
  agentAddress: '0x88BdF819466C1802ce6C780a9fbdF3A314cab07D',
  tokenMessengerAddress: '0xd0C3da4E20F0D24dB1cE8f1fF36814Ea8F60309e',
  rebalanceThresholdUSDC: 100, // Recommend rebalance when USDC > 100
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
})

const agent = new SynArcTreasuryAgent(synarc)
```

---

### 1. Monitor Treasury

Query balances and get rebalance recommendations:

```typescript
const status = await agent.monitorTreasury()

if (status.needsRebalance) {
  console.log(`Bridge ${status.suggestedAmountUSDC} USDC to ${status.suggestedTargetChain}`)
  console.log(status.reason)
}
```

---

### 2. Auto Rebalance (CCTP)

Propose a cross-chain rebalance via governance, then execute it with Circle CCTP once approved:

```typescript
// Step 1: Propose rebalance
const proposalTx = await agent.createRebalanceProposal({
  amountUSDC: 50,
  targetChain: 'Ethereum',
  targetDomain: 0, // Circle CCTP Domain ID: 0=Ethereum, 3=Arbitrum, 6=Base
  mintRecipient: '0xRecipientOnEthereum',
  reason: 'Optimize yield allocations across chains.',
})
console.log(`Rebalance proposed: ${proposalTx}`)

// Step 2: After proposal is voted through and executed on-chain:
const bridgeTx = await agent.executeCCTPRebalance(proposalId)
console.log(`CCTP bridge initiated: ${bridgeTx}`)
```

---

### 3. Auto Payments (Scheduled with Timelock)

Queue a timelocked payment withdrawal from the agent contract. A 24-hour delay is enforced on-chain before execution:

```typescript
// Queue a payment (enforces 24h on-chain timelock)
const queueTx = await agent.queueWithdrawal(
  '0x3600000000000000000000000000000000000000', // USDC address
  '0xCreatorWalletAddress',                      // recipient
  25,                                            // 25 USDC
)
console.log(`Payment queued! Tx: ${queueTx}`)

// After 24 hours, execute the payment
const pendingWithdrawals = await agent.getQueuedWithdrawals()
for (const w of pendingWithdrawals) {
  if (!w.executed && !w.canceled) {
    const execTx = await agent.executeWithdrawal(w.id)
    console.log(`Payment executed: ${execTx}`)
  }
}
```

---

### 4. Risk Monitoring & Emergency Pause

The agent continuously monitors 4 risk signals: Low Liquidity, Large Outflow, Emergency Stop, and Inactivity. Use the SDK to read state and trigger emergency pauses:

```typescript
// Check if agent is paused on-chain
const paused = await agent.isPaused()
console.log(`Agent paused: ${paused}`)

// Emergency stop — halts all agent operations
await agent.pause()

// Resume agent after review
await agent.unpause()

// Check and update max rebalance safety limit
const currentLimit = await agent.getMaxRebalanceAmount()
console.log(`Max rebalance: ${currentLimit} USDC`)

// Set a new safety limit (only owner can call this)
await agent.setMaxRebalanceAmount(50) // 50 USDC max per rebalance
```

---

### 5. Full Autonomous Agent Loop

```typescript
import { SynArc, SynArcTreasuryAgent, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  ...SYNARC_TESTNET,
  agentAddress: '0x88BdF819466C1802ce6C780a9fbdF3A314cab07D',
  tokenMessengerAddress: '0xd0C3da4E20F0D24dB1cE8f1fF36814Ea8F60309e',
  rebalanceThresholdUSDC: 100,
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
})

const agent = new SynArcTreasuryAgent(synarc)

async function runAgentCycle() {
  // 1. Safety check — abort if agent is paused
  const isPaused = await agent.isPaused()
  if (isPaused) {
    console.log('Agent is paused. Skipping cycle.')
    return
  }

  // 2. Monitor treasury
  const status = await agent.monitorTreasury()
  console.log(`Treasury USDC: ${status.currentBalanceUSDC}`)

  if (status.needsRebalance) {
    // 3. Check max rebalance limit
    const maxLimit = await agent.getMaxRebalanceAmount()
    const amount = Math.min(
      parseFloat(status.suggestedAmountUSDC),
      parseFloat(maxLimit)
    )

    // 4. Propose rebalance
    const proposalTx = await agent.createRebalanceProposal({
      amountUSDC: amount,
      targetChain: status.suggestedTargetChain,
      targetDomain: status.suggestedTargetDomain,
      mintRecipient: '0xTreasuryWalletOnEthereum',
      reason: status.reason,
    })
    console.log(`Rebalance proposed: ${proposalTx}`)
  }

  // 5. Execute any proposals that passed governance
  const actions = await agent.getAgentActions()
  for (const action of actions) {
    if (action.type === 'RebalanceProposed' && action.status === 'Executed') {
      const bridgeTx = await agent.executeCCTPRebalance(action.id)
      console.log(`Bridged proposal ${action.id}: ${bridgeTx}`)
    }
  }
}

// Run every 30 seconds
setInterval(runAgentCycle, 30_000)
runAgentCycle()
```

---

## Wallet Integrations

### MetaMask / Rabby / OKX (Injected)
```typescript
const synarc = new SynArc({ ...SYNARC_TESTNET, provider: window.ethereum })
```

### Privy Embedded Wallet
```typescript
import { useWallets } from '@privy-io/react-auth'

const { wallets } = useWallets()
const provider = await wallets[0].getEip1193Provider()

const synarc = new SynArc({ ...SYNARC_TESTNET, provider })
```

### Circle Programmable Wallet
```typescript
const provider = await circleWallet.getEip1193Provider()
const synarc = new SynArc({ ...SYNARC_TESTNET, provider })
```

### Coinbase Wallet
```typescript
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'

const coinbase = new CoinbaseWalletSDK({ appName: 'SynArc' })
const provider = coinbase.makeWeb3Provider()
const synarc = new SynArc({ ...SYNARC_TESTNET, provider })
```

### WalletConnect
```typescript
import { EthereumProvider } from '@walletconnect/ethereum-provider'

const provider = await EthereumProvider.init({ projectId: '...' })
const synarc = new SynArc({ ...SYNARC_TESTNET, provider })
```

### AI Agent (Private Key — Server-Side)
```typescript
const synarc = new SynArc({
  ...SYNARC_TESTNET,
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
  rpcUrl: 'https://rpc.testnet.arc.network',
})
```

---

## API Reference

### SynArcConfig

| Field | Type | Description |
|-------|------|-------------|
| `governorAddress` | `0x${string}` | SynArcGovernor contract address |
| `treasuryAddress` | `0x${string}` | SynArcTreasury contract address |
| `tokenAddress` | `0x${string}` | SynArcToken governance token address |
| `agentAddress` | `0x${string}` | Treasury Agent contract address |
| `eurcAddress` | `0x${string}` | EURC token address on Arc Testnet |
| `usdcAddress` | `0x${string}` | USDC token address on Arc Testnet |
| `tokenMessengerAddress` | `0x${string}` | Circle CCTP Token Messenger address |
| `rebalanceThresholdUSDC` | `string \| number` | USDC threshold for rebalance recommendations |
| `creatorApiUrl` | `string` | Off-chain API for campaign/creator metadata |
| `rpcUrl` | `string` | Custom RPC URL |
| `privateKey` | `0x${string}` | Private key for server-side AI agents |
| `provider` | `any` | EIP-1193 browser wallet provider |
| `walletClient` | `any` | Pre-built `viem` WalletClient |

---

### Creator DAO Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `createCreatorDAO(params)` | `Promise<string>` | Deploy a SynArcCrowdfund escrow contract |
| `supportCreatorDAO(daoAddress, amount)` | `Promise<string>` | Approve + fund an escrow contract |
| `getCreatorDAO(daoAddress)` | `Promise<CreatorDAO>` | Read on-chain state of an escrow |
| `getCreatorDAOs()` | `Promise<CreatorDAO[]>` | List campaigns from API or on-chain |
| `supportCreator(wallet, amount)` | `Promise<string>` | Direct USDC nanopayment to a wallet |
| `getCreatorProfile(slugOrAddress)` | `Promise<CreatorProfile>` | Profile with on-chain + off-chain data |
| `getCreatorStats(wallet)` | `Promise<CreatorStats>` | Voting power + USDC balance |
| `getCreatorCampaigns()` | `Promise<CreatorDAO[]>` | Alias for `getCreatorDAOs()` |

---

### Treasury Agent Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `monitorTreasury()` | `Promise<MonitorTreasuryResult>` | Get balance + rebalance recommendation |
| `createRebalanceProposal(params)` | `Promise<string>` | Submit governance rebalance proposal |
| `executeCCTPRebalance(proposalId)` | `Promise<string>` | Execute CCTP bridge after proposal passes |
| `getAgentActions()` | `Promise<AgentAction[]>` | History of rebalance proposals/executions |
| `isPaused(agentAddress?)` | `Promise<boolean>` | Check if agent is emergency-stopped |
| `pause(agentAddress?)` | `Promise<string>` | Emergency stop the agent contract |
| `unpause(agentAddress?)` | `Promise<string>` | Resume the agent contract |
| `getMaxRebalanceAmount(agentAddress?)` | `Promise<string>` | Get current rebalance safety limit |
| `setMaxRebalanceAmount(amount, agentAddress?)` | `Promise<string>` | Update rebalance safety limit |
| `queueWithdrawal(token, recipient, amount, agentAddress?)` | `Promise<string>` | Queue a timelocked payment |
| `executeWithdrawal(id, agentAddress?)` | `Promise<string>` | Execute a queued payment after delay |
| `cancelWithdrawal(id, agentAddress?)` | `Promise<string>` | Cancel a queued payment |
| `getQueuedWithdrawals(agentAddress?)` | `Promise<QueuedAgentWithdrawal[]>` | List pending queued payments |

---

### Treasury Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getTreasuryBalance()` | `Promise<TreasuryBalance>` | USDC + EURC balances in treasury |
| `depositUSDC(amount)` | `Promise<string>` | Deposit USDC to treasury |
| `depositEURC(amount)` | `Promise<string>` | Deposit EURC to treasury |
| `isTreasuryPaused()` | `Promise<boolean>` | Check if treasury is paused |
| `pauseTreasury()` | `Promise<string>` | Emergency pause the treasury |
| `unpauseTreasury()` | `Promise<string>` | Resume the treasury |
| `getTreasuryQueuedWithdrawals()` | `Promise<QueuedWithdrawal[]>` | List treasury queued withdrawals |
| `executeTreasuryWithdrawal(id)` | `Promise<string>` | Execute a treasury withdrawal |
| `cancelTreasuryWithdrawal(id)` | `Promise<string>` | Cancel a treasury withdrawal |

---

### Governance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `createProposal(params)` | `Promise<string>` | Submit a general governance proposal |
| `vote(proposalId, choice)` | `Promise<string>` | Vote `'For'` / `'Against'` / `'Abstain'` |
| `delegate(delegateeAddress?)` | `Promise<string>` | Delegate voting power |
| `getVotingPower(wallet)` | `Promise<string>` | Get voting power for a wallet |
| `getProposals()` | `Promise<any[]>` | All historical proposals |
| `getProposalState(proposalId)` | `Promise<string>` | Current proposal state |

---

## Sub-Modules

| Class | Purpose |
|-------|---------|
| `SynArcCreator` | Creator DAO, nanopayments, profile, campaigns |
| `SynArcGovernance` | Proposals, voting, delegation |
| `SynArcTreasury` | Treasury balance, deposits, pause, timelocked withdrawals |
| `SynArcTreasuryAgent` | Rebalancing, CCTP bridging, auto payments, risk monitoring |

```typescript
import { SynArcCreator, SynArcTreasuryAgent, SYNARC_TESTNET } from 'synarc-agent-sdk'

// Creator facade
const creator = new SynArcCreator({ ...SYNARC_TESTNET, provider: window.ethereum })
const txHash = await creator.createCreatorDAO({ name: 'My Project', description: '...', goalUSDC: 500 })

// Treasury Agent facade
const agent = new SynArcTreasuryAgent({
  ...SYNARC_TESTNET,
  agentAddress: '0x88BdF819466C1802ce6C780a9fbdF3A314cab07D',
  tokenMessengerAddress: '0xd0C3da4E20F0D24dB1cE8f1fF36814Ea8F60309e',
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
})

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
- **npm:** [synarc-agent-sdk](https://www.npmjs.com/package/synarc-agent-sdk)

## License

MIT
