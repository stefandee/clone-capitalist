export interface IBusinessDef {
  // type:         string;

  /**
   * Base cost of the business
   */
  cost: number;

  /**
   * Cost of the next business depends on the cost factor and owned businesses.
   *
   * The formula is for the nth owned business is:
   * Cost_Of_Business(n) = cost * (costFactor ^ n);
   *
   * Such as the first business will cost "cost", the seconds cost * costFactor, the third cost * costFactor * costFactor, etc
   *
   * This is how I understand the system works.
   */
  costFactor: number;

  /**
   * Base profit of a single business unit
   */
  profit: number;

  /**
   * I'm not sure if the profit is linear or has a factor depending on how many business you own.
   *
   * I assumed the profit is linear.
   */
  profitFactor: number;

  /**
   * How long does it take for the business to create profit.
   *
   * Value is in seconds (but the engine will use timestamps in miliseconds, internally).
   */
  time: number;

  /**
   * Simple display name (no plurals). This is not the correct approach for a game that will be localized; instead,
   * it should be a l10n key based on the businessType
   */
  displayName: string;
}

export interface IBusinessesDef {
  [key: string]: IBusinessDef;
}

/**
 * Model for business definition data found in data/business-def.json
 */
export class BusinessDefModel {
  public static readonly NAME: string = "BusinessDefModel";

  private businesses: IBusinessesDef;
  private _count: number;

  constructor(jsonData: IBusinessesDef) {
    this.businesses = jsonData;
    this._count = Object.keys(this.businesses).length;
  }

  public get count(): number {
    return this._count;
  }

  public getBusiness(key: string): IBusinessDef {
    return this.businesses[key];
  }

  public get businessKeys(): string[] {
    return Object.keys(this.businesses);
  }
}