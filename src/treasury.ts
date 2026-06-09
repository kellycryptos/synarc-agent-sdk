import { SynArc } from './SynArc'
import { SynArcConfig, TreasuryBalance } from './types'

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
}
