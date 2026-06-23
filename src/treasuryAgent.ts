import { SynArc } from './SynArc'
import { SynArcConfig, RebalanceProposalParams, MonitorTreasuryResult, AgentAction } from './types'

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
}
