import { ModelPropertyHis, PropertyAttributes } from "../lib/db";
import {
  getPropertyHisByWeeks,
  getWeekList,
  PropertyHisWeek,
} from "./propertyHis";

export interface IChartSingleData {
  property: PropertyAttributes;
  weekHis: PropertyHisWeek[];
  latestValue: number;
}

export interface IChartData {
  totalList: PropertyHisWeek[];
  allList: IChartSingleData[];
}

export async function getUserPropertyHisWeek({
  uid,
  propertyList,
}: {
  uid: string;
  propertyList: PropertyAttributes[];
}): Promise<IChartData> {
  const weeks = getWeekList(15);
  const list = await ModelPropertyHis.getListByUid(uid);

  const pList = propertyList.map(async (property) => {
    const propertyHis = list.filter((his) => his.symbol === property.symbol);
    const weekHis = await getPropertyHisByWeeks({
      market: property.market,
      securityType: property.securityType,
      symbol: property.symbol,
      currency: property.currency,
      propertyHis,
      weeks,
    });

    const latestValue = weekHis[0]!.value;

    return { property, weekHis, latestValue };
  });

  let allList = await Promise.all(pList);

  allList = allList.sort((a, b) => b.latestValue - a.latestValue);

  const totalList = weeks
    .map((week, index) => {
      const dateStart = +week.dateStart.format("YYYYMMDD");
      const dateEnd = +week.dateEnd.format("YYYYMMDD");

      const value = allList.reduce((prev, curr) => {
        return prev + curr.weekHis[index]!.value;
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

  allList.forEach((list) => {
    list.weekHis.forEach((item, index) => {
      item.percent = (item.value / totalList[index]!.value) * 100;
    });
    list.weekHis = list.weekHis.reverse();
  });

  return { totalList, allList };
}
