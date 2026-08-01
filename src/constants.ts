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

// Arc Mainnet Placeholder Chain ID (Expected ~5042 — update when official Public Mainnet opens)
export const ARC_MAINNET = {
  id: 5042,
  name: 'Arc Mainnet',
  network: 'arc-mainnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.arc.network'] },
    public: { http: ['https://rpc.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://arcscan.app' }
  }
} as const;

export const SYNARC_TESTNET = {
  governor: '0x83Fa2adf3f66e4951D7E9F2576a79e9d644aE25e',

  // ── Two-Treasury Architecture ──────────────────────────────────────────────
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
  tokenMessenger: '0xd0C3da4E20F0D24dB1cE8f1fF36814Ea8F60309e',
  crowdfund: '0xd5374DFC4B01F60115A52Df027704062506b3030',
} as const;

// Arc Mainnet Contract Placeholders — update after Mainnet contract deployment
export const SYNARC_MAINNET = {
  governor: '0x0000000000000000000000000000000000000000',
  treasuryGovernance: '0x0000000000000000000000000000000000000000',
  treasuryAgent: '0x0000000000000000000000000000000000000000',
  get treasury() { return this.treasuryGovernance },
  token: '0x0000000000000000000000000000000000000000',
  eurc: '0x0000000000000000000000000000000000000000',
  usdc: '0x0000000000000000000000000000000000000000',
  agent: '0x0000000000000000000000000000000000000000',
  tokenMessenger: '0x0000000000000000000000000000000000000000',
  crowdfund: '0x0000000000000000000000000000000000000000',
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

