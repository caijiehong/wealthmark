"use client";
import React, { useRef, useState } from "react";
import { List, Tabs, SwiperRef, Swiper, Ellipsis } from "antd-mobile";
import { useRouter } from "next/navigation";
import { IChartSingleData } from "@/app/business/userPropertyHis";
import { Currency, MarketType, SecurityType } from "@/app/lib/enums";

const formattedNumber = (num: number) =>
  num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const tabItems = [
  { key: "ALL", title: "全部" },
  { key: "CASH", title: "现金" },
  { key: "FUND", title: "基金" },
  { key: "HKD", title: "港币" },
  { key: "USD", title: "美元" },
  { key: "CNY", title: "人民币" },
];

const ListItem1: React.FC<{ chartDataList: IChartSingleData[] }> = ({
  chartDataList,
}) => {
  const router = useRouter();

  return (
    <List>
      {chartDataList.map(({ property, latestValue }) => (
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
  );
};

const App: React.FC<{ chartDataList: IChartSingleData[] }> = ({
  chartDataList,
}) => {
  const router = useRouter();
  const swiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const listCash = chartDataList.filter(
    (c) => c.property.marketType === MarketType.CASH
  );
  const listFund = chartDataList.filter(
    (c) =>
      c.property.securityType === SecurityType.FUND ||
      c.property.securityType === SecurityType.ETF
  );
  const listHKD = chartDataList.filter(
    (c) => c.property.currency === Currency.HKD
  );
  const listUSD = chartDataList.filter(
    (c) => c.property.currency === Currency.USD
  );
  const listCNY = chartDataList.filter(
    (c) => c.property.currency === Currency.CNY
  );

  return (
    <>
      <Tabs
        activeKey={tabItems[activeIndex]!.key}
        onChange={(key) => {
          const index = tabItems.findIndex((item) => item.key === key);
          setActiveIndex(index);
          swiperRef.current?.swipeTo(index);
        }}
      >
        {tabItems.map((item) => (
          <Tabs.Tab title={item.title} key={item.key} />
        ))}
      </Tabs>
      <Swiper
        direction="horizontal"
        loop
        indicator={() => null}
        ref={swiperRef}
        defaultIndex={activeIndex}
        onIndexChange={(index) => {
          setActiveIndex(index);
        }}
      >
        <Swiper.Item>
          <ListItem1 chartDataList={chartDataList} />
        </Swiper.Item>
        <Swiper.Item>
          <ListItem1 chartDataList={listCash} />
        </Swiper.Item>
        <Swiper.Item>
          <ListItem1 chartDataList={listFund} />
        </Swiper.Item>
        <Swiper.Item>
          <ListItem1 chartDataList={listHKD} />
        </Swiper.Item>
        <Swiper.Item>
          <ListItem1 chartDataList={listUSD} />
        </Swiper.Item>
        <Swiper.Item>
          <ListItem1 chartDataList={listCNY} />
        </Swiper.Item>
      </Swiper>
    </>
  );
};

export default App;
