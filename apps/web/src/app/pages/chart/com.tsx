"use client";
import React from "react";

import { IChartData } from "@/app/business/userPropertyHis";
import {
  Currency,
  getCurrencyLabel,
  getMarketTypeLabel,
  getSecurityTypeLabel,
  MarketType,
  SecurityType,
} from "@/app/lib/enums";
import { Card } from "antd-mobile";
import { chartDataFilter, Pipe } from "@/app/components/charts/pipe";
import { PropertyAttributes } from "@/app/lib/db";

const Com: React.FC<{
  chartData: IChartData;
}> = ({ chartData }) => {
  const currencyList = [Currency.CNY, Currency.USD, Currency.HKD].map(
    (item) => {
      return {
        filter: (property: PropertyAttributes) => property.currency === item,
        name: getCurrencyLabel(item),
      };
    }
  );

  const chartCur = chartDataFilter(chartData, currencyList);

  const marketTypeList = [
    MarketType.CASH,
    MarketType.CHINA,
    MarketType.GLOBAL,
    MarketType.METAL,
  ].map((item) => {
    return {
      filter: (property: PropertyAttributes) => property.marketType === item,
      name: getMarketTypeLabel(item),
    };
  });

  const chartMarket = chartDataFilter(chartData, marketTypeList);

  const securityTypeList = [
    SecurityType.STOCK,
    SecurityType.FUND,
    SecurityType.ETF,
    SecurityType.CASH,
  ].map((item) => {
    return {
      filter: (property: PropertyAttributes) => property.securityType === item,
      name: getSecurityTypeLabel(item),
    };
  });
  const chartSecurity = chartDataFilter(chartData, securityTypeList);
  return (
    <>
      <Card title="币种占比">
        <Pipe chartData={chartCur} />
      </Card>
      <Card title="资产属性占比">
        <Pipe chartData={chartMarket} />
      </Card>
      <Card title="类型占比">
        <Pipe chartData={chartSecurity} />
      </Card>
    </>
  );
};

export default Com;
