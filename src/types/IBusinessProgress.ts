export interface IBusinessProgress {
  type: string;

  /**
   * How many businesses of this id are owned
   */
  owned: number;

  /**
   * Cached cost of the "owned"-th business. See @IBusinessDef for more information on how I
   * assume the system works.
   *
   * This value should always equal cost * Math.pow(costFactor, owned), where cost and costFactor
   * are defined in IBusinessDef
   */
  currentCost: number;

  /**
   * Cached cost factor. This value should always be equal to Math.pow(costFactor, owned)
   */
  currentCostFactor: number;

  /**
   * Next timestamp to calculate profit for this business. This value is calculated as now() + IBusinessDef.time * 1000
   */
  nextTimeStamp?: number;

  /**
   * Current manager assigned to this business
   */
  manager?: string;
}

