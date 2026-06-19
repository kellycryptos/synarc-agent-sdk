import { SynArc } from './SynArc'
import { SynArcConfig, CreatorStats, CreatorDAOParams, CreatorProfile, CreatorCampaign } from './types'

/**
 * SynArcCreator
 * Focused facade for Creator Economy interactions — nanopayments,
 * Creator DAO creation, creator profiles, and campaign discovery.
 * Wraps the core SynArc client and delegates all calls to it.
 */
export class SynArcCreator {
  private synarc: SynArc

  constructor(configOrSynArc: SynArcConfig | SynArc) {
    if (configOrSynArc instanceof SynArc) {
      this.synarc = configOrSynArc
    } else {
      this.synarc = new SynArc(configOrSynArc)
    }
  }

  /**
   * createCreatorDAO
   * Launches a new Creator DAO by submitting an on-chain governance proposal.
   * Token holders vote to approve the campaign; execution releases funds to the creator.
   * @returns Transaction hash of the proposal submission.
   */
  async createCreatorDAO(params: CreatorDAOParams): Promise<string> {
    return this.synarc.createCreatorDAO(params)
  }

  /**
   * supportCreator
   * Sends a direct USDC nanopayment to a creator's wallet.
   * Accepts any amount, including micro-payments like $0.01 or $0.10.
   * @param creatorWallet - The creator's 0x wallet address.
   * @param amount - Amount in USDC (e.g. 0.01, 5, 100).
   * @returns Transaction hash.
   */
  async supportCreator(creatorWallet: `0x${string}`, amount: string | number): Promise<string> {
    return this.synarc.supportCreator(creatorWallet, amount)
  }

  /**
   * getCreatorProfile
   * Fetches a creator's on-chain stats merged with optional off-chain metadata.
   * Accepts either a 0x wallet address or a human-readable slug (requires creatorApiUrl).
   * @param slugOrAddress - Creator slug (e.g. 'lepton') or 0x wallet address.
   * @returns Full CreatorProfile object.
   */
  async getCreatorProfile(slugOrAddress: string): Promise<CreatorProfile> {
    return this.synarc.getCreatorProfile(slugOrAddress)
  }

  /**
   * getCreatorStats
   * Returns voting power and USDC balance for a creator wallet.
   * @param creatorWallet - The creator's 0x wallet address.
   * @returns CreatorStats object.
   */
  async getCreatorStats(creatorWallet: `0x${string}`): Promise<CreatorStats> {
    return this.synarc.getCreatorStats(creatorWallet)
  }

  /**
   * getCreatorCampaigns
   * Returns a list of active Creator DAO campaigns.
   * Scans on-chain ProposalCreated events for [CreatorDAO:*] tagged proposals,
   * or fetches enriched data from the configured creatorApiUrl if available.
   * @returns Array of CreatorCampaign objects.
   */
  async getCreatorCampaigns(): Promise<CreatorCampaign[]> {
    return this.synarc.getCreatorCampaigns()
  }
}
