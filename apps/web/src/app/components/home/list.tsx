"use client";
import React, { useRef, useState } from "react";
import { List, FloatingBubble, Tabs, SwiperRef, Swiper } from "antd-mobile";
import { useRouter } from "next/navigation";
import { AddOutline } from "antd-mobile-icons";
import { IChartSingleData } from "@/app/business/userPropertyHis";
import { Currency, MarketType, SecurityType } from "@/app/lib/enums";

const formattedNumber = (num: number) =>
  num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const formatName = (name: string) => {
  if (name.length > 12) {
    return name.slice(0, 12) + "...";
  }
  return name;
};
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
          {formatName(property.name)}
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
      <FloatingBubble
        axis="lock"
        style={{
          "--initial-position-bottom": "24px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onClick={() => {
          router.push(`/pages/property-edit`);
        }}
      >
        <AddOutline fontSize={32} />
      </FloatingBubble>
    </>
  );
};

export default App;
