# @synarc/agent-sdk

SDK for integrating SynArc governance and treasury on Arc Network.
Built for humans, organizations, and autonomous AI agents.

## Install

```bash
npm install @synarc/agent-sdk
```

---

## Wallet Support

`@synarc/agent-sdk` is fully wallet-agnostic. It integrates natively with any standard EIP-1193 ethereum provider, pre-built `viem` `WalletClient`, or a raw private key.

### 1. AI Agent (Private Key — Server-Side)
Ideal for autonomous AI agents executing governance actions programmatically without a browser.
```typescript
import { SynArc, SYNARC_TESTNET } from '@synarc/agent-sdk'

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  privateKey: process.env.AGENT_PRIVATE_KEY as `0x${string}`,
})
```

### 2. Browser Wallets (MetaMask / Rabby / OKX — Injected)
Integrate with standard injected wallets in browser environments.
```typescript
import { SynArc, SYNARC_TESTNET } from '@synarc/agent-sdk'

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  provider: window.ethereum,
})
```

### 3. Privy Embedded Wallet
Obtain the EIP-1193 provider from Privy's wallet handle.
```typescript
import { SynArc, SYNARC_TESTNET } from '@synarc/agent-sdk'
import { useWallets } from '@privy-io/react-auth'

const { wallets } = useWallets()
const provider = await wallets[0].getEip1193Provider()

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  provider,
})
```

### 4. Circle Programmable Wallet
Integrate with Circle's Web3 User-Controlled wallets.
```typescript
import { SynArc, SYNARC_TESTNET } from '@synarc/agent-sdk'

const provider = await circleWallet.getEip1193Provider()

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  provider,
})
```

### 5. Coinbase Wallet
Integrate using the Coinbase Wallet SDK provider.
```typescript
import { SynArc, SYNARC_TESTNET } from '@synarc/agent-sdk'
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'

const coinbase = new CoinbaseWalletSDK({ appName: 'SynArc DAO App' })
const provider = coinbase.makeWeb3Provider()

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  provider,
})
```

### 6. WalletConnect
Integrate with multi-wallet interfaces using WalletConnect.
```typescript
import { SynArc, SYNARC_TESTNET } from '@synarc/agent-sdk'
import { EthereumProvider } from '@walletconnect/ethereum-provider'

const provider = await EthereumProvider.init({ projectId: 'YOUR_PROJECT_ID' })

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  provider,
})
```

### 7. Read-Only Mode (No Wallet)
Query balances, state, and historical proposals directly from the network without connecting a wallet.
```typescript
import { SynArc, SYNARC_TESTNET } from '@synarc/agent-sdk'

const synarc = new SynArc({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
})

// Read methods work out-of-the-box
const balance = await synarc.getTreasuryBalance()
console.log(`Treasury Balance: ${balance.usdc} USDC, ${balance.eurc} EURC`)

const proposals = await synarc.getProposals()
console.log(`Total proposals: ${proposals.length}`)
```

---

## API Reference

### Initialization Config
The `SynArc` constructor takes a `SynArcConfig` object:
- `governorAddress: string` — Address of the Governor contract.
- `treasuryAddress: string` — Address of the Treasury contract.
- `tokenAddress: string` — Address of the Governance Token (SynArcToken).
- `eurcAddress?: string` — (Optional) EURC Token address on Arc Testnet.
- `usdcAddress?: string` — (Optional) USDC Token address on Arc Testnet.
- `rpcUrl?: string` — (Optional) Custom RPC node URL.
- `privateKey?: string` — (Optional) 0x-prefixed private key for server environments.
- `provider?: any` — (Optional) EIP-1193 Ethereum provider.
- `walletClient?: any` — (Optional) Pre-built custom `viem` WalletClient.

### Core Governance Methods

#### `createProposal(params: ProposalParams): Promise<string>`
Submits a new governance proposal. Returns the transaction hash.
```typescript
const txHash = await synarc.createProposal({
  title: 'Ecosystem Grant — Arc Builders',
  description: 'Allocate 500 USDC to fund Arc ecosystem development',
  targets: ['0xFE0F6bF45D363d34CD5fC1781594a7471736dC18'], // e.g. treasury address
  values: [0n],
  calldatas: ['0x']
})
```

#### `vote(proposalId: string, choice: VoteChoice): Promise<string>`
Casts a vote on a proposal. Automatically handles delegation first if the user hasn't delegated yet. Choices are `'For'`, `'Against'`, or `'Abstain'`. Returns the transaction hash.
```typescript
const txHash = await synarc.vote('1', 'For')
```

#### `delegate(delegateeAddress?: string): Promise<string>`
Delegates voting power to the target address. If no address is provided, it delegates to the user's own address. Returns the transaction hash.
```typescript
const txHash = await synarc.delegate()
```

#### `getVotingPower(walletAddress: string): Promise<string>`
Queries the current voting power (in decimals format) of the specified wallet address.
```typescript
const power = await synarc.getVotingPower('0x...')
```

#### `getProposals(): Promise<any[]>`
Lists all historical proposal events (`ProposalCreated`) from block zero.
```typescript
const proposals = await synarc.getProposals()
```

#### `getProposalState(proposalId: string): Promise<string>`
Queries the current state of a proposal. Returns one of: `'Pending'`, `'Active'`, `'Canceled'`, `'Defeated'`, `'Succeeded'`, `'Queued'`, `'Expired'`, `'Executed'`, or `'Unknown'`.
```typescript
const state = await synarc.getProposalState('1')
```

### Core Treasury Methods

#### `getTreasuryBalance(): Promise<TreasuryBalance>`
Retrieves the formatted USDC and EURC balances currently held in the treasury, along with the combined USD total valuation.
```typescript
const balance = await synarc.getTreasuryBalance()
console.log(`USDC: ${balance.usdc}, EURC: ${balance.eurc}, Total USD: ${balance.totalUSD}`)
```

#### `depositUSDC(amount: string): Promise<string>`
Approves and deposits the specified USDC amount to the treasury. Decimals are parsed automatically (6 decimals for USDC). Returns the deposit transaction hash.
```typescript
const txHash = await synarc.depositUSDC('250.00')
```

#### `depositEURC(amount: string): Promise<string>`
Approves and deposits the specified EURC amount to the treasury. Decimals are parsed automatically (6 decimals for EURC). Returns the deposit transaction hash.
```typescript
const txHash = await synarc.depositEURC('100.00')
```

---

## Sub-Modules

To keep code modular, the SDK exposes `SynArcGovernance` and `SynArcTreasury` sub-classes. They accept either an existing `SynArc` instance or a `SynArcConfig` directly.

```typescript
import { SynArcGovernance, SynArcTreasury, SYNARC_TESTNET } from '@synarc/agent-sdk'

// Instantation with config
const gov = new SynArcGovernance({
  governorAddress: SYNARC_TESTNET.governor,
  treasuryAddress: SYNARC_TESTNET.treasury,
  tokenAddress: SYNARC_TESTNET.token,
  privateKey: '0x...',
})

const proposals = await gov.getProposals()
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
