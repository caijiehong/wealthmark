import dayjs, { Dayjs } from "dayjs";
import { fund_etf_fund_info_em, stock_hk_hist, stock_us_hist } from "./aktools";
import { Market, SecurityType } from "../lib/enums";
import { ModelStockUs } from "../lib/db";

async function getPriceFromAkTools({
  market,
  symbol,
  beginDate,
  endDate,
  securityType,
}: {
  market: Market;
  symbol: string;
  beginDate: string;
  endDate: string;
  securityType: string;
}) {
  let stockHist: {
    stockDate: number;
    price: number;
  }[] = [];

  if (market === Market.HK) {
    stockHist = await stock_hk_hist(symbol, beginDate, endDate).then((res) => {
      return res.map((item) => {
        return {
          stockDate: +dayjs(item["日期"]).format("YYYYMMDD"),
          price: item["收盘"],
        };
      });
    });
  } else if (market === Market.US) {
    const stockUsInfo = await ModelStockUs.getOne(symbol);
    if (stockUsInfo) {
      stockHist = await stock_us_hist(
        stockUsInfo.akShareId,
        beginDate,
        endDate
      ).then((res) => {
        return res.map((item) => {
          return {
            stockDate: +dayjs(item["日期"]).format("YYYYMMDD"),
            price: item["收盘"],
          };
        });
      });
    }
  } else if (market === Market.CN) {
    if (
      securityType === SecurityType.ETF ||
      securityType === SecurityType.FUND
    ) {
      stockHist = await fund_etf_fund_info_em(symbol, beginDate, endDate).then(
        (res) => {
          return res.map((item) => {
            return {
              stockDate: +dayjs(item["净值日期"]).format("YYYYMMDD"),
              price: item["单位净值"],
            };
          });
        }
      );
    }
  }

  return stockHist;
}

export async function getPriceHisWeek({
  market,
  securityType,
  symbol,
  beginDate,
  endDate,
  weeks,
}: {
  market: Market;
  securityType: SecurityType;
  symbol: string;
  beginDate: Dayjs;
  endDate: Dayjs;
  weeks: { dateStart: Dayjs; dateEnd: Dayjs }[];
}) {
  const stockHist = await getPriceFromAkTools({
    market,
    securityType,
    symbol,
    beginDate: beginDate.format("YYYYMMDD"),
    endDate: endDate.format("YYYYMMDD"),
  });

  const isCash = market === Market.CASH;

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
