import { PropertyHisAttributes } from "../lib/db";
import dayjs from "dayjs";
import { currency_boc_sina, stock_hk_hist } from "./aktools";
import { Currency } from "../lib/enums";

export interface PropertyHisWeek {
  dateStart: number;
  dateEnd: number;
  amount: number;
  price: number;
  value: number;
}

export async function getPropertyHisWeek({
  symbol,
  currency,
  propertyHis,
}: {
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
  const p1 = stock_hk_hist(
    symbol,
    beginDate.format("YYYYMMDD"),
    endDate.format("YYYYMMDD")
  ).then((res) => {
    const stockHist = res.map((item) => {
      return {
        stockDate: +dayjs(item["日期"]).format("YYYYMMDD"),
        price: item["收盘"],
      };
    });

    return stockHist;
  });

  const p2 = currency_boc_sina(
    currency,
    beginDate.format("YYYYMMDD"),
    endDate.format("YYYYMMDD")
  ).then((res) => {
    const currencyHist = res.map((item) => {
      // item["中行汇买价"] 字段代表汇率
      return {
        currencyDate: +dayjs(item["日期"]).format("YYYYMMDD"),
        currencyRate: item["央行中间价"] / 100,
      };
    });

    // 为了便于下一步的计算, 将数组反转, 最新数据在前, 旧数据在后
    return currencyHist.reverse();
  });

  const [stockHist, currencyHist] = await Promise.all([p1, p2]);

  const list = weeks
    .map((week) => {
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

      let price = 0;
      const findStock = stockHist.find((his) => {
        if (his.stockDate <= dateEnd && his.stockDate >= dateStart) {
          return true;
        }
        return false;
      });
      if (findStock) {
        price = findStock.price;
      }

      let currencyRate = 1;
      const findCurrency = currencyHist.find((his) => {
        if (his.currencyDate <= dateEnd && his.currencyDate >= dateStart) {
          return true;
        }
        return false;
      });
      if (findCurrency) {
        currencyRate = findCurrency.currencyRate;
      }

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
