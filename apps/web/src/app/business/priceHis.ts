import dayjs, { Dayjs } from "dayjs";
import { stock_hk_hist } from "./aktools";
import { Market } from "../lib/enums";

export async function getPriceHisWeek({
  market,
  symbol,
  beginDate,
  endDate,
  weeks,
}: {
  market: Market;
  symbol: string;
  beginDate: Dayjs;
  endDate: Dayjs;
  weeks: { dateStart: Dayjs; dateEnd: Dayjs }[];
}) {
  let stockHist: {
    stockDate: number;
    price: number;
  }[] = [];

  const isCash = market === Market.CASH;
  if (!isCash) {
    stockHist = await stock_hk_hist(
      symbol,
      beginDate.format("YYYYMMDD"),
      endDate.format("YYYYMMDD")
    ).then((res) => {
      return res.map((item) => {
        return {
          stockDate: +dayjs(item["日期"]).format("YYYYMMDD"),
          price: item["收盘"],
        };
      });
    });
  }

  const list = weeks.map((week) => {
    const dateStart = +week.dateStart.format("YYYYMMDD");
    const dateEnd = +week.dateEnd.format("YYYYMMDD");

    let price = isCash ? 1 : 0;
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
      price,
    };
  });

  return list;
}
