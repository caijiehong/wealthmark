"use client";
import React from "react";
import { Button } from "antd-mobile";

const App = () => {
  const updateStockUs = async (action: string) => {
    fetch(`/api/database`, {
      method: "POST",
      body: JSON.stringify({ action }),
    });
  };
  return (
    <div>
      <Button color="primary" onClick={() => updateStockUs("stock_us_spot_em")}>
        更新美股数据库
      </Button>

      <Button color="primary" onClick={() => updateStockUs("fund_name_em")}>
        更新国内基金数据库
      </Button>
    </div>
  );
};

export default App;
