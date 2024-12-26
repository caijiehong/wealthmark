import { PropertyHisAttributes } from "../lib/db";
import dayjs from "dayjs";
import { stock_hk_hist } from "./aktools";

export interface PropertyHisWeek {
  dateStart: number;
  dateEnd: number;
  amount: number;
  price: number;
  value: number;
}

export async function getPropertyHisWeek({
  symbol,
  propertyHis,
}: {
  symbol: string;
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

  const endDate = weeks[0]!.dateStart;
  const beginDate = weeks[weeks.length - 1]!.dateEnd;
  const res = await stock_hk_hist(
    symbol,
    beginDate.format("YYYYMMDD"),
    endDate.format("YYYYMMDD")
  );

  const stockHist = res.map((item) => {
    return {
      stockDate: +dayjs(item["日期"]).format("YYYYMMDD"),
      price: item["收盘"],
    };
  });

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

      return {
        dateStart,
        dateEnd,
        amount,
        price,
        value: amount * price,
      };
    })
    .reverse();

  return list;
}
