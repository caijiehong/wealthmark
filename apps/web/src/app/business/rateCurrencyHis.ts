import dayjs, { Dayjs } from "dayjs";
import { currency_boc_sina } from "./aktools";
import { Currency } from "../lib/enums";

export async function getRateCurrencyHisWeek({
  currency,
  beginDate,
  endDate,
  weeks,
}: {
  currency: Currency;
  beginDate: Dayjs;
  endDate: Dayjs;
  weeks: { dateStart: Dayjs; dateEnd: Dayjs }[];
}) {
  let currencyHist: { currencyDate: number; currencyRate: number }[] = [];
  const isCNY = currency === Currency.CNY;
  if (!isCNY) {
    currencyHist = await currency_boc_sina(
      currency,
      beginDate.format("YYYYMMDD"),
      endDate.format("YYYYMMDD")
    ).then((res) => {
      return res
        .map((item) => {
          // item["中行汇买价"] 字段代表汇率
          return {
            currencyDate: +dayjs(item["日期"]).format("YYYYMMDD"),
            currencyRate: item["中行汇买价"] / 100,
          };
        })
        .reverse();
    });
  }

  const list = weeks.map((week) => {
    const dateStart = +week.dateStart.format("YYYYMMDD");
    const dateEnd = +week.dateEnd.format("YYYYMMDD");

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
      currencyRate,
    };
  });

  return list;
}
