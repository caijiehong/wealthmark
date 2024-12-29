"use client";
import React from "react";
import Canvas from "@antv/f2-react";
import { Chart, Interval, Line, Axis } from "@antv/f2";

import { PropertyHisWeek } from "@/app/business/propertyHis";
import dayjs from "dayjs";

const App: React.FC<{
  weekHis: PropertyHisWeek[];
}> = ({ weekHis }) => {
  const chartData = weekHis.map((item) => {
    return {
      day: dayjs(`${item.dateEnd} 00:00`).format("MM-DD"),
      amount: item.amount,
      value: item.value,
      percent: item.percent,
      price: item.price,
    };
  });

  return (
    <>
      <Canvas pixelRatio={2}>
        <Chart data={chartData}>
          <Axis field="value" tickCount={10} />
          <Axis field="day" tickCount={8} />
          <Axis field="percent" tickCount={10} position="right" />
          <Line x="day" y="percent" />
          <Line x="day" y="price" color={"orange"} />
          <Interval x="day" y="value" color="grey" />
        </Chart>
      </Canvas>
    </>
  );
};

export default App;
