import { SynArc, SYNARC_MAINNET } from 'synarc-agent-sdk';

/**
 * Syn DAO Autonomous Agent Integration
 * Connects to Arc Mainnet (Chain ID: 5042)
 */
async function runAgent() {
  console.log('🤖 Initializing SynArc Autonomous Agent SDK...');

  // Initialize SDK with Arc Mainnet production contracts
  const synarc = new SynArc({
    network: 'mainnet',
    governorAddress: SYNARC_MAINNET.governor,
    treasuryAddress: SYNARC_MAINNET.treasuryGovernance,
    tokenAddress: SYNARC_MAINNET.token,
    usdcAddress: SYNARC_MAINNET.usdc,
  });

  console.log('🏛️ Governor:', SYNARC_MAINNET.governor);
  console.log('💰 Treasury (Timelocked):', SYNARC_MAINNET.treasuryGovernance);
  console.log('🛡️ Agent Release Cap:', `${SYNARC_MAINNET.agentReleaseCapUSDC} USDC`);

  // Query live on-chain treasury balances
  const balances = await synarc.getTreasuryBalance();
  console.log(`📊 Live Treasury Balance: ${balances.usdc} USDC | ${balances.eurc} EURC`);

  // Autonomous under-cap milestone release (<= 50 USDC with Three-Way Match verification)
  // Releases > 50 USDC automatically route to the 48h multisig human review queue.
}

runAgent().catch(console.error);
