"use client";
import React from "react";
import Canvas from "@antv/f2-react";
import { Chart, Interval } from "@antv/f2";

const App: React.FC = () => {
  const dataCanvas = [
    { genre: "Sports", sold: 275 },
    { genre: "Strategy", sold: 115 },
    { genre: "Action", sold: 120 },
    { genre: "Shooter", sold: 350 },
    { genre: "Other", sold: 150 },
  ];

  return (
    <>
      <Canvas>
        <Chart data={dataCanvas}>
          <Interval x="genre" y="sold" />
        </Chart>
      </Canvas>
    </>
  );
};

export default App;
