"use client";
import React, { useMemo } from "react";
import { Button, Form, Input } from "antd-mobile";
import { useSearchParams } from "next/navigation";
import FormPicker from "@/app/components/picker";
import { IPropertyForm, useFormData } from "@/app/components/form/property";
import { market, marketType, currency } from "@/app/lib/enums";

const App = () => {
  const params = useSearchParams();

  const id = +(params.get("id") || "");

  const { form, onFinish, initialValues } = useFormData(id);
  const [disableMarketType, setDisableMarketType] = React.useState(false);

  const [isCash, setIsCash] = React.useState(false);

  const onValuesChange = (_changeVal: any, values: IPropertyForm) => {
    const isCash = values.market === "cash";
    setIsCash(isCash);
    if (isCash) {
      setDisableMarketType(true);
      form.setFieldValue("marketType", "cash");
    } else {
      setDisableMarketType(false);
    }
  };
  return (
    <Form
      auto-complete="off"
      layout="horizontal"
      mode="card"
      onFinish={onFinish}
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      form={form}
      footer={
        <Button block type="submit" color="primary" size="large">
          保存
        </Button>
      }
    >
      <Form.Header>请填写资产信息</Form.Header>
      <FormPicker
        formItemName="market"
        formItemLabel="所属市场"
        columns={[market]}
      />
      <FormPicker
        formItemName="marketType"
        formItemLabel="投资标的"
        disabled={disableMarketType}
        columns={[marketType]}
      />
      <FormPicker
        formItemName="currency"
        formItemLabel="币种"
        columns={[currency]}
      />
      {isCash ? null : (
        <Form.Item
          name="symbol"
          label="股票基金代码"
          rules={[{ required: true, message: "股票基金代码不能为空" }]}
        >
          <Input />
        </Form.Item>
      )}
      {isCash ? null : (
        <Form.Item
          name="name"
          label="资产名称"
          rules={[{ required: true, message: "资产名称不能为空" }]}
        >
          <Input />
        </Form.Item>
      )}
      {id > 0 ? null : (
        <Form.Item
          name="amount"
          label="当前数额"
          rules={[{ required: true, message: "当前数额不能为空" }]}
        >
          <Input />
        </Form.Item>
      )}
      <Form.Item name="desc" label="描述">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default App;
