"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Dialog, Radio, Space } from "antd-mobile";

const App = () => {
  const onClickLoadStockInfo = async () => {
    const res = await fetch(`/api/property?symbol=tsla&market=us`);
    console.log(res);
  };
  return (
    <>
      <Form
        layout="horizontal"
        footer={
          <Button
            block
            type="button"
            color="primary"
            size="large"
            onClick={onClickLoadStockInfo}
          >
            查询
          </Button>
        }
      >
        <Form.Item
          name="market"
          label="市场类型"
          rules={[{ required: true, message: "请选择市场类型" }]}
        >
          <Radio.Group defaultValue="us">
            <Space direction="horizontal">
              <Radio value="cn">A股</Radio>
              <Radio value="hk">港股</Radio>
              <Radio value="us">美股</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="symbol"
          label="股票基金代码"
          rules={[{ required: true, message: "股票基金代码不能为空" }]}
        >
          <Radio.Group defaultValue="cn">
            <Input />
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  );
};

export default App;
