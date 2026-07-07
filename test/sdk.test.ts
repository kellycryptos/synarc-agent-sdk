import { describe, it, expect } from 'vitest'
import {
  SynArc,
  SynArcGovernance,
  SynArcTreasury,
  SynArcCreator,
  SynArcTreasuryAgent,
  SYNARC_TESTNET,
  ARC_TESTNET,
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
})
