import { PropertyHisAttributes } from "../lib/db";
import dayjs from "dayjs";
import { currency_boc_sina, stock_hk_hist } from "./aktools";
import { Currency, MarketType } from "../lib/enums";
import { getPriceHisWeek } from "./priceHis";
import { getRateCurrencyHisWeek } from "./rateCurrencyHis";

export interface PropertyHisWeek {
  dateStart: number;
  dateEnd: number;
  amount: number;
  price: number;
  value: number;
}

export async function getPropertyHisWeek({
  marketType,
  symbol,
  currency,
  propertyHis,
}: {
  marketType: MarketType;
  symbol: string;
  currency: Currency;
  /**
   * - 资产历史记录数组
   * - 按照 markDate 从大到小排序
   */
  propertyHis: PropertyHisAttributes[];
}): Promise<PropertyHisWeek[]> {
  // 使用 dayjs 库, 生成一个数组, 这个数组包含了最近 30 周的星期天的日期
  const now = dayjs();

  const weeks = Array.from({ length: 15 }, (_, index) => {
    const dateStart = now.subtract(index, "week").startOf("week");
    const dateEnd = now.subtract(index, "week").endOf("week");
    return {
      /**
       * 每周第一天, 星期天
       */
      dateStart,
      /**
       * 每周最后一天, 星期六
       */
      dateEnd,
    };
  });

  const endDate = weeks[0]!.dateEnd;
  const beginDate = weeks[weeks.length - 1]!.dateStart;
  const p1 = getPriceHisWeek({ marketType, symbol, beginDate, endDate, weeks });

  const p2 = getRateCurrencyHisWeek({ currency, beginDate, endDate, weeks });

  const [stockHist, currencyHist] = await Promise.all([p1, p2]);

  const list = weeks
    .map((week, index) => {
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
    })
    .reverse();

  return list;
}
