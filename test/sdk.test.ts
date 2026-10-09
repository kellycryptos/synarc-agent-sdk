import { describe, it, expect } from 'vitest'
import {
  SynArc,
  SynArcGovernance,
  SynArcTreasury,
  SynArcCreator,
  SynArcTreasuryAgent,
  SynArcEarn,
  SYNARC_TESTNET,
  SYNARC_MAINNET,
  ARC_TESTNET,
  ARC_MAINNET,
  MAINNET_TREASURY_ADDRESS,
  MAINNET_GOVERNOR_ADDRESS,
  MAINNET_TOKEN_ADDRESS,
} from '../src/index'

describe('SynArc SDK tests', () => {
  const config = {
    governorAddress: SYNARC_TESTNET.governor,
    treasuryAddress: SYNARC_TESTNET.treasury,
    tokenAddress: SYNARC_TESTNET.token,
    eurcAddress: SYNARC_TESTNET.eurc,
    usdcAddress: SYNARC_TESTNET.usdc,
  }

  it('should import and verify constant values correctly', () => {
    expect(ARC_TESTNET.id).toBe(5042002)
    expect(SYNARC_TESTNET.governor).toBe('0x83Fa2adf3f66e4951D7E9F2576a79e9d644aE25e')
    expect(SYNARC_TESTNET.treasury).toBe('0xFE0F6bF45D363d34CD5fC1781594a7471736dC18')
    expect(SYNARC_TESTNET.token).toBe('0xBd0C6b83DaBF2c04Ab762C262ea0B036d2D1368e')
    expect(SYNARC_TESTNET.eurc).toBe('0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a')
    expect(SYNARC_TESTNET.usdc).toBe('0x3600000000000000000000000000000000000000')

    // Arc Mainnet Production Contracts
    expect(ARC_MAINNET.id).toBe(5042)
    expect(SYNARC_MAINNET.governor).toBe('0x4f76Fc6a76b16F58826739aC8EeCf7067FDE0025')
    expect(SYNARC_MAINNET.treasury).toBe('0x8205e9782Fe54fD2aaD895b436B695db169F3d7B')
    expect(SYNARC_MAINNET.token).toBe('0x8f4b429794ABa4607d177b100Cc5e481D22d0ad4')
    expect(SYNARC_MAINNET.usdc).toBe('0x3600000000000000000000000000000000000000')
    expect(SYNARC_MAINNET.eurc).toBe('0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1')
    expect(SYNARC_MAINNET.agentReleaseCapUSDC).toBe(50)
    expect(SYNARC_MAINNET.agentReleaseCapMicro).toBe(50000000n)
    expect(MAINNET_TREASURY_ADDRESS).toBe(SYNARC_MAINNET.treasury)
    expect(MAINNET_GOVERNOR_ADDRESS).toBe(SYNARC_MAINNET.governor)
    expect(MAINNET_TOKEN_ADDRESS).toBe(SYNARC_MAINNET.token)
  })

  it('should instantiate SynArc on Arc Mainnet with production contracts by default', () => {
    const mainnetSdk = new SynArc({ network: 'mainnet' })
    expect(mainnetSdk.isReadOnly()).toBe(true)
    expect(mainnetSdk.publicClient.chain.id).toBe(5042)
  })

  it('should instantiate SynArc in read-only mode by default', () => {
    const synarc = new SynArc(config)
    expect(synarc.isReadOnly()).toBe(true)
    expect(synarc.walletType).toBe('read-only')
    expect(synarc.walletClient).toBeNull()
    expect(synarc.publicClient).toBeDefined()
  })

  it('should instantiate SynArc in private-key mode if privateKey is provided', () => {
    // Standard mock private key
    const mockPrivateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' as `0x${string}`
    const synarc = new SynArc({
      ...config,
      privateKey: mockPrivateKey,
    })
    expect(synarc.isReadOnly()).toBe(false)
    expect(synarc.walletType).toBe('private-key')
    expect(synarc.walletClient).toBeDefined()
  })

  it('should instantiate SynArcGovernance and delegate to SynArc correctly', () => {
    const synarc = new SynArc(config)
    const governance = new SynArcGovernance(synarc)
    expect(governance.createProposal).toBeDefined()
    expect(governance.vote).toBeDefined()
  })

  it('should instantiate SynArcTreasury and delegate to SynArc correctly', () => {
    const synarc = new SynArc(config)
    const treasury = new SynArcTreasury(synarc)
    expect(treasury.getTreasuryBalance).toBeDefined()
    expect(treasury.depositUSDC).toBeDefined()
    expect(treasury.depositEURC).toBeDefined()
    expect(treasury.syncBalance).toBeDefined()
  })

  it('should instantiate SynArcCreator and delegate to SynArc correctly', () => {
    const synarc = new SynArc(config)
    const creator = new SynArcCreator(synarc)
    expect(creator.supportCreator).toBeDefined()
    expect(creator.getCreatorStats).toBeDefined()
  })

  it('should have new Creator Economy methods defined on SynArcCreator', () => {
    const synarc = new SynArc(config)
    const creator = new SynArcCreator(synarc)
    expect(creator.createCreatorDAO).toBeDefined()
    expect(creator.getCreatorProfile).toBeDefined()
    expect(creator.getCreatorCampaigns).toBeDefined()
    expect(creator.approveMilestone).toBeDefined()
    expect(creator.withdrawMilestone).toBeDefined()
    expect(creator.claimRefund).toBeDefined()
  })

  it('should throw an error when createCreatorDAO is called in read-only mode', async () => {
    const synarc = new SynArc(config)
    await expect(
      synarc.createCreatorDAO({
        name: 'Test DAO',
        description: 'A test DAO description',
        goalUSDC: '500',
      })
    ).rejects.toThrow('Wallet required')
  })

  it('should instantiate SynArcTreasuryAgent and delegate correctly', () => {
    const synarc = new SynArc(config)
    const agent = new SynArcTreasuryAgent(synarc)
    expect(agent.createRebalanceProposal).toBeDefined()
    expect(agent.executeCCTPRebalance).toBeDefined()
    expect(agent.monitorTreasury).toBeDefined()
    expect(agent.getAgentActions).toBeDefined()
    expect(agent.getAgentStatus).toBeDefined()
    expect(agent.proposeReturnFunds).toBeDefined()
  })

  it('should throw an error when executing rebalance or proposing in read-only mode', async () => {
    const synarc = new SynArc(config)
    const agent = new SynArcTreasuryAgent(synarc)
    
    await expect(
      agent.createRebalanceProposal({
        amountUSDC: '1000',
        targetChain: 'Ethereum',
        targetDomain: 0,
        mintRecipient: '0x0000000000000000000000000000000000000000',
        reason: 'Test rebalance'
      })
    ).rejects.toThrow('Wallet required')

    await expect(
      agent.executeCCTPRebalance('1')
    ).rejects.toThrow('Wallet required')
  })

  it('should expose Three-Way Match methods on SynArcTreasury and SynArcTreasuryAgent', () => {
    const synarc = new SynArc(config)
    const treasury = new SynArcTreasury(synarc)
    const agent = new SynArcTreasuryAgent(synarc)

    // SynArcTreasury methods
    expect(treasury.simulateRelease).toBeDefined()
    expect(treasury.releaseMilestone).toBeDefined()
    expect(treasury.registerOrder).toBeDefined()
    expect(treasury.requestPayeeChange).toBeDefined()
    expect(treasury.confirmPayeeChange).toBeDefined()
    expect(treasury.approveReleaseHuman).toBeDefined()

    // SynArcTreasuryAgent methods
    expect(agent.simulateRelease).toBeDefined()
    expect(agent.releaseMilestone).toBeDefined()
    expect(agent.requestPayeeChange).toBeDefined()
    expect(agent.confirmPayeeChange).toBeDefined()
  })

  it('should throw "Wallet required" when calling Three-Way Match write methods in read-only mode', async () => {
    const synarc = new SynArc(config)
    const treasury = new SynArcTreasury(synarc)
    const agent = new SynArcTreasuryAgent(synarc)

    const releaseParams = {
      proposalId: 1,
      milestoneId: 1,
      documentHash: '0x1234567890123456789012345678901234567890123456789012345678901234' as `0x${string}`,
      invoiceHash: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd' as `0x${string}`,
      recipient: '0x0000000000000000000000000000000000000001' as `0x${string}`,
      amountUSDC: 25,
      aiConfidenceScore: 95,
    }

    await expect(treasury.releaseMilestone(releaseParams)).rejects.toThrow('Wallet required')
    await expect(agent.releaseMilestone(releaseParams)).rejects.toThrow('Wallet required')

    await expect(
      treasury.registerOrder({
        proposalId: 1,
        milestoneId: 1,
        recipient: '0x0000000000000000000000000000000000000001',
        amountUSDC: 25,
        expectedDocumentHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        deliverableURI: 'ipfs://deliverable',
      })
    ).rejects.toThrow('Wallet required')

    await expect(
      treasury.requestPayeeChange(1, '0x0000000000000000000000000000000000000002')
    ).rejects.toThrow('Wallet required')
    await expect(
      agent.requestPayeeChange(1, '0x0000000000000000000000000000000000000002')
    ).rejects.toThrow('Wallet required')

    await expect(treasury.confirmPayeeChange(1)).rejects.toThrow('Wallet required')
    await expect(agent.confirmPayeeChange(1)).rejects.toThrow('Wallet required')

    await expect(
      treasury.approveReleaseHuman('0x1234567890123456789012345678901234567890123456789012345678901234')
    ).rejects.toThrow('Wallet required')

    await expect(treasury.setAgentReleaseCap(100)).rejects.toThrow('Wallet required')
    await expect(
      treasury.setAuthorizedAgent('0x0000000000000000000000000000000000000001', true)
    ).rejects.toThrow('Wallet required')
    await expect(
      treasury.setAuthorizedHumanReviewer('0x0000000000000000000000000000000000000002', true)
    ).rejects.toThrow('Wallet required')
  })

  it('should expose escrow release valve cap and role query methods', () => {
    const synarc = new SynArc(config)
    const treasury = new SynArcTreasury(synarc)
    const agent = new SynArcTreasuryAgent(synarc)

    expect(treasury.getAgentReleaseCap).toBeDefined()
    expect(treasury.isAuthorizedAgent).toBeDefined()
    expect(treasury.isAuthorizedReviewer).toBeDefined()
    expect(treasury.getReleaseAuthorization).toBeDefined()
    expect(treasury.setAgentReleaseCap).toBeDefined()
    expect(treasury.setAuthorizedAgent).toBeDefined()
    expect(treasury.setAuthorizedHumanReviewer).toBeDefined()

    expect(agent.getAgentReleaseCap).toBeDefined()
    expect(agent.getReleaseAuthorization).toBeDefined()
  })

  it('should instantiate SynArcEarn and expose Arc Earn vault operations', () => {
    const earnTestnet = new SynArcEarn(config)
    expect(earnTestnet.getChain()).toBe('Arc_Testnet')
    expect(earnTestnet.exploreVaults).toBeDefined()
    expect(earnTestnet.getDepositQuote).toBeDefined()
    expect(earnTestnet.deposit).toBeDefined()
    expect(earnTestnet.getPosition).toBeDefined()
    expect(earnTestnet.getWithdrawalQuote).toBeDefined()
    expect(earnTestnet.withdraw).toBeDefined()

    const earnMainnet = new SynArcEarn({ ...config, network: 'mainnet' })
    expect(earnMainnet.getChain()).toBe('Arc')
  })
})

