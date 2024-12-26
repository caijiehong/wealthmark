import { fetchProperty } from "@/app/client/api";
import { PropertyAttributes } from "@/app/lib/db";
import { Currency, Market, MarketType } from "@/app/lib/enums";
import { Form } from "antd-mobile";
import React from "react";

export interface IPropertyForm {
  id: number;

  amount: number;
  /**
   * - 资产编号, 比如股票基金代码
   * - 如果是现金, 则为币种编号
   */
  symbol: string;

  /**
   * - 资产名称
   */
  name: string;

  /**
   * - 资产描述
   */
  desc: string;
  /**
   * - 所属市场
   * - cn: 中国市场
   * - us: 美国市场
   * - hk: 香港市场
   * - cash: 现金
   */
  market: Market;
  /**
   * - 投资标的类型: 国内标的 or 国际标的
   * - china: 国内标的
   * - global: 国际标的
   * - cash: 现金
   */
  marketType: MarketType;
  /**
   * - 资产币种: cny, usd, hkd
   */
  currency: Currency;

  /**
   * - 资产星标
   * - 0: 未标记
   * - 1: 重要资产
   */
  flag: number;
}

export const useFormData = (property: PropertyAttributes) => {
  const [form] = Form.useForm<IPropertyForm>();
  // const initialValues: IPropertyForm = {
  //   id,
  //   market: Market.hk,
  //   marketType: MarketType.china,
  //   currency: Currency.hkd,
  //   symbol: "",
  //   name: "",
  //   desc: "",
  //   amount: 0,
  //   flag: 0,
  // };

  const onFinish = async (values: IPropertyForm) => {
    const d = {
      ...property,
      ...values,
    };
    await fetch(`/api/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(d),
    });
  };

  return {
    form: form as ReturnType<typeof Form.useForm<IPropertyForm>>[0],
    onFinish,
  };
};
