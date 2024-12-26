import {
  ModelPropertyHis,
  PropertyAttributes,
  PropertyHisAttributes,
} from "../lib/db";
import dayjs from "dayjs";
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

async function getPropertyHisByWeeks({
  marketType,
  symbol,
  currency,
  propertyHis,
  weeks,
}: {
  marketType: MarketType;
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
  const p1 = getPriceHisWeek({ marketType, symbol, beginDate, endDate, weeks });

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
  const weeks = getWeekList(15);

  const list = await getPropertyHisByWeeks({
    marketType,
    symbol,
    currency,
    propertyHis,
    weeks,
  });

  return list.reverse();
}

export async function getUserPropertyHisWeek({
  uid,
  propertyList,
}: {
  uid: string;
  propertyList: PropertyAttributes[];
}): Promise<PropertyHisWeek[]> {
  const weeks = getWeekList(15);
  const list = await ModelPropertyHis.getListByUid(uid);

  const pList = propertyList.map(async (property) => {
    const propertyHis = list.filter((his) => his.symbol === property.symbol);
    const weekHis = await getPropertyHisByWeeks({
      marketType: property.marketType,
      symbol: property.symbol,
      currency: property.currency,
      propertyHis,
      weeks,
    });

    return weekHis;
  });

  const allList = await Promise.all(pList);
  return weeks
    .map((week, index) => {
      const dateStart = +week.dateStart.format("YYYYMMDD");
      const dateEnd = +week.dateEnd.format("YYYYMMDD");

      const value = allList.reduce((prev, curr) => {
        return prev + curr[index]!.value;
      }, 0);

      return {
        dateStart,
        dateEnd,
        amount: 0,
        price: 0,
        value,
      };
    })
    .reverse();
}
