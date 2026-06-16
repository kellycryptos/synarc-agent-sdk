import { SynArc } from './SynArc'
import { SynArcConfig, CreatorStats } from './types'

export class SynArcCreator {
  private synarc: SynArc

  constructor(configOrSynArc: SynArcConfig | SynArc) {
    if (configOrSynArc instanceof SynArc) {
      this.synarc = configOrSynArc
    } else {
      this.synarc = new SynArc(configOrSynArc)
    }
  }

  async supportCreator(creatorWallet: `0x${string}`, amount: string | number): Promise<string> {
    return this.synarc.supportCreator(creatorWallet, amount)
  }

  async getCreatorStats(creatorWallet: `0x${string}`): Promise<CreatorStats> {
    return this.synarc.getCreatorStats(creatorWallet)
  }
}
