export interface IManagerDef {
  business: string;
  cost: number;
  name: string;
  priority: number;
}

export interface IManagersDef {
  [key: string]: IManagerDef;
}

/**
 * Model for business definition data found in data/business-def.json
 */
export class ManagerDefModel {
  public static readonly NAME: string = "ManagerDefModel";

  private managers: IManagersDef;
  private _count: number;

  constructor(jsonData: IManagersDef) {
    this.managers = jsonData;
    this._count = Object.keys(this.managers).length;
  }

  public get count(): number {
    return this._count;
  }

  public getManager(key: string): IManagerDef {
    return this.managers[key];
  }

  public get managerKeys(): string[] {
    return Object.keys(this.managers);
  }

  public canBuyAnyManager(cash: number): boolean {
    return this.managerKeys.find((key) => this.managers[key].cost <= cash) !== undefined;
  }

  public canBuyAnyManagerExcept(cash: number, excludeList: string[]): boolean {
    let list = this.managerKeys.filter(x => !excludeList.includes(x) && this.managers[x].cost <= cash);

    return list.length > 0;
  }
}