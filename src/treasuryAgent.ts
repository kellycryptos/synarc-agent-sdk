import { SynArc } from './SynArc'
import { SynArcConfig, RebalanceProposalParams, MonitorTreasuryResult, AgentAction, QueuedAgentWithdrawal } from './types'

/**
 * SynArcTreasuryAgent
 * Focused submodule facade for Treasury Rebalancer Agent interactions — monitoring,
 * proposing, and executing CCTP rebalances.
 * Wraps the core SynArc client and delegates all calls to it.
 */
export class SynArcTreasuryAgent {
  private synarc: SynArc

  constructor(configOrSynArc: SynArcConfig | SynArc) {
    if (configOrSynArc instanceof SynArc) {
      this.synarc = configOrSynArc
    } else {
      this.synarc = new SynArc(configOrSynArc)
    }
  }

  /**
   * createRebalanceProposal
   * Creates a governance proposal to rebalance a specified amount of treasury USDC.
   * Proposes to withdraw the USDC to the executor/agent wallet to prepare for CCTP.
   * @param params - The parameters for the rebalance proposal.
   * @returns Transaction hash of the proposal submission.
   */
  async createRebalanceProposal(params: RebalanceProposalParams): Promise<string> {
    return this.synarc.createRebalanceProposal(params)
  }

  /**
   * executeCCTPRebalance
   * Executes the Circle CCTP cross-chain transfer of USDC.
   * Must be called after the corresponding governance rebalance proposal passes and executes.
   * @param proposalId - The ID of the rebalance proposal.
   * @returns Transaction hash.
   */
  async executeCCTPRebalance(proposalId: string): Promise<string> {
    return this.synarc.executeCCTPRebalance(proposalId)
  }

  /**
   * monitorTreasury
   * Queries treasury balances and compares current USDC against target threshold limits,
   * returning rebalance suggestions if action is needed.
   * @returns Suggestions for rebalancing.
   */
  async monitorTreasury(): Promise<MonitorTreasuryResult> {
    return this.synarc.monitorTreasury()
  }

  /**
   * getAgentActions
   * Retrieves a history of all treasury rebalance proposal and bridge execution events.
   * @returns List of agent rebalance actions.
   */
  async getAgentActions(): Promise<AgentAction[]> {
    return this.synarc.getAgentActions()
  }

  /**
   * isPaused
   * Checks if the agent contract is paused on-chain.
   */
  async isPaused(agentAddress?: `0x${string}`): Promise<boolean> {
    return this.synarc.isAgentPaused(agentAddress)
  }

  /**
   * pause
   * Emergency stops the agent contract, preventing it from executing actions.
   */
  async pause(agentAddress?: `0x${string}`): Promise<string> {
    return this.synarc.pauseAgent(agentAddress)
  }

  /**
   * unpause
   * Resumes execution of the agent contract (only callable by owner).
   */
  async unpause(agentAddress?: `0x${string}`): Promise<string> {
    return this.synarc.unpauseAgent(agentAddress)
  }

  /**
   * getMaxRebalanceAmount
   * Retrieves the current maximum rebalance amount limit on-chain.
   */
  async getMaxRebalanceAmount(agentAddress?: `0x${string}`): Promise<string> {
    return this.synarc.getAgentMaxRebalanceAmount(agentAddress)
  }

  /**
   * setMaxRebalanceAmount
   * Sets the maximum rebalance amount limit on the agent contract.
   */
  async setMaxRebalanceAmount(amountUSDC: string | number, agentAddress?: `0x${string}`): Promise<string> {
    return this.synarc.setAgentMaxRebalanceAmount(amountUSDC, agentAddress)
  }

  /**
   * queueWithdrawal
   * Queues a timelocked withdrawal from the agent contract (only callable by owner).
   */
  async queueWithdrawal(token: `0x${string}`, recipient: `0x${string}`, amount: string | number | bigint, agentAddress?: `0x${string}`): Promise<string> {
    return this.synarc.queueAgentWithdrawal(token, recipient, amount, agentAddress)
  }

  /**
   * executeWithdrawal
   * Executes a queued withdrawal after the delay timelock expires.
   */
  async executeWithdrawal(id: string | number | bigint, agentAddress?: `0x${string}`): Promise<string> {
    return this.synarc.executeAgentWithdrawal(id, agentAddress)
  }

  /**
   * cancelWithdrawal
   * Cancels a queued withdrawal before execution.
   */
  async cancelWithdrawal(id: string | number | bigint, agentAddress?: `0x${string}`): Promise<string> {
    return this.synarc.cancelAgentWithdrawal(id, agentAddress)
  }

  /**
   * getQueuedWithdrawals
   * Retrieves a list of queued withdrawals from the agent contract.
   */
  async getQueuedWithdrawals(agentAddress?: `0x${string}`): Promise<QueuedAgentWithdrawal[]> {
    return this.synarc.getAgentQueuedWithdrawals(agentAddress)
  }
}
