# Changelog
 
All notable changes to `synarc-agent-sdk` will be documented in this file.

## [0.5.9] — 2026-10-09

- **Arc Mainnet Production Contracts**: Replaced placeholder constants in `SYNARC_MAINNET` with live deployed production addresses on Arc Mainnet (`chainId: 5042`):
  - `treasuryGovernance` / `treasury`: `0x8205e9782Fe54fD2aaD895b436B695db169F3d7B` (Three-Way Match Release Valve, 48h payee cooldown, idempotency guard)
  - `governor`: `0x4f76Fc6a76b16F58826739aC8EeCf7067FDE0025`
  - `token`: `0x8f4b429794ABa4607d177b100Cc5e481D22d0ad4` (sARC)
  - `usdc`: `0x3600000000000000000000000000000000000000` (Native Circle USDC gas token)
  - `eurc`: `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` (Native Circle EURC)
  - `agent` / `treasuryAgent`: `0x88BdF819466C1802ce6C780a9fbdF3A314cab07D` (Authorized Operator Agent)
  - `tokenMessenger`: `0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d`
  - `messageTransmitter`: `0x81D40F21F12A8F0E3252Bccb954D722d4c464B64`
  - `crowdfund`: `0xd5374DFC4B01F60115A52Df027704062506b3030`
  - `deployerReviewer`: `0xE819090D7810D89f2E86e167d0b58425dEd745D8`
- **RPC & Explorer Alignment**: Configured Arc Mainnet RPCs to `https://rpc.mainnet.arc.io` with fallback `https://rpc.arc.network` and Arc Explorer `https://explorer.arc.io`.
- **Escrow Release Policy**: Exported `agentReleaseCapUSDC: 50` and `agentReleaseCapMicro: 50000000n` constants.
- **Convenience Address Exports**: Added `MAINNET_TREASURY_ADDRESS`, `MAINNET_GOVERNOR_ADDRESS`, `MAINNET_TOKEN_ADDRESS`, and `MAINNET_AGENT_ADDRESS`.
- **Test Coverage**: Added tests for `SYNARC_MAINNET` contract constants and default mainnet network client resolution.

## [0.5.8] — 2026-10-06

- Added `SynArcEarn` module for autonomous Arc App Kit / Morpho vault operations (`exploreVaults`, `deposit`, `getPosition`, `withdraw`)
- Updated canonical Circle CCTP Token Messenger address (`0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA`) and Message Transmitter (`0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275`)
- Updated canonical Arc Testnet RPC endpoints to `https://rpc.testnet.arc.network`
- Added unit test coverage for `SynArcEarn` and verified live testnet integration

## [0.5.7] — 2026-09-29

- Added on-chain escrow release valve integration (`getAgentReleaseCap`, `getReleaseAuthorization`, `releaseMilestone`)
- Added on-chain cap queries and role checks
- Updated live web app and API URLs to `syndaopro.xyz`
- Aligned Agent Operating Treasury address with deployed contract `0xE6bAC65d7f060B805B8dd6f1c4DBfa6571905f28`

## [0.5.6] — 2026-09-25

- Added dynamic gas estimation with 20 Gwei floor and allowance checks
- Prepared multi-network support for Arc Testnet and Mainnet
- Enhanced Groq AI agent rebalance evaluation triggers

## [Branding] — 2026-09-14

- Product renamed to **Syn DAO** for Arc naming compliance
- Package name (`synarc-agent-sdk`) and API surface unchanged
- No contract address, ABI, or network config changes
- `package.json` description updated to "Agent SDK for Syn DAO — Built on Arc"
- README header updated; formerly SynArc noted for continuity

