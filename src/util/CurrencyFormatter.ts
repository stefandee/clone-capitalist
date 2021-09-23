export interface ICurrencyFormat {
  power?: string;
  amount: string;
}

export interface IPowersOf10 {
  value: number;
  name: string;
}

export class CurrencyFormatter {
  public static readonly MILLION: number = 1000000;
  public static readonly BILLION: number = 1000000000;

  public static readonly POWERSOF10: IPowersOf10[] = [
    {
      value: Math.pow(10, 6),
      name: "million"
    },
    {
      value: Math.pow(10, 9),
      name: "billion"
    },
    {
      value: Math.pow(10, 12),
      name: "trillion"
    },
    {
      value: Math.pow(10, 15),
      name: "quadrillion"
    },
    {
      value: Math.pow(10, 18),
      name: "quintillion"
    },
    {
      value: Math.pow(10, 18),
      name: "quintillion"
    },
    {
      value: Math.pow(10, 21),
      name: "sextillion"
    },
    {
      value: Math.pow(10, 24),
      name: "septillion"
    },
    {
      value: Math.pow(10, 27),
      name: "octillion"
    },
    {
      value: Math.pow(10, 30),
      name: "nonillion"
    },
    {
      value: Math.pow(10, 33),
      name: "decillion"
    },
    {
      value: Math.pow(10, 36),
      name: "undecillion"
    },
    {
      value: Math.pow(10, 36),
      name: "undecillion"
    },
    {
      value: Math.pow(10, 36),
      name: "undecillion"
    },
    {
      value: Math.pow(10, 39),
      name: "duodecillion"
    },
    {
      value: Math.pow(10, 42),
      name: "tredecillion"
    },
    {
      value: Math.pow(10, 45),
      name: "quattuordecillion"
    },
    {
      value: Math.pow(10, 48),
      name: "quindecillion"
    },
    {
      value: Math.pow(10, 51),
      name: "sexdecillion"
    },
    {
      value: Math.pow(10, 54),
      name: "septendecillion"
    },
    {
      value: Math.pow(10, 57),
      name: "octodecillion"
    },
    {
      value: Math.pow(10, 60),
      name: "novemdecillion"
    },
    {
      value: Math.pow(10, 63),
      name: "vigintillion"
    },
    {
      value: Math.pow(10, 100),
      name: "googol"
    },
  ];

  /**
   * Formats currency amount to the game display rules:
   * * amounts under 10^9 are displayed as is;
   * * every other is compared to the nearest 10^3n (3n > 6); amounts are then split into currency and power.
   *
   * For example, for amount = 2 * 10^9, the return values will be currency: amount / 10^9 and power: "billion"
   *
   * Power names are taken from https://en.wikipedia.org/wiki/Power_of_10
   *
   * The method uses the browser internationalization API
   *
   * It is necessary to return such a structure because in some parts of the UI, amount and power are displayed on
   * separate lines.
   *
   * @param {number} amount
   * @returns {ICurrencyFormat}
   */
  public static format(amount: number, cutoff: number = CurrencyFormatter.BILLION): ICurrencyFormat {
    let finalAmount = amount;

    if (amount >= cutoff) {
      const threshold: IPowersOf10 | undefined = CurrencyFormatter.POWERSOF10.reverse().find((elem) => amount > elem.value );

      if (threshold) {
        finalAmount /= threshold.value;

        return {
          amount: new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(finalAmount),
          power: threshold.name,
        };
      }
    }

    return {
      amount: new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(finalAmount)
    };
  }

  public static plainFormat(amount: number, currencySign: string = "$"): string {
    const fmt = CurrencyFormatter.format(amount);

    return currencySign + fmt.amount + (fmt.power ? (" " + fmt.power) : "");
  }

  /**
   * No special format except what internationalization does. Business first buy prices are displayed with it.
   *
   * @param {number} amount
   * @param {string} currencySign
   * @returns {string}
   */
  public static noFormat(amount: number, currencySign: string = "$"): string {
    return currencySign + new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(amount);
  }
}