import {IManagerDef} from "~/model/ManagerDefModel";
import {IBusinessDef} from "~/model/BusinessDefModel";
import {BuyOptions} from "~/types/BuyOptions";
import {IBusinessProgress} from "~/types/IBusinessProgress";
import {IPlayerSaveData} from "~/types/IPlayerSaveData";

export interface IBuyBusinessResult {
  amount: number;
  cost: number;
}

/**
 * Stores game play information. Load/save from storage. Performs operations on game data.
 *
 * Not the best architecture, it should be split into multiple responsibilities/commands/services.
 */
export class PlayerModel {
  public static readonly NAME: string = "PlayerModel";

  private static readonly LOCAL_STORAGE_KEY: string = "AdventureCapitalistClone";

  private static readonly STARTING_CASH: number = 4;

  private static readonly EMPTY_BUY_RESULT: IBuyBusinessResult = {
    amount: 0,
    cost: 0
  };

  /**
   * Cash owned.
   *
   * TODO extend this to an interface/class that contains amount and currency (e.g. IWallet)
   * TODO this will require a different approach for owning multiple currencies
   *
   * @type {number}
   */
  public cash: number = PlayerModel.STARTING_CASH;

  /**
   * Timestamp when the game was last saved to storage
   * @type {number}
   */
  public lastOnlineTimestamp: number = -1;

  public buyOptions: BuyOptions = BuyOptions.Buy1;

  /**
   * Hired managers
   */
  public managers: string[] = [];

  /**
   * Businesses progress
   */
  public businesses: IBusinessProgress[] = [];

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.cash = PlayerModel.STARTING_CASH;
    this.managers = [];
    this.businesses = [];
    this.buyOptions = BuyOptions.Buy1;
    this.lastOnlineTimestamp = -1;
  }

  public nextBuyOption(): BuyOptions {
    this.buyOptions = (this.buyOptions + 1) % 4;

    return this.buyOptions;
  }

  /**
   * Computes how many business can be bought with the current cash
   * @param {string} businessType
   * @param {IBusinessDef} businessDef
   * @returns {number}
   */
  public businessMaxAmount(businessType: string, businessDef: IBusinessDef): IBuyBusinessResult {
    const progress = this.businesses.find((element) => element.type === businessType);

    if (!progress) {
      return PlayerModel.EMPTY_BUY_RESULT;
    }

    let cost = 0;
    let currentCostFactor = progress.currentCostFactor;
    let amount = 0;
    let prevCost = cost;

    while (cost < this.cash) {

      cost += currentCostFactor * businessDef.cost;
      prevCost = cost;
      currentCostFactor *= businessDef.costFactor;

      (cost <= this.cash) && amount++;
    }

    return {
      amount: amount,
      cost: prevCost
    };
  }

  public buyBusiness(businessType: string, businessDef: IBusinessDef, dryRun: boolean = false): IBuyBusinessResult {
    switch (this.buyOptions) {
      case BuyOptions.Buy1:
        return this.buyBusinessAmount(businessType, 1, businessDef, dryRun);

      case BuyOptions.Buy10:
        return this.buyBusinessAmount(businessType, 10, businessDef, dryRun);

      case BuyOptions.Buy100:
        return this.buyBusinessAmount(businessType, 100, businessDef, dryRun);

      case BuyOptions.BuyMax:
        return this.buyBusinessAmount(businessType, this.businessMaxAmount(businessType, businessDef).amount, businessDef, dryRun);
    }
  }

  public buyBusinessAmount(businessType: string, amount: number, businessDef: IBusinessDef, dryRun: boolean = false): IBuyBusinessResult {
    if (amount <= 0) {
      return PlayerModel.EMPTY_BUY_RESULT;
    }

    const progress = this.businesses.find((element) => element.type === businessType);

    if (!progress) {
      return {
        amount: 0,
        cost: 0
      };
    }

    let cost = 0;
    let currentCostFactor = progress.currentCostFactor;
    let currentItemCost = progress.currentCost;

    for (let i = 0; i < amount; i++) {
      cost += currentItemCost;
      currentCostFactor *= businessDef.costFactor;
      currentItemCost = currentCostFactor * businessDef.cost;
    }

    if (dryRun) {
      return {
        amount: amount,
        cost: cost
      };
    }

    if (this.cash >= cost) {

      this.cash -= cost;

      progress.owned += amount;
      progress.currentCostFactor = currentCostFactor;
      progress.currentCost = currentItemCost;

      this.saveToStorage();

      return {
        amount: amount,
        cost: cost
      };
    }

    return PlayerModel.EMPTY_BUY_RESULT;
  }

  public buyFirstBusiness(businessType: string, businessDef: IBusinessDef): IBuyBusinessResult {
    if (this.getBusinessProgress(businessType)) {
      console.log("business already exists!");

      return PlayerModel.EMPTY_BUY_RESULT;
    }

    // add the initial progress
    this.businesses.push({
      owned: 0,
      currentCost: businessDef.cost,
      currentCostFactor: businessDef.costFactor,
      type: businessType
    });

    return this.buyBusinessAmount(businessType, 1, businessDef);
  }

  public hireManager(managerId: string, managerDef: IManagerDef): boolean {
    if (this.isManagerHired(managerId)) {
      console.log("manager is already hired!");
      return false;
    }

    if (this.cash >= managerDef.cost) {
      this.cash -= managerDef.cost;
      this.managers.push(managerId);

      // assign the manager to its business
      // TODO take into account the manager priority and only assign if new manager priority is higher than existing one
      const progress = this.getBusinessProgress(managerDef.business);
      progress && (progress.manager = managerId);

      this.saveToStorage();

      return true;
    }

    return false;
  }

  public isManagerHired(managerId: string): boolean {
    return this.managers.find((element) => element === managerId) !== undefined;
  }

  public getBusinessProgress(businessType: string): IBusinessProgress | undefined {
    return this.businesses.find((element) => element.type === businessType);
  }

  public storageExists(): boolean {
    return localStorage.getItem(PlayerModel.LOCAL_STORAGE_KEY) !== null;
  }

  public saveToStorageAt(timeStamp: number) {
    this.lastOnlineTimestamp = timeStamp;
    this.saveToStorage();
  }

  public saveToStorage(): void {
    const data: IPlayerSaveData = {
      buyOptions: this.buyOptions,
      businesses: this.businesses,
      cash: this.cash,
      managers: this.managers,
      lastOnlineTimestamp: this.lastOnlineTimestamp
    };

    // serialize and save to local storage
    localStorage.setItem(PlayerModel.LOCAL_STORAGE_KEY, JSON.stringify(data));
  }

  public loadFromStorage(): void {
    this.reset();

    const item = localStorage.getItem(PlayerModel.LOCAL_STORAGE_KEY);

    if (item !== null) {
      const data: IPlayerSaveData = JSON.parse(item);

      if (data) {
        this.cash = isNaN(data.cash) ? PlayerModel.STARTING_CASH : data.cash;
        this.businesses = data.businesses;
        this.managers = data.managers;
        this.buyOptions = isNaN((data.buyOptions)) ? BuyOptions.Buy1 : data.buyOptions;
        this.lastOnlineTimestamp = isNaN(data.lastOnlineTimestamp) ? -1 : data.lastOnlineTimestamp;

        // TODO sanity checks - cross check with BusinessDefModel and ManagerDefModel that keys exists, remove non-existent keys, etc
      }
    }
  }
}