import { SynArc } from './SynArc'
import { SynArcConfig, CreatorStats, CreatorDAOParams, CreatorProfile, CreatorCampaign, CreatorDAO } from './types'

/**
 * SynArcCreator
 * Focused facade for Creator Economy interactions — nanopayments,
 * Creator DAO deployment, creator profiles, and campaign discovery.
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
   * Deploys a SynArcCrowdfund escrow contract directly from the user's wallet.
   * Matches the main site's create-dao wizard flow.
   * @returns Transaction hash of the contract deployment.
   */
  async createCreatorDAO(params: CreatorDAOParams): Promise<string> {
    return this.synarc.createCreatorDAO(params)
  }

  /**
   * supportCreatorDAO
   * Approves and sends USDC to a deployed SynArcCrowdfund escrow contract.
   * @param daoAddress - The escrow contract address of the Creator DAO.
   * @param amount - Amount in USDC (e.g. 5, 10, 100).
   * @returns Transaction hash.
   */
  async supportCreatorDAO(daoAddress: `0x${string}`, amount: string | number): Promise<string> {
    return this.synarc.supportCreatorDAO(daoAddress, amount)
  }

  /**
   * getCreatorDAO
   * Returns on-chain data for a specific Creator DAO escrow contract.
   * @param daoAddress - The escrow contract address.
   * @returns CreatorDAO object with title, goal, raised, milestones, etc.
   */
  async getCreatorDAO(daoAddress: `0x${string}`): Promise<CreatorDAO> {
    return this.synarc.getCreatorDAO(daoAddress)
  }

  /**
   * getCreatorDAOs
   * Returns a list of Creator DAO campaigns from the configured API,
   * or an empty array if no API is configured (on-chain discovery requires an indexer).
   * @returns Array of CreatorDAO objects.
   */
  async getCreatorDAOs(): Promise<CreatorDAO[]> {
    return this.synarc.getCreatorDAOs()
  }

  /**
   * supportCreator
   * Sends a direct USDC nanopayment to a creator's wallet.
   * For funding an escrow campaign, use supportCreatorDAO instead.
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
   * @param slugOrAddress - Creator slug or 0x wallet address.
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
   * Delegates to getCreatorDAOs — provided for backward compatibility.
   * @returns Array of CreatorDAO objects.
   */
  async getCreatorCampaigns(): Promise<CreatorDAO[]> {
    return this.synarc.getCreatorDAOs()
  }

  /**
   * approveMilestone
   * Approves a milestone for a deployed Creator DAO campaign (backer voting).
   * @param daoAddress - The escrow contract address.
   * @param index - The milestone index to approve.
   * @returns Transaction hash.
   */
  async approveMilestone(daoAddress: `0x${string}`, index: number): Promise<string> {
    return this.synarc.approveMilestone(daoAddress, index)
  }

  /**
   * withdrawMilestone
   * Withdraws a milestone's budget for a Creator DAO campaign (only callable by creator/recipient after approval).
   * @param daoAddress - The escrow contract address.
   * @param index - The milestone index to withdraw.
   * @returns Transaction hash.
   */
  async withdrawMilestone(daoAddress: `0x${string}`, index: number): Promise<string> {
    return this.synarc.withdrawMilestone(daoAddress, index)
  }

  /**
   * claimRefund
   * Claims a refund if the campaign fails to reach its goal before deadline.
   * @param daoAddress - The escrow contract address.
   * @returns Transaction hash.
   */
  async claimRefund(daoAddress: `0x${string}`): Promise<string> {
    return this.synarc.claimRefund(daoAddress)
  }
}
