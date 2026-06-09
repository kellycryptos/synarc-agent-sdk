import { SynArc } from './SynArc'
import { SynArcConfig, ProposalParams, VoteChoice } from './types'

export class SynArcGovernance {
  private synarc: SynArc

  constructor(configOrSynArc: SynArcConfig | SynArc) {
    if (configOrSynArc instanceof SynArc) {
      this.synarc = configOrSynArc
    } else {
      this.synarc = new SynArc(configOrSynArc)
    }
  }

  async createProposal(params: ProposalParams): Promise<string> {
    return this.synarc.createProposal(params)
  }

  async vote(proposalId: string, choice: VoteChoice): Promise<string> {
    return this.synarc.vote(proposalId, choice)
  }

  async delegate(delegateeAddress?: `0x${string}`): Promise<string> {
    return this.synarc.delegate(delegateeAddress)
  }

  async getVotingPower(walletAddress: `0x${string}`): Promise<string> {
    return this.synarc.getVotingPower(walletAddress)
  }

  async getProposals(): Promise<any[]> {
    return this.synarc.getProposals()
  }

  async getProposalState(proposalId: string): Promise<string> {
    return this.synarc.getProposalState(proposalId)
  }
}
