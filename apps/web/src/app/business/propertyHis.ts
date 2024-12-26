import { PropertyHisAttributes } from "../lib/db";
import dayjs from "dayjs";
import { Currency, Market } from "../lib/enums";
import { getPriceHisWeek } from "./priceHis";
import { getRateCurrencyHisWeek } from "./rateCurrencyHis";

export interface PropertyHisWeek {
  dateStart: number;
  dateEnd: number;
  amount: number;
  price: number;
  value: number;
  percent?: number;
}

interface IWeek {
  /**
   * 每周第一天, 星期天
   */
  dateStart: dayjs.Dayjs;
  /**
   * 每周最后一天, 星期六
   */
  dateEnd: dayjs.Dayjs;
}

export async function getPropertyHisByWeeks({
  market,
  symbol,
  currency,
  propertyHis,
  weeks,
}: {
  market: Market;
  symbol: string;
  currency: Currency;
  /**
   * - 资产历史记录数组
   * - 按照 markDate 从大到小排序
   */
  propertyHis: PropertyHisAttributes[];
  weeks: IWeek[];
}): Promise<PropertyHisWeek[]> {
  const endDate = weeks[0]!.dateEnd;
  const beginDate = weeks[weeks.length - 1]!.dateStart;
  const p1 = getPriceHisWeek({ market, symbol, beginDate, endDate, weeks });

  const p2 = getRateCurrencyHisWeek({ currency, beginDate, endDate, weeks });

  const [stockHist, currencyHist] = await Promise.all([p1, p2]);

  const list = weeks.map((week, index) => {
    const dateStart = +week.dateStart.format("YYYYMMDD");
    const dateEnd = +week.dateEnd.format("YYYYMMDD");
    const findItem = propertyHis.find((his) => {
      if (his.markDate <= dateEnd) {
        return true;
      }
      return false;
    });

    let amount = 0;
    if (findItem) {
      amount = findItem.amount;
    } else if (propertyHis.length > 0) {
      amount = propertyHis[propertyHis.length - 1]!.amount;
    }

    const price = stockHist[index]!.price;
    const currencyRate = currencyHist[index]!.currencyRate;

    return {
      dateStart,
      dateEnd,
      amount,
      price,
      value: amount * price * currencyRate,
      currencyRate,
    };
  });

  return list;
}

export function getWeekList(range: number): IWeek[] {
  const now = dayjs();

  const weeks = Array.from({ length: range }, (_, index) => {
    const dateStart = now.subtract(index, "week").startOf("week");
    const dateEnd = now.subtract(index, "week").endOf("week");
    return {
      dateStart,
      dateEnd,
    };
  });

  return weeks;
}

export async function getPropertyHisWeek({
  market,
  symbol,
  currency,
  propertyHis,
}: {
  market: Market;
  symbol: string;
  currency: Currency;
  /**
   * - 资产历史记录数组
   * - 按照 markDate 从大到小排序
   */
  propertyHis: PropertyHisAttributes[];
}): Promise<PropertyHisWeek[]> {
  const weeks = getWeekList(15);

  const list = await getPropertyHisByWeeks({
    market,
    symbol,
    currency,
    propertyHis,
    weeks,
  });

  return list.reverse();
}
