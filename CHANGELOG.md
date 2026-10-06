# Changelog

All notable changes to `synarc-agent-sdk` will be documented in this file.

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

