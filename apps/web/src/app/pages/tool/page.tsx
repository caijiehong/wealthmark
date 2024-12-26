"use client";
import React from "react";
import { Button } from "antd-mobile";

const App = () => {
  const updateStockUs = async () => {
    fetch(`/api/stockUs`, { method: "POST", body: JSON.stringify({}) });
  };
  return (
    <Button color="primary" onClick={updateStockUs}>
      更新美股数据库
    </Button>
  );
};

export default App;
