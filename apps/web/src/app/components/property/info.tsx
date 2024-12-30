"use client";
import React from "react";
import { Card, Space } from "antd-mobile";
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
        <Space wrap justify="stretch">
          <div className={styles.info}>
            <div className={styles.info_label}>最新价格</div>
            <div className={styles.info_value}>
              {chartData.latestPrice.toFixed(3)}
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.info_label}>持有数量</div>
            <div className={styles.info_value}>
              {formattedNumber(chartData.latestAmount)}
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.info_label}>当前金额</div>
            <div className={styles.info_value}>
              {formattedNumber(chartData.latestValue)}
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.info_label}>总资产占比</div>
            <div className={styles.info_value}>
              {`${chartData.latestPercent.toFixed(1)}%`}
            </div>
          </div>
        </Space>
      </Card>
    </>
  );
};

export default App;
