import {PlayerModel} from "~/model/PlayerModel";
import {BusinessDefModel} from "~/model/BusinessDefModel";

export interface IOfflineStats {
  /**
   * Time the player was offline (miliseconds)
   */
  time: number;

  /**
   * Profits accumulated while offline (in primary currency)
   */
  profit: number;
}

export class PlayerReturnService {
  private playerModel: PlayerModel;
  private businessDefModel: BusinessDefModel;

  constructor(playerModel: PlayerModel, businessDefModel: BusinessDefModel) {
    this.playerModel = playerModel;
    this.businessDefModel = businessDefModel;
  }

  /**
   * Adjusts the PlayerModel accordingly to offline stats.
   *
   * @returns {IOfflineStats}
   */
  public computeOfflineStats(): IOfflineStats {
    const now = new Date().getTime();
    const timeOffline = this.playerModel.lastOnlineTimestamp > 0 ? now - this.playerModel.lastOnlineTimestamp : 0;
    let profit = 0;

    // compute away profits for all the businesses owned
    const businesses = this.playerModel.businesses;

    businesses.forEach((progress) => {
      const businessDef = this.businessDefModel.getBusiness(progress.type);
      const businessTimeMs = businessDef.time * 1000;

      // business has no manager, is active and has finished producing
      if (!progress.manager && progress.nextTimeStamp !== undefined && progress.nextTimeStamp <= now) {
        // collect profit
        profit += businessDef.profit * progress.owned;

        // put the business in inactive mode
        progress.nextTimeStamp = undefined;
      }

      // business has a manager
      if (progress.manager) {
        if (progress.nextTimeStamp !== undefined) {
          // ...and is in progress. compute accumulate profits for each businessTimeMs chunk
          // TODO while loop is not necessary, it's only here for clarity
          while(progress.nextTimeStamp <= now) {
            profit += businessDef.profit * progress.owned;
            progress.nextTimeStamp += businessTimeMs;
          }
        } else {
          // this case shouldn't happen; auto-activate the business (although the business card will take care of this automatically)
          progress.nextTimeStamp = now + businessTimeMs;
        }
      }
    });

    // adjust the player model and save
    this.playerModel.lastOnlineTimestamp = now;
    this.playerModel.cash += profit;
    this.playerModel.saveToStorageAt(now);

    return {
      time: timeOffline,
      profit: profit
    }
  }
}