"use client";
import React from "react";
import { Button, Form, Input, Switch } from "antd-mobile";
import FormPicker from "@/app/components/picker";
import { IPropertyForm, useFormData } from "@/app/components/form/property";
import {
  mapMarket,
  mapMarketType,
  mapCurrency,
  mapSecurityType,
  Market,
  MarketType,
  Currency,
  SecurityType,
  getCurrencyLabel,
} from "@/app/lib/enums";
import { useRouter } from "next/navigation";
import { PropertyAttributes } from "@/app/lib/db";

const App: React.FC<{ property: PropertyAttributes }> = ({ property }) => {
  const router = useRouter();

  const { form, onFinish } = useFormData(property);

  const [isCash, setIsCash] = React.useState(false);
  const [isNameDisabled, setIsNameDisabled] = React.useState(true);
  const isEdit = property.id > 0;

  const onValuesChange = (_changeVal: any, values: IPropertyForm) => {
    const isCash = values.market === Market.CASH;
    setIsCash(isCash);
    setIsNameDisabled(
      !(
        values.market === Market.HK && values.securityType === SecurityType.FUND
      )
    );
    if (isCash) {
      form.setFieldsValue({
        marketType: MarketType.CASH,
        name: getCurrencyLabel(values.currency),
        symbol: values.currency,
        securityType: SecurityType.CASH,
      });
    } else if (values.market === Market.CN) {
      form.setFieldsValue({
        currency: Currency.CNY,
      });
    } else if (values.market === Market.HK) {
      form.setFieldsValue({
        currency: Currency.HKD,
      });
    } else if (values.market === Market.US) {
      form.setFieldsValue({
        currency: Currency.USD,
      });
    }
  };
  const onSymbolBlur = async () => {
    const symbol = form.getFieldValue("symbol").trim();
    if (!symbol) {
      return;
    }
    const market = form.getFieldValue("market");
    const securityType = form.getFieldValue("securityType");
    const res = await fetch(
      `/api/symbol?market=${market}&symbol=${symbol}&securityType=${securityType}`
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
      onFinish={async (values) => {
        await onFinish(values);
        router.push("/pages/home");
      }}
      initialValues={property}
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
        disabled={isCash}
        formItemName="securityType"
        formItemLabel="资产类型"
        columns={[mapSecurityType]}
      />
      <FormPicker
        formItemName="marketType"
        formItemLabel="投资标的"
        disabled={isCash}
        columns={[mapMarketType]}
      />
      <FormPicker
        formItemName="currency"
        formItemLabel="币种"
        disabled={!isCash}
        columns={[mapCurrency]}
      />
      <Form.Item
        hidden={isCash}
        name="symbol"
        label="股票基金代码"
        disabled={isEdit}
        rules={[{ required: true, message: "股票基金代码不能为空" }]}
      >
        <Input onBlur={onSymbolBlur} />
      </Form.Item>
      <Form.Item
        hidden={isCash}
        name="name"
        label="资产名称"
        disabled={isNameDisabled}
        rules={[{ required: true, message: "资产名称不能为空" }]}
      >
        <Input />
      </Form.Item>

      {isEdit ? null : (
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
