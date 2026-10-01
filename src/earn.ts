import { SynArcConfig } from './types'

export type ArcEarnChainId = 'Arc' | 'Arc_Testnet'

export interface ExploreVaultsOptions {
  chain?: ArcEarnChainId
  sortBy?: 'apy' | 'tvl' | string
}

export interface DepositEarnParams {
  vaultAddress: string
  amount: string
  chain?: ArcEarnChainId
}

export interface WithdrawEarnParams {
  vaultAddress: string
  amount: string
  chain?: ArcEarnChainId
}

export interface GetPositionEarnParams {
  vaultAddress: string
  chain?: ArcEarnChainId
}

/**
 * SynArcEarn
 * Submodule facade for autonomous agents & treasury managers to interact with
 * Arc App Kit Earn Morpho vaults on Arc Mainnet and Arc Testnet.
 */
export class SynArcEarn {
  private config: SynArcConfig

  constructor(config: SynArcConfig) {
    this.config = config
  }

  /**
   * Resolves the target Arc Earn chain identifier ('Arc' for Mainnet, 'Arc_Testnet' for Testnet).
   */
  getChain(): ArcEarnChainId {
    return this.config.network === 'mainnet' ? 'Arc' : 'Arc_Testnet'
  }

  private async getEarnKit(): Promise<any> {
    try {
      // @ts-ignore
      const { EarnKit } = await import('@circle-fin/earn-kit')
      return new EarnKit()
    } catch {
      throw new Error(
        '[@circle-fin/earn-kit] is required to use SynArcEarn. Please install it with: npm install @circle-fin/earn-kit'
      )
    }
  }

  private async getAdapter(): Promise<any> {
    try {
      // @ts-ignore
      const { createViemAdapterFromPrivateKey, createViemAdapterFromProvider } = await import('@circle-fin/adapter-viem-v2')

      if (this.config.privateKey) {
        return createViemAdapterFromPrivateKey({
          privateKey: this.config.privateKey,
        })
      }

      if (this.config.provider) {
        return await createViemAdapterFromProvider({
          provider: this.config.provider,
          capabilities: { addressContext: 'user-controlled' },
        })
      }

      throw new Error('A valid privateKey or provider is required in SynArcConfig to sign Earn transactions.')
    } catch (err: any) {
      if (err.message.includes('@circle-fin/adapter-viem-v2')) {
        throw new Error(
          '[@circle-fin/adapter-viem-v2] is required to use SynArcEarn. Please install it with: npm install @circle-fin/adapter-viem-v2'
        )
      }
      throw err
    }
  }

  /**
   * Explore available DeFi vaults on Arc.
   * @param options Filter & sort parameters.
   * @returns Array of available vaults.
   */
  async exploreVaults(options?: ExploreVaultsOptions) {
    const chain = options?.chain || this.getChain()
    const kit = await this.getEarnKit()
    const res = await kit.exploreVaults({
      chain,
      sortBy: (options?.sortBy || 'apy') as any,
    })
    return res.vaults
  }

  /**
   * Preview a deposit outcome before committing.
   */
  async getDepositQuote(params: DepositEarnParams) {
    const chain = params.chain || this.getChain()
    const kit = await this.getEarnKit()
    const adapter = await this.getAdapter()

    return await kit.getDepositQuote({
      from: { adapter: adapter as any, chain },
      vaultAddress: params.vaultAddress,
      amount: params.amount,
    })
  }

  /**
   * Deposit USDC or EURC into a vault on Arc.
   */
  async deposit(params: DepositEarnParams) {
    const chain = params.chain || this.getChain()
    const kit = await this.getEarnKit()
    const adapter = await this.getAdapter()

    return await kit.deposit({
      from: { adapter: adapter as any, chain },
      vaultAddress: params.vaultAddress,
      amount: params.amount,
    })
  }

  /**
   * Query the agent or wallet position in a specific vault.
   */
  async getPosition(params: GetPositionEarnParams) {
    const chain = params.chain || this.getChain()
    const kit = await this.getEarnKit()
    const adapter = await this.getAdapter()

    return await kit.getPosition({
      from: { adapter: adapter as any, chain },
      vaultAddress: params.vaultAddress,
    })
  }

  /**
   * Preview a withdrawal outcome before committing.
   */
  async getWithdrawalQuote(params: WithdrawEarnParams) {
    const chain = params.chain || this.getChain()
    const kit = await this.getEarnKit()
    const adapter = await this.getAdapter()

    return await kit.getWithdrawalQuote({
      from: { adapter: adapter as any, chain },
      vaultAddress: params.vaultAddress,
      amount: params.amount,
    })
  }

  /**
   * Withdraw and redeem vault shares back to USDC.
   */
  async withdraw(params: WithdrawEarnParams) {
    const chain = params.chain || this.getChain()
    const kit = await this.getEarnKit()
    const adapter = await this.getAdapter()

    return await kit.withdraw({
      from: { adapter: adapter as any, chain },
      vaultAddress: params.vaultAddress,
      amount: params.amount,
    })
  }
}
