import {BuyOptions} from "~/types/BuyOptions";

export class BuyOptionsFormatter {
  public static format(v: BuyOptions): string {
    switch(v) {
      case BuyOptions.Buy1:
        return "x1";
      case BuyOptions.Buy10:
        return "x10";
      case BuyOptions.Buy100:
        return "x100";
    }

    return "Max";
  }
}