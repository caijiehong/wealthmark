import { ModelPropertyHis, PropertyAttributes } from "../lib/db";
import { getPropertyHisByWeeks, getWeekList } from "./propertyHis";

export type IChartData = Awaited<ReturnType<typeof getUserPropertyHisWeek>>;

export async function getUserPropertyHisWeek({
  uid,
  propertyList,
}: {
  uid: string;
  propertyList: PropertyAttributes[];
}) {
  const weeks = getWeekList(15);
  const list = await ModelPropertyHis.getListByUid(uid);

  const pList = propertyList.map(async (property) => {
    const propertyHis = list.filter((his) => his.symbol === property.symbol);
    const weekHis = await getPropertyHisByWeeks({
      market: property.market,
      symbol: property.symbol,
      currency: property.currency,
      propertyHis,
      weeks,
    });

    return { symbol: property.symbol, weekHis };
  });

  const allList = await Promise.all(pList);
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
