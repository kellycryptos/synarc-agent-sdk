import { SynArc } from './SynArc'
import { SynArcConfig, TreasuryBalance, QueuedWithdrawal } from './types'

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
}
