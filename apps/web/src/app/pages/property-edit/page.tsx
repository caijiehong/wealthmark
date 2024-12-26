"use client";
import React from "react";
import { Button, Form, Input, Switch } from "antd-mobile";
import { useSearchParams } from "next/navigation";
import FormPicker from "@/app/components/picker";
import { IPropertyForm, useFormData } from "@/app/components/form/property";
import {
  mapMarket,
  mapMarketType,
  mapCurrency,
  Market,
  MarketType,
  Currency,
  getCurrencyLabel,
} from "@/app/lib/enums";

const App = () => {
  const params = useSearchParams();

  const id = +(params.get("id") || "");

  const { form, onFinish, initialValues } = useFormData(id);
  const [disableMarketType, setDisableMarketType] = React.useState(false);
  const [disableCurrency, setDisableCurrency] = React.useState(false);

  const [isCash, setIsCash] = React.useState(false);

  const onValuesChange = (_changeVal: any, values: IPropertyForm) => {
    const isCash = values.market === Market.cash;
    setIsCash(isCash);
    setDisableMarketType(isCash);
    setDisableCurrency(!isCash);
    if (isCash) {
      form.setFieldsValue({
        marketType: MarketType.cash,
        name: getCurrencyLabel(values.currency),
        symbol: values.currency,
      });
    } else if (values.market === Market.cn) {
      form.setFieldValue("currency", Currency.cny);
    } else if (values.market === Market.hk) {
      form.setFieldValue("currency", Currency.hkd);
    } else if (values.market === Market.us) {
      form.setFieldValue("currency", Currency.usd);
    }
  };
  const onSymbolBlur = async () => {
    const symbol = form.getFieldValue("symbol").trim();
    if (!symbol) {
      return;
    }
    const res = await fetch(
      `/api/aktools?market=${initialValues.market}&symbol=${symbol}`
    );
    const json = await res.json();
    if (json.data) {
      form.setFieldsValue({
        name: json.data.name,
      });
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
        columns={[mapMarket]}
      />
      <FormPicker
        formItemName="marketType"
        formItemLabel="投资标的"
        disabled={disableMarketType}
        columns={[mapMarketType]}
      />
      <FormPicker
        formItemName="currency"
        formItemLabel="币种"
        disabled={disableCurrency}
        columns={[mapCurrency]}
      />
      <Form.Item
        hidden={isCash}
        name="symbol"
        label="股票基金代码"
        rules={[{ required: true, message: "股票基金代码不能为空" }]}
      >
        <Input onBlur={onSymbolBlur} />
      </Form.Item>
      <Form.Item
        hidden={isCash}
        name="name"
        label="资产名称"
        disabled={true}
        rules={[{ required: true, message: "资产名称不能为空" }]}
      >
        <Input />
      </Form.Item>

      {id > 0 ? null : (
        <Form.Item
          name="amount"
          label="当前数额"
          rules={[{ required: true, message: "当前数额不能为空" }]}
        >
          <Input />
        </Form.Item>
      )}
      <Form.Item
        name="flag"
        label="星标"
        childElementPosition="right"
        valuePropName="checked"
        getValueFromEvent={(v: boolean) => (v ? 1 : 0)}
        getValueProps={(v: number) => ({ checked: v > 0 })}
      >
        <Switch />
      </Form.Item>
      <Form.Item name="desc" label="描述">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default App;
