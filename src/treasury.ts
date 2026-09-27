import { SynArc } from './SynArc'
import { SynArcConfig, TreasuryBalance, QueuedWithdrawal, OrderTerms, SimulationResult, ReleaseMilestoneParams, ReleaseAuthorization } from './types'

export class SynArcTreasury {
  private synarc: SynArc

  constructor(configOrSynArc: SynArcConfig | SynArc) {
    if (configOrSynArc instanceof SynArc) {
      this.synarc = configOrSynArc
    } else {
      this.synarc = new SynArc(configOrSynArc)
    }
  }

  async getTreasuryBalance(): Promise<TreasuryBalance> {
    return this.synarc.getTreasuryBalance()
  }

  async depositUSDC(amount: string): Promise<string> {
    return this.synarc.depositUSDC(amount)
  }

  async depositEURC(amount: string): Promise<string> {
    return this.synarc.depositEURC(amount)
  }

  async isPaused(): Promise<boolean> {
    return this.synarc.isTreasuryPaused()
  }

  async pause(): Promise<string> {
    return this.synarc.pauseTreasury()
  }

  async unpause(): Promise<string> {
    return this.synarc.unpauseTreasury()
  }

  async executeWithdrawal(id: string | number | bigint): Promise<string> {
    return this.synarc.executeTreasuryWithdrawal(id)
  }

  async cancelWithdrawal(id: string | number | bigint): Promise<string> {
    return this.synarc.cancelTreasuryWithdrawal(id)
  }

  async getQueuedWithdrawals(): Promise<QueuedWithdrawal[]> {
    return this.synarc.getTreasuryQueuedWithdrawals()
  }

  async setWithdrawalDelay(newDelay: string | number | bigint): Promise<string> {
    return this.synarc.setTreasuryWithdrawalDelay(newDelay)
  }

  /**
   * syncBalance
   * Synchronizes the internal balance tracking variables on the Treasury contract
   * with the actual ERC20 balances held by the contract.
   * @param customTreasuryAddress - Optional custom treasury contract address to sync.
   * @returns Transaction hash.
   */
  async syncBalance(customTreasuryAddress?: `0x${string}`): Promise<string> {
    return this.synarc.syncBalance(customTreasuryAddress)
  }

  // ─── THREE-WAY MATCH & ADVERSARIAL ESCROW ─────────────────

  /**
   * simulateRelease
   * Dry-run simulation previewing a milestone release before execution (Ghostfolio pattern).
   */
  async simulateRelease(params: ReleaseMilestoneParams): Promise<SimulationResult> {
    return this.synarc.simulateRelease(params)
  }

  /**
   * releaseMilestone
   * Executes a contract-level Three-Way Match release of treasury funds.
   */
  async releaseMilestone(params: ReleaseMilestoneParams): Promise<string> {
    return this.synarc.releaseMilestone(params)
  }

  /**
   * registerOrder
   * Explicitly registers order terms for a proposal and milestone directly in Treasury.
   */
  async registerOrder(terms: OrderTerms): Promise<string> {
    return this.synarc.registerOrder(terms)
  }

  /**
   * requestPayeeChange
   * Requests a payout address update with an on-chain timelocked cooldown (defense against payee substitution).
   */
  async requestPayeeChange(proposalId: string | number | bigint, newTarget: `0x${string}`): Promise<string> {
    return this.synarc.requestPayeeChange(proposalId, newTarget)
  }

  /**
   * confirmPayeeChange
   * Confirms a pending payout target update after the mandatory cooldown period expires.
   */
  async confirmPayeeChange(proposalId: string | number | bigint): Promise<string> {
    return this.synarc.confirmPayeeChange(proposalId)
  }

  /**
   * approveReleaseHuman
   * Multisig / human operator approval required for disbursements exceeding the human review threshold.
   */
  async approveReleaseHuman(releaseKey: `0x${string}`): Promise<string> {
    return this.synarc.approveReleaseHuman(releaseKey)
  }

  /**
   * getAgentReleaseCap
   * Returns on-chain cap (in micro-USDC) under which agent can release without human signoff.
   */
  async getAgentReleaseCap(): Promise<bigint> {
    return this.synarc.getAgentReleaseCap()
  }

  /**
   * isAuthorizedAgent
   * Checks if an address is an authorized autonomous agent on the release valve.
   */
  async isAuthorizedAgent(account: `0x${string}`): Promise<boolean> {
    return this.synarc.isAuthorizedAgent(account)
  }

  /**
   * isAuthorizedReviewer
   * Checks if an address is an authorized human reviewer / governor.
   */
  async isAuthorizedReviewer(account: `0x${string}`): Promise<boolean> {
    return this.synarc.isAuthorizedReviewer(account)
  }

  /**
   * getReleaseAuthorization
   * Evaluates who can release and whether the release stops for human review under on-chain caps.
   */
  async getReleaseAuthorization(
    caller: `0x${string}`,
    amountUSDC: string | number,
    releaseKey: `0x${string}`
  ): Promise<ReleaseAuthorization> {
    return this.synarc.getReleaseAuthorization(caller, amountUSDC, releaseKey)
  }

  /**
   * setAgentReleaseCap
   * Updates on-chain agent release cap (governor or owner only).
   */
  async setAgentReleaseCap(newCapUSDC: string | number): Promise<string> {
    return this.synarc.setAgentReleaseCap(newCapUSDC)
  }

  /**
   * setAuthorizedAgent
   * Authorizes or deauthorizes an autonomous agent script address.
   */
  async setAuthorizedAgent(agent: `0x${string}`, authorized: boolean): Promise<string> {
    return this.synarc.setAuthorizedAgent(agent, authorized)
  }

  /**
   * setAuthorizedHumanReviewer
   * Authorizes or deauthorizes a human / multisig reviewer.
   */
  async setAuthorizedHumanReviewer(reviewer: `0x${string}`, authorized: boolean): Promise<string> {
    return this.synarc.setAuthorizedHumanReviewer(reviewer, authorized)
  }
}
