"use client";
import React from "react";
import Canvas from "@antv/f2-react";
import { Chart, Interval, PieLabel } from "@antv/f2";
import { PropertyAttributes } from "@/app/lib/db";
import { IChartData } from "@/app/business/userPropertyHis";

interface IPipeData {
  name: string;
  percent: number;
  a: string;
}

export function chartDataFilter(
  chartData: IChartData,
  filterList: {
    filter: (property: PropertyAttributes) => boolean;
    name: string;
  }[]
) {
  const totalValue = chartData.totalList[chartData.totalList.length - 1]!.value;
  const pipeData: IPipeData[] = filterList.map(({ filter, name }) => {
    const currencyTotal = chartData.allList.reduce((pre, cur) => {
      if (filter(cur.property)) {
        return pre + cur.latestValue;
      }
      return pre;
    }, 0);
    return {
      name,
      percent: currencyTotal / totalValue,
      a: "1",
    };
  });
  return pipeData;
}

export const Pipe: React.FC<{
  chartData: IPipeData[];
}> = ({ chartData }) => {
  return (
    <Canvas pixelRatio={2} height={240}>
      <Chart
        data={chartData}
        coord={{
          type: "polar",
          transposed: true,
          innerRadius: 0.3,
          radius: 0.7,
        }}
      >
        <Interval
          x="a"
          y="percent"
          adjust="stack"
          color={{
            field: "name",
          }}
        />
        <PieLabel
          label1={(data: IPipeData) => {
            return {
              text: data.name,
              fill: "#808080",
            };
          }}
          label2={(data: IPipeData) => {
            return {
              fill: "#000000",
              text: `${(data.percent * 100).toFixed(1)}%`,
              fontWeight: 500,
              fontSize: 10,
            };
          }}
        />
      </Chart>
    </Canvas>
  );
};
