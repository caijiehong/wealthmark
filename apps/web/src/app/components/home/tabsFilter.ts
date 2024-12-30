import { PropertyHisWeek } from "@/app/business/propertyHis";
import { IChartSingleData } from "@/app/business/userPropertyHis";
import { Currency, MarketType, SecurityType } from "@/app/lib/enums";
export function getTabsFilter({
  chartDataList,
  totalList,
}: {
  chartDataList: IChartSingleData[];
  totalList: PropertyHisWeek[];
}) {
  const filterList = [
    {
      key: "ALL",
      title: "全部",
      filter: (_c: IChartSingleData) => true,
    },
    {
      key: "CASH",
      title: "现金",
      filter: (c: IChartSingleData) =>
        c.property.marketType === MarketType.CASH,
    },
    {
      key: "FUND",
      title: "基金",
      filter: (c: IChartSingleData) =>
        c.property.securityType === SecurityType.FUND ||
        c.property.securityType === SecurityType.ETF,
    },
    {
      key: "HKD",
      title: "港币",
      filter: (c: IChartSingleData) => c.property.currency === Currency.HKD,
    },
    {
      key: "USD",
      title: "美元",
      filter: (c: IChartSingleData) => c.property.currency === Currency.USD,
    },
    {
      key: "CNY",
      title: "人民币",
      filter: (c: IChartSingleData) => c.property.currency === Currency.CNY,
    },
  ];

  return filterList.map((item) => {
    const list = chartDataList.filter(item.filter);
    const combinedList: PropertyHisWeek[] = list.reduce(
      (prev: PropertyHisWeek[], curr: IChartSingleData) => {
        curr.weekHis.forEach((week, index) => {
          if (!prev[index]) {
            prev[index] = {
              dateStart: week.dateStart,
              dateEnd: week.dateEnd,
              value: week.value,
              price: 1,
              amount: 0,
              currencyRate: 1,
            };
          } else {
            prev[index].value += week.value;
          }
        });

        return prev;
      },
      []
    );

    combinedList.forEach((week, index) => {
      week.percent = (week.value / totalList[index]!.value) * 100;
    });

    return {
      key: item.key,
      title: item.title,
      list,
      combinedList,
    };
  });
}
