import { PropertyHisAttributes } from "../lib/db";
import dayjs from "dayjs";
import { Currency, Market, SecurityType } from "../lib/enums";
import { getPriceHisWeek } from "./priceHis";
import { getRateCurrencyHisWeek } from "./rateCurrencyHis";

export interface PropertyHisWeek {
  dateStart: number;
  dateEnd: number;
  amount: number;
  price: number;
  value: number;
  /**
   * 资产占比
   * @example 80 表示 80%
   */
  percent?: number;
  currencyRate: number;
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
  securityType,
  symbol,
  currency,
  propertyHis,
  weeks,
}: {
  market: Market;
  securityType: SecurityType;
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
  const p1 = getPriceHisWeek({
    market,
    symbol,
    beginDate,
    endDate,
    weeks,
    securityType,
  });

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
      price: market === Market.CASH ? currencyRate : price,
      value: amount * price * currencyRate,
      currencyRate: market === Market.CASH ? 1 : currencyRate,
    };
  });

  return list;
}

export function getWeekList(range: number): IWeek[] {
  const now = dayjs();

  // 如果 now 是星期天, 则返回上周星期六, 其他情况返回now 那一周的星期六
  const latestSaturday =
    now.day() === 0 ? now.subtract(1, "week") : now.endOf("week");

  const weeks = Array.from({ length: range }, (_, index) => {
    const dateStart = latestSaturday.subtract(index, "week").startOf("week");
    const dateEnd = latestSaturday.subtract(index, "week").endOf("week");
    return {
      dateStart,
      dateEnd,
    };
  });

  return weeks;
}
