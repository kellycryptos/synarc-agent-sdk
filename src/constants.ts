export const ARC_TESTNET = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
    public: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' }
  }
} as const;

// Arc Mainnet Production Chain Configuration
export const ARC_MAINNET = {
  id: 5042,
  name: 'Arc Mainnet',
  network: 'arc-mainnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.arc.io', 'https://rpc.arc.network'] },
    public: { http: ['https://rpc.mainnet.arc.io', 'https://rpc.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://explorer.arc.io' },
    arcscan: { name: 'ArcScan', url: 'https://arcscan.app' }
  }
} as const;

export const SYNARC_TESTNET = {
  governor: '0x83Fa2adf3f66e4951D7E9F2576a79e9d644aE25e',

  // ── Two-Treasury Architecture (Syn DAO) ───────────────────────────────────
  // Primary governance treasury (timelocked). Source of truth for all
  // user-facing balance displays, dashboard stats, and governance proposals.
  treasuryGovernance: '0xFE0F6bF45D363d34CD5fC1781594a7471736dC18',

  // Agent operating treasury. Used exclusively by the autonomous treasury agent
  // for instant CCTP rebalances. NOT surfaced in the main UI.
  treasuryAgent: '0xE6bAC65d7f060B805B8dd6f1c4DBfa6571905f28',

  // Legacy alias — resolves to governance treasury.
  get treasury() { return this.treasuryGovernance },

  token: '0xBd0C6b83DaBF2c04Ab762C262ea0B036d2D1368e',
  eurc: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a',
  usdc: '0x3600000000000000000000000000000000000000',
  agent: '0x88BdF819466C1802ce6C780a9fbdF3A314cab07D',
  tokenMessenger: '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
  messageTransmitter: '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275',
  crowdfund: '0xd5374DFC4B01F60115A52Df027704062506b3030',
  agentReleaseCapUSDC: 50,
  agentReleaseCapMicro: 50000000n,
} as const;

// Arc Mainnet Production Contracts — Deployed 2026-10-01 on Arc Mainnet (Chain ID 5042)
export const SYNARC_MAINNET = {
  governor: '0x4f76Fc6a76b16F58826739aC8EeCf7067FDE0025',
  treasuryGovernance: '0x8205e9782Fe54fD2aaD895b436B695db169F3d7B',
  treasuryAgent: '0x88BdF819466C1802ce6C780a9fbdF3A314cab07D',
  get treasury() { return this.treasuryGovernance },
  token: '0x8f4b429794ABa4607d177b100Cc5e481D22d0ad4',
  eurc: '0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1',
  usdc: '0x3600000000000000000000000000000000000000',
  agent: '0x88BdF819466C1802ce6C780a9fbdF3A314cab07D',
  tokenMessenger: '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d',
  messageTransmitter: '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
  crowdfund: '0xd5374DFC4B01F60115A52Df027704062506b3030',
  deployerReviewer: '0xE819090D7810D89f2E86e167d0b58425dEd745D8',
  agentReleaseCapUSDC: 50,
  agentReleaseCapMicro: 50000000n,
} as const;

export const ARC_NETWORKS = {
  testnet: ARC_TESTNET,
  mainnet: ARC_MAINNET,
} as const;

export const SYNARC_CONTRACTS = {
  testnet: SYNARC_TESTNET,
  mainnet: SYNARC_MAINNET,
} as const;

// Named exports for convenience
export const TREASURY_GOVERNANCE_ADDRESS = SYNARC_TESTNET.treasuryGovernance;
export const TREASURY_AGENT_ADDRESS      = SYNARC_TESTNET.treasuryAgent;
export const MAINNET_TREASURY_ADDRESS     = SYNARC_MAINNET.treasuryGovernance;
export const MAINNET_GOVERNOR_ADDRESS     = SYNARC_MAINNET.governor;
export const MAINNET_TOKEN_ADDRESS        = SYNARC_MAINNET.token;
export const MAINNET_AGENT_ADDRESS        = SYNARC_MAINNET.agent;

