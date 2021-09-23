import {IBusinessProgress} from "~/types/IBusinessProgress";
import {BuyOptions} from "~/types/BuyOptions";

export interface IPlayerSaveData {
  cash: number;
  managers: string[];
  businesses: IBusinessProgress[];
  buyOptions: BuyOptions;
  lastOnlineTimestamp: number;
}
