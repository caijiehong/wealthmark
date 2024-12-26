"use client";
import React from "react";
import Canvas from "@antv/f2-react";
import { Chart, Line, Axis } from "@antv/f2";

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
    };
  });

  return (
    <>
      <Canvas>
        <Chart data={chartData}>
          <Axis field="value" tickCount={10} />
          <Axis field="day" tickCount={8} />
          <Line x="day" y="value" />
        </Chart>
      </Canvas>
    </>
  );
};

export default App;
