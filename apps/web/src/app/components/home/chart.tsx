"use client";
import React from "react";
import Canvas from "@antv/f2-react";
import { Chart, Line, Axis } from "@antv/f2";

import { PropertyHisWeek } from "@/app/business/propertyHis";
import dayjs from "dayjs";

const App: React.FC<{
  weekHis: PropertyHisWeek[];
  tabKey: string;
}> = ({ weekHis, tabKey }) => {
  const chartData = weekHis.map((item) => {
    return {
      day: dayjs(`${item.dateEnd} 00:00`).format("MM-DD"),
      amount: item.amount,
      value: item.value,
      percent: item.percent,
    };
  });
  const isAll = tabKey === "ALL";

  return (
    <>
      <Canvas pixelRatio={2}>
        <Chart data={chartData}>
          <Axis field="value" tickCount={10} />
          {isAll ? null : (
            <Axis field="percent" tickCount={10} position="right" />
          )}
          <Axis field="day" tickCount={8} />
          <Line x="day" y="value" />
          {isAll ? null : <Line x="day" y="percent" color={"orange"} />}
        </Chart>
      </Canvas>
    </>
  );
};

export default App;
