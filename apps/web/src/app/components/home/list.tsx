"use client";
import React, { useEffect, useRef, useState } from "react";
import { List, Tabs, SwiperRef, Swiper, Ellipsis } from "antd-mobile";
import { useRouter } from "next/navigation";
import { IChartSingleData } from "@/app/business/userPropertyHis";
import { formattedNumber } from "@/app/lib/helper";
import { PropertyHisWeek } from "@/app/business/propertyHis";
import { getTabsFilter } from "./tabsFilter";
import Chart from "./chart";

const HomeList: React.FC<{
  allList: IChartSingleData[];
  totalList: PropertyHisWeek[];
}> = ({ allList, totalList }) => {
  const router = useRouter();

  const list = getTabsFilter({ chartDataList: allList, totalList });

  const tabItems = list.map((item) => ({
    key: item.key,
    title: item.title,
  }));

  const swiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabKey, setTabKey] = useState("ALL");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const index = tabItems.findIndex((item) => item.key === hash);
    if (index !== -1 && index !== activeIndex) {
      setActiveIndex(index);
      setTabKey(hash);
      setWeekHisSelected(list[index]!.combinedList);
      swiperRef.current?.swipeTo(index);
    }
  });

  const [weekHisSelected, setWeekHisSelected] = useState<PropertyHisWeek[]>(
    list.find((item) => item.key === tabKey)!.combinedList
  );

  const onTabsChange = (key: string) => {
    const index = tabItems.findIndex((item) => item.key === key);
    setActiveIndex(index);
    setTabKey(key);
    setWeekHisSelected(list[index]!.combinedList);
    swiperRef.current?.swipeTo(index);
    window.history.pushState(null, "", `#${key}`);
  };

  const onSwiperChange = (index: number) => {
    const key = tabItems[index]!.key;
    setActiveIndex(index);
    setTabKey(key);
    setWeekHisSelected(list[index]!.combinedList);
    window.history.pushState(null, "", `#${key}`);
  };

  return (
    <>
      <Tabs activeKey={tabItems[activeIndex]!.key} onChange={onTabsChange}>
        {tabItems.map((item) => (
          <Tabs.Tab title={item.title} key={item.key} />
        ))}
      </Tabs>
      <Chart weekHis={weekHisSelected} tabKey={tabKey} />
      <Swiper
        direction="horizontal"
        loop
        indicator={() => null}
        ref={swiperRef}
        defaultIndex={activeIndex}
        onIndexChange={onSwiperChange}
      >
        {list.map((item) => {
          return (
            <Swiper.Item key={item.key}>
              <List>
                {item.list.map(({ property, latestValue }) => (
                  <List.Item
                    key={property.symbol}
                    description={property.symbol}
                    extra={formattedNumber(latestValue)}
                    onClick={() => {
                      router.push(`/pages/property?id=${property.id}`);
                    }}
                  >
                    <Ellipsis direction="end" content={property.name} />
                  </List.Item>
                ))}
              </List>
            </Swiper.Item>
          );
        })}
      </Swiper>
    </>
  );
};

export default HomeList;
