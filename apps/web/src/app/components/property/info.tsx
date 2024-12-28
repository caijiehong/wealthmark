"use client";
import React from "react";
import { Card } from "antd-mobile";
import { PropertyAttributes } from "@/app/lib/db";
import { IChartSingleData } from "@/app/business/userPropertyHis";
import styles from "./info.module.css";
import { formattedNumber } from "@/app/lib/helper";

const App: React.FC<{
  property: PropertyAttributes;
  chartData: IChartSingleData;
}> = ({ property, chartData }) => {
  return (
    <>
      <Card title={`${property.symbol} ${property.name}`}>
        <div className={styles.info}>
          <div className={styles.info_label}>当前金额</div>
          <div className={styles.info_value}>
            {formattedNumber(chartData.latestValue)}
          </div>
        </div>
      </Card>
    </>
  );
};

export default App;
