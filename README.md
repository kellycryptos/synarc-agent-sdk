# synarc-agent-sdk — Syn DAO Agent SDK (formerly SynArc)

[![npm version](https://img.shields.io/npm/v/synarc-agent-sdk?color=emerald&style=for-the-badge)](https://www.npmjs.com/package/synarc-agent-sdk)
[![DefiLlama](https://img.shields.io/badge/DefiLlama-Listed-orange?style=for-the-badge)](https://defillama.com/protocol/syn-dao)
[![Circle Alliance](https://img.shields.io/badge/Circle_Alliance-Member-0052FF?style=for-the-badge)](https://partners.circle.com/partner/syn-dao)
[![YouTube](https://img.shields.io/badge/YouTube-@syndaopro-red?style=for-the-badge&logo=youtube)](https://youtube.com/@syndaopro)
[![Twitter Follow](https://img.shields.io/badge/X-@syndaopro-black?style=for-the-badge&logo=x)](https://x.com/syndaopro)

> Package name unchanged for backwards compatibility. Product is now **Syn DAO**, built on Arc.

> **The official SDK for Syn DAO** — Enabling businesses, creators, and DAOs to launch transparent organizations, receive USDC funding, and manage treasuries autonomously on Arc.

Syn DAO is a governance and treasury platform that enables businesses, creators, and DAOs to launch transparent organizations, receive USDC funding, and manage treasuries autonomously on Arc. Most corporate and community treasury tools require manual intervention, governance bottlenecks, and fragile bridging mechanics. Syn DAO fixes that by combining **milestone-gated business & creator escrows**, an **Autonomous Treasury Release Valve with Three-Way Match**, and **Circle CCTP** into one composable SDK.

---

## Features

- **Business & Organization Treasuries** — Programmable governance and multi-signature safeguards for corporate treasuries, vendor payments, and operational reserves.
- **Three-Way Match Release Valve** — Contract-enforced capital release requiring agreement between Governor proposal/order, IPFS deliverable CID, and payee address, backed by a 48h payee cooldown.
- **Autonomous Agent Release ($\le 50$ USDC)** — Autonomous agents trigger micro-payouts under policy with on-chain idempotency (zero replay attacks); $> 50$ USDC halts for human review.
- **Creator DAO & Milestone Escrows** — Deploy `SynArcCrowdfund` escrow contracts directly from your wallet. Funds are milestone-gated and released only when deliverables are verified.
- **USDC Nanopayments** — Direct micro-payments to recipient wallets on Arc Network; any amount from `$0.01` upward.
- **Automated Treasury Guard** — Autonomous agent supporting Auto Rebalancing (CCTP), Auto Payments (scheduled with 24h timelock), and Risk Monitoring with emergency pause.
- **Arc Earn & DeFi Vaults** — Autonomous deposit and yield operations in Morpho vaults on Arc via `@circle-fin/earn-kit`.
- **Bidirectional CCTP Bridge** — Native Circle burn-and-mint; Arc ↔ Ethereum, Base, and Avalanche without wrapper tokens.
- **Wallet-Agnostic** — MetaMask, Rabby, Circle Programmable Wallets, Coinbase, RainbowKit, WalletConnect, or raw private keys.
- **Read-Only Mode** — Query balances, campaigns, and treasury stats without connecting a wallet.

---

## Solutions & Architectural Blueprints

The SDK provides unified primitives across four primary personas:

### 1. Organizations & Enterprise
* **Dual-Treasury Governance**: Maintain a community-visible, timelocked reserve treasury alongside a fast-access operating account.
* **Document-Anchored Vendor Settlements**: Enforce the **Three-Way Match Release Valve** (`SynArcTreasury.sol`). Every capital outflow requires contract-level agreement between the on-chain governance order, an authentic IPFS deliverable CID, and the registered payee address.
* **Anti-Tamper Payroll**: Enforce a mandatory 48-hour cooldown on payee address modifications to neutralize prompt-injection and unauthorized address substitution attacks.
* **Separation of Duties**: Micro-payments ($\le 50$ USDC) execute autonomously under policy; any disbursement exceeding 50 USDC automatically halts on-chain for mandatory human multi-sig review.

### 2. Businesses & SMBs
* **Milestone-Gated Client Escrows**: Deploy isolated milestone-escrow contracts (`createCreatorDAO` / `SynArcCrowdfund`) for client retainers, SaaS delivery contracts, and consulting milestones. Capital is released only when deliverables are verified.
* **Zero-Slippage Cross-Chain Payments**: Accept native USDC from clients on Ethereum, Base, or Avalanche and route funds 1:1 to Arc via native **Circle CCTP** burn-and-mint without wrapper tokens or liquidity pool fees.
* **Non-Custodial Working Capital Yield**: Put idle corporate treasury reserves to work in curated Morpho vaults on Arc via `SynArcEarn` (`@circle-fin/earn-kit`).

### 3. Communities & DAOs
* **Delegated Checkpointed Governance**: Full OpenZeppelin `ERC20Votes` support with snapshot-based delegation, preventing flash-loan double-voting attacks.
* **Creator DAO Launchpads**: Launch decentralized crowdfunds with customized durations, funding goals, and transparent milestone tracking.
* **Verifiable Grant Distributions**: Disburse ecosystem grants with public deliverable verification, transparent on-chain voting, and real-time execution telemetry.

### 4. Autonomous AI Agents
* **Autonomous Operating Accounts**: Grant AI agents programmatic wallets capable of executing sub-cap disbursements ($\le 50$ USDC) and rebalancing routines with zero human latency.
* **On-Chain Agent Identity (ERC-8004)**: Register agent metadata, capabilities, and owner addresses in the canonical on-chain Agent Registry (`0x8004A818BFB912233c491871b3d84c89A494BD9e`).
* **Automated Treasury Guard**: Continuous health monitoring, automated sweep triggers, and cross-chain rebalancing between Arc and Ethereum Sepolia via `SynArcTreasuryAgent`.
* **Idempotency Protection**: Hardware-style on-chain bit-flip guards eliminate replay attacks and accidental duplicate disbursements.

---

## Install

```bash
npm install synarc-agent-sdk
```

---

## Deployed Contracts & Network Reference

### Arc Mainnet — Production (`chainId: 5042`)

| Configuration / Contract | Value / Address | Description |
|:---|:---|:---|
| **Chain ID** | `5042` | Arc Mainnet Identifier |
| **RPC Endpoint** | `https://rpc.mainnet.arc.io` | Official Arc Mainnet RPC Endpoint |
| **SynArcTreasury (Release Valve)** | `0x8205e9782Fe54fD2aaD895b436B695db169F3d7B` | Three-Way Match Release Valve, Payee Cooldown & Idempotency Guard |
| **SynArcGovernor** | `0x4f76Fc6a76b16F58826739aC8EeCf7067FDE0025` | Document-Anchored Governance Engine (48h timelock) |
| **SynArcToken (sARC)** | `0x8f4b429794ABa4607d177b100Cc5e481D22d0ad4` | Primary Governance Token |
| **Authorized Operator Agent** | `0x88BdF819466C1802ce6C780a9fbdF3A314cab07D` | Autonomous AI Agent executing under-cap releases & rebalances |
| **Agent Release Cap** | `50.00 USDC` (`50_000_000 micro-USDC`) | Enforced on-chain: releases $\le 50$ autonomous; $> 50$ require human review |
| **Canonical USDC** | `0x3600000000000000000000000000000000000000` | Native Circle USDC (gas token) |
| **Canonical EURC** | `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` | Native Circle EURC on Arc Mainnet |
| **CCTP Token Messenger** | `0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d` | Production Circle CCTP Token Messenger |
| **CCTP Message Transmitter** | `0x81D40F21F12A8F0E3252Bccb954D722d4c464B64` | Production Circle CCTP Message Transmitter |
| **SynArcCrowdfund (Primary Mainnet Escrow)** | `0x99955b487aE5519a2b1Ff677f9bed3A6145b750d` | Milestone-Locked Creator DAO Escrow (Verified exact_match ✅) |
| **Authorized Human Reviewer** | `0xE819090D7810D89f2E86e167d0b58425dEd745D8` | Deployer EOA registered on-chain for emergency signoff |

### Arc Testnet — Developer Sandbox (`chainId: 5042002`)

| Configuration / Contract | Value / Address | Description |
|:---|:---|:---|
| **Chain ID** | `5042002` | Arc Testnet Chain Identifier |
| **RPC Endpoint** | `https://rpc.testnet.arc.network` | Primary RPC endpoint for testnet calls |
| **SynArcGovernor** | `0x83Fa2adf3f66e4951D7E9F2576a79e9d644aE25e` | Governance proposal and voting controller |
| **Governance Treasury (`treasuryGovernance`)** | `0xFE0F6bF45D363d34CD5fC1781594a7471736dC18` | Timelocked treasury for core DAO balances |
| **Agent Operating Treasury (`treasuryAgent`)** | `0xE6bAC65d7f060B805B8dd6f1c4DBfa6571905f28` | Fast-access agent operating reserves |
| **Crowdfund Factory / Template** | `0xd5374DFC4B01F60115A52Df027704062506b3030` | Deploys new campaign milestone escrows |
| **SynArcToken (sARC)** | `0xBd0C6b83DaBF2c04Ab762C262ea0B036d2D1368e` | Primary governance voting weight token |
| **Treasury Agent Contract** | `0x88BdF819466C1802ce6C780a9fbdF3A314cab07D` | On-chain autonomous agent rules executor |
| **CCTP Token Messenger** | `0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA` | Circle CCTP Token Messenger address |
| **CCTP Message Transmitter** | `0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275` | Circle CCTP Message Transmitter address |

### Two-Treasury Architecture

Syn DAO uses two separate treasury contracts by design:

- **Governance Treasury** (`0xFE0F6bF45D363d34CD5fC1781594a7471736dC18`) — The community-visible, timelocked treasury. All user-facing balance displays, governance proposals, and dashboard stats read from this contract. Withdrawals require a passing governance vote and a 24-hour timelock delay.
- **Agent Operating Treasury** (`0xE6bAC65d7f060B805B8dd6f1c4DBfa6571905f28`) — Used exclusively by the autonomous treasury agent for instant CCTP rebalances. Not surfaced to end users. Funded via governance-approved transfers from the main treasury.

Import the correct address for your use case:
```typescript
import { TREASURY_GOVERNANCE_ADDRESS, TREASURY_AGENT_ADDRESS } from 'synarc-agent-sdk'
```

---

## Circle Alliance Ecosystem & Core Rails

Syn DAO is an official member of the **Circle Alliance** ([partners.circle.com/partner/syn-dao](https://partners.circle.com/partner/syn-dao)), delivering native stablecoin infrastructure directly on Arc:

*   **Canonical Arc USDC** — *Native Arc Gas & Settlement*: Native Circle USDC (`0x3600000000000000000000000000000000000000`) powers all gas fee accounting, disbursements, and micro-escrows without synthetic bridges.
*   **Circle CCTP (Cross-Chain Transfer Protocol)** — *Fully Deployed & Functional*: Native burn-and-mint USDC routing between Arc Mainnet/Testnet, Ethereum, Base, and Avalanche. Executes burns, polls Circle's Iris attestation API, and triggers mint receipts on destination messengers.
*   **Circle App Kit & Programmable Wallets** — *Fully Deployed & Functional*: Provisioned dynamically for users using Circle's Web3 Services (W3S) with passkeys, social onboarding, and paymaster gas sponsorship.
*   **Circle Earn Kit & Morpho Vaults** — *Fully Deployed & Functional*: Automated treasury yield operations in curated Morpho vaults on Arc via `SynArcEarn`.
*   **Circle Gateway (x402 Nanopayments)** — *Simulated/Planned*: Tracks AI model execution fees for each inference call in `lib/agent/gateway-payments.ts`.
*   **Groq AI Engine** — *Fully Deployed & Functional*: Powers the agent's real-time treasury analysis engine in `lib/agent/treasury-agent.ts`.
*   **ERC-8004 Identity Registry** — *Fully Deployed & Functional*: Canonical registry (`0x8004A818BFB912233c491871b3d84c89A494BD9e`) registers agent identity autonomously on-chain.

---

## Customizing Governance & Determining Voting Weight

The Syn DAO governance protocol provides granular customizability over how voting weight is computed, how proposals pass, and how execution timelocks operate.

### How Voting Weight is Determined On-Chain

1. **Checkpointed sARC Tokens (`ERC20Votes`)**:
   - 1 delegated `sARC` = 1 base vote.
   - Balances are check-pointed by block height (`getPastVotes(account, blockNumber)`). Voting power is determined at the proposal snapshot block, making flash-loan manipulation impossible.
   - Token holders must delegate voting weight (either to themselves or a representative) before the proposal creation block to participate.

2. **USDC Economic Weighting Multiplier**:
   - In community and creator escrows, voting weight can factor in stable asset holdings or contribution amounts, aligning decision-making power with direct economic commitment.

### Pluggable Voting Weight Strategies

Developers integrating the SDK can implement custom voting weight strategies on top of the Governor contracts:

```typescript
import { SynArc, SYNARC_MAINNET } from 'synarc-agent-sdk';

const synarc = new SynArc({
  ...SYNARC_MAINNET,
});

/**
 * Strategy 1: Standard Token-Weighted (Default)
 * Direct check-pointed snapshot balance at proposal creation block.
 */
async function getTokenWeight(address: string, snapshotBlock: bigint): Promise<bigint> {
  return await synarc.getPastVotes(address, snapshotBlock);
}

/**
 * Strategy 2: Quadratic Voting Calculation
 * Voting Weight = sqrt(sARC Tokens)
 * Amplifies grassroots participation and dampens plutocratic whale dominance.
 */
function calculateQuadraticWeight(tokenBalanceRaw: bigint): bigint {
  if (tokenBalanceRaw < 0n) throw new Error("Negative balance");
  if (tokenBalanceRaw < 2n) return tokenBalanceRaw;
  let x0 = tokenBalanceRaw / 2n;
  let x1 = (x0 + tokenBalanceRaw / x0) / 2n;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + tokenBalanceRaw / x0) / 2n;
  }
  return x0;
}

/**
 * Strategy 3: Multi-Asset Weighted Blended Index
 * Combines sARC governance tokens, USDC gas reserves, EURC, and cirBTC:
 * Score = (sARC * 1.0) + (USDC * 0.5) + (EURC * 0.5) + (cirBTC_USD * 1.2)
 */
interface AssetBalances {
  sarc: number;
  usdc: number;
  eurc: number;
  cirBtcUsd: number;
}

function calculateBlendedVotingPower(balances: AssetBalances): number {
  return (
    balances.sarc * 1.0 +
    balances.usdc * 0.5 +
    balances.eurc * 0.5 +
    balances.cirBtcUsd * 1.2
  );
}

/**
 * Strategy 4: Reputation & Soulbound Agent Credentials
 * Queries ERC-8004 Agent Registry or soulbound badges to multiply voting weight.
 */
async function getAgentReputationMultiplier(agentAddress: string): Promise<number> {
  const isRegistered = await synarc.isRegisteredAgent(agentAddress);
  return isRegistered ? 1.25 : 1.0;
}
```

---

## Privacy Roadmap: Shielded Ballots & Private Disbursements (Coming Soon)

To support sensitive enterprise payroll, private corporate governance, and confidential contributor compensation, Syn DAO is developing native zero-knowledge privacy extensions for Arc:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SYN DAO PRIVACY ROADMAP (V3)                       │
├────────────────────────────────┬────────────────────────────────────────┤
│ 1. ZK Confidential Ballots     │ • Vote casting via ZK-SNARK proofs    │
│    (Private Governance)        │ • Verify weight without balance leak   │
│                                │ • Homomorphic on-chain tallying        │
├────────────────────────────────┼────────────────────────────────────────┤
│ 2. Shielded Disbursements      │ • Stealth addresses for payouts        │
│    (Confidential Payroll)      │ • Zero-knowledge vendor invoices       │
│                                │ • Shielded USDC grants & milestones    │
├────────────────────────────────┼────────────────────────────────────────┤
│ 3. Selective Compliance Keys   │ • Exportable viewing keys for audits   │
│    (Enterprise-Ready)          │ • Cryptographic proofs for tax/AML     │
└────────────────────────────────┴────────────────────────────────────────┘
```

* **ZK Confidential Ballots**: Voters prove voting eligibility and voting weight via client-side ZK-SNARK proofs without revealing their wallet address or balance, eliminating voter intimidation and bandwagon bias.
* **Shielded Disbursements & Stealth Payroll**: Support for stealth address derivation and shielded USDC transfers on Arc, enabling private disbursements while maintaining cryptographic proof of milestone completion.
* **Selective Compliance Viewing Keys**: Organizations can generate exportable cryptographic viewing keys for authorized auditors or tax authorities without making financial flows public.

---

## Quick Start

### ⚡ One-File Agent Quick-Start ([examples/quickstart.ts](examples/quickstart.ts))

Create a proposal and release funds with the SDK in under 50 lines:
- **Creates a proposal** anchored to an IPFS deliverable CID
- **Checks the Three-Way Match** via dry-run simulation against contract state
- **Releases automatically** if it passes and is under the autonomous agent cap (<= 50 USDC)
- **Prints the on-chain transaction hash**

```typescript
import { SynArcAgent } from "synarc-agent-sdk";

// Replace with your values
const config = {
  rpcUrl: "https://rpc.mainnet.arc.io",          // or your RPC
  privateKey: process.env.PRIVATE_KEY!,          // wallet with sARC + gas
  treasuryAddress: "0x8205e9782Fe54fD2aaD895b436B695db169F3d7B", // your mainnet treasury
  chainId: 5042,
};

async function main() {
  const agent = new SynArcAgent(config);

  // 1. Create a proposal
  console.log("Creating proposal...");
  const proposal = await agent.createProposal({
    title: "Pay invoice #42",
    description: "Milestone 1 deliverable",
    payee: "0x7f67D351Cc3A6e9695c0B8AA6DE2bE5Ce58b3d73", // example payee
    amount: "5",          // 5 USDC
    token: "USDC",
    deliverableCid: "bafybeic56p7jky57o6f7i7vub4u7y2a5vxgd", // real IPFS CID of the invoice/deliverable
  });
  console.log("Proposal created:", proposal.id);

  // 2. Check if it can be released (three-way match)
  console.log("Checking release conditions...");
  const check = await agent.checkRelease(proposal.id);
  console.log("Match result:", check);

  // 3. If under agent cap and match passes, release
  if (check.canRelease && check.amount <= 50) {
    console.log("Releasing via agent...");
    const tx = await agent.releaseMilestone(proposal.id);
    console.log("Released. Tx:", tx.hash);
  } else {
    console.log("Needs human review or match failed.");
  }
}

main().catch(console.error);
```

#### How to run it:
```bash
# 1. Install SDK
npm i synarc-agent-sdk

# 2. Set your private key
export PRIVATE_KEY=0xYourPrivateKey

# 3. Run
npx tsx examples/quickstart.ts
```

---

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

### Sync Direct Transfers (Fund Agent Treasury)

If a treasury receives USDC via direct ERC20 transfers (e.g., from governance-gated funding transfers to the Agent Operating Treasury), you must sync the internal balance tracking variables:

```typescript
import { SynArc, SYNARC_TESTNET, TREASURY_AGENT_ADDRESS } from 'synarc-agent-sdk'

const synarc = new SynArc({
  ...SYNARC_TESTNET,
  provider: window.ethereum,
})

// Trigger balance sync on the Agent Operating Treasury
const txHash = await synarc.syncBalance(TREASURY_AGENT_ADDRESS)
console.log(`Balances synced! Tx: ${txHash}`)
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
  creatorApiUrl: 'https://api.syndaopro.xyz', // optional: auto-registers campaign
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

### Milestone Escrow Backer Voting

Once a Creator DAO campaign is launched and funded, backing capital is milestone-gated. Backers can vote to release milestones or claim refunds:

```typescript
// 1. Backers vote to approve a completed milestone (voted weight matches their contribution)
const approveTx = await synarc.approveMilestone('0xEscrowContractAddress', 0) // milestone index
console.log(`Voted to approve milestone! Tx: ${approveTx}`)

// 2. Creator/recipient withdraws milestone budget after approval (>50% support)
const withdrawTx = await synarc.withdrawMilestone('0xEscrowContractAddress', 0)
console.log(`Milestone budget withdrawn! Tx: ${withdrawTx}`)

// 3. Backers claim their USDC refund if campaign fails to reach goal before deadline
const refundTx = await synarc.claimRefund('0xEscrowContractAddress')
console.log(`Refund claimed! Tx: ${refundTx}`)
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
  tokenMessengerAddress: '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
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

// Query full status report (paused state, rebalance limit, queued payments)
const statusReport = await agent.getAgentStatus()
console.log(`Agent Status:`, statusReport)

// Emergency stop — halts all agent operations
await agent.pause()

// Resume agent after review
await agent.unpause()

// Check and update max rebalance safety limit
const currentLimit = await agent.getMaxRebalanceAmount()
console.log(`Max rebalance: ${currentLimit} USDC`)

// Set a new safety limit (only owner can call this)
await agent.setMaxRebalanceAmount(50) // 50 USDC max per rebalance

// Propose returning bridged reserves back to the main Treasury contract on Arc Testnet via CCTP
const returnTx = await agent.proposeReturnFunds(100.0) // Return 100 USDC from Sepolia
console.log(`Return funds proposed! Tx: ${returnTx}`)
```

---

### 5. Full Autonomous Agent Loop

```typescript
import { SynArc, SynArcTreasuryAgent, SYNARC_TESTNET } from 'synarc-agent-sdk'

const synarc = new SynArc({
  ...SYNARC_TESTNET,
  agentAddress: '0x88BdF819466C1802ce6C780a9fbdF3A314cab07D',
  tokenMessengerAddress: '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
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

## Arc Earn & DeFi Vaults (SynArcEarn)

The `SynArcEarn` module enables autonomous treasury agents and DAOs to deploy capital into yield-bearing Morpho vaults on Arc Mainnet and Arc Testnet using `@circle-fin/earn-kit`.

### Setup

```typescript
import { SynArcEarn, SYNARC_TESTNET } from 'synarc-agent-sdk'

const earn = new SynArcEarn({
  ...SYNARC_TESTNET,
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
})
```

### 1. Explore Available Vaults
```typescript
const vaults = await earn.exploreVaults({ sortBy: 'apy' })
vaults.forEach(v => {
  console.log(`${v.name}: ${v.apy}% APY | TVL: $${v.tvl}`)
})
```

### 2. Deposit into Vault
```typescript
// Preview deposit quote
const quote = await earn.getDepositQuote({
  vaultAddress: '0xVaultAddress',
  amount: '100', // 100 USDC
})
console.log('Estimated shares:', quote.shares)

// Execute deposit
const txHash = await earn.deposit({
  vaultAddress: '0xVaultAddress',
  amount: '100',
})
console.log('Deposited! Tx:', txHash)
```

### 3. Check Position & Withdraw
```typescript
// Query current position
const position = await earn.getPosition({ vaultAddress: '0xVaultAddress' })
console.log(`Position balance: ${position.balance} USDC`)

// Redeem vault shares back to USDC
const withdrawTx = await earn.withdraw({
  vaultAddress: '0xVaultAddress',
  amount: '50',
})
console.log('Withdrawn! Tx:', withdrawTx)
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

const coinbase = new CoinbaseWalletSDK({ appName: 'Syn DAO' })
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
| `syncBalance(customTreasuryAddress?)` | `Promise<string>` | Sync internal balance state with actual contract ERC20 balance |
| `isTreasuryPaused()` | `Promise<boolean>` | Check if treasury is paused |
| `pauseTreasury()` | `Promise<string>` | Emergency pause the treasury |
| `unpauseTreasury()` | `Promise<string>` | Resume the treasury |
| `getTreasuryQueuedWithdrawals()` | `Promise<QueuedWithdrawal[]>` | List treasury queued withdrawals |
| `executeTreasuryWithdrawal(id)` | `Promise<string>` | Execute a treasury withdrawal |
| `cancelTreasuryWithdrawal(id)` | `Promise<string>` | Cancel a treasury withdrawal |

### Escrow Release Valve Methods (Arc Mainnet)

| Method | Returns | Description |
|--------|---------|-------------|
| `getAgentReleaseCap()` | `Promise<number>` | On-chain agent release cap in USDC (default: 50.00 USDC) |
| `isAuthorizedAgent(account)` | `Promise<boolean>` | Check if address is an authorized autonomous agent |
| `isAuthorizedReviewer(account)` | `Promise<boolean>` | Check if address is an authorized human/multisig reviewer |
| `getReleaseAuthorization(caller, amount, releaseKey)` | `Promise<ReleaseAuthorization>` | Pre-flight authorization status, cap, and required approvers |
| `setAgentReleaseCap(newCap)` | `Promise<string>` | Update on-chain cap (Governor / Owner only) |
| `setAuthorizedAgent(agent, authorized)` | `Promise<string>` | Grant/revoke agent release role |
| `setAuthorizedHumanReviewer(reviewer, authorized)` | `Promise<string>` | Grant/revoke human reviewer role |

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
| `SynArcEarn` | Arc Earn & Morpho Vault operations (explore vaults, deposit, redeem) |

```typescript
import { SynArcCreator, SynArcTreasuryAgent, SynArcEarn, SYNARC_TESTNET } from 'synarc-agent-sdk'

// Creator facade
const creator = new SynArcCreator({ ...SYNARC_TESTNET, provider: window.ethereum })
const txHash = await creator.createCreatorDAO({ name: 'My Project', description: '...', goalUSDC: 500 })

// Treasury Agent facade
const agent = new SynArcTreasuryAgent({
  ...SYNARC_TESTNET,
  agentAddress: '0x88BdF819466C1802ce6C780a9fbdF3A314cab07D',
  tokenMessengerAddress: '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
})

const report = await agent.monitorTreasury()

// Earn facade
const earn = new SynArcEarn({
  ...SYNARC_TESTNET,
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
})
const vaults = await earn.exploreVaults()
```

---

## Networks

| Network | Chain ID | Status | RPC URL |
|---------|----------|--------|---------|
| Arc Mainnet | 5042 | 🚀 Live | `https://rpc.mainnet.arc.io` |
| Arc Testnet | 5042002 | ✅ Live | `https://rpc.testnet.arc.network` |

## Links

- **Live App:** [syndaopro.xyz](https://syndaopro.xyz)
- **YouTube:** [@syndaopro](https://youtube.com/@syndaopro)
- **Twitter / X:** [@syndaopro](https://x.com/syndaopro)
- **Email:** [hello@syndaopro.xyz](mailto:hello@syndaopro.xyz)
- **GitHub:** [kellycryptos/synarc-agent-sdk](https://github.com/kellycryptos/synarc-agent-sdk)
- **Block Explorer:** [explorer.arc.io](https://explorer.arc.io) (Mainnet) · [testnet.arcscan.app](https://testnet.arcscan.app) (Testnet)
- **npm:** [synarc-agent-sdk](https://www.npmjs.com/package/synarc-agent-sdk)

## License

MIT
