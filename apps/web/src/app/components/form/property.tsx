import { Property } from "@/app/lib/db";
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
  market: string;
  /**
   * - 投资标的类型: 国内标的 or 国际标的
   * - china: 国内标的
   * - global: 国际标的
   * - cash: 现金
   */
  marketType: string;
  /**
   * - 资产币种: cny, usd, hkd
   */
  currency: string;
}

export const useFormData = (id: number) => {
  const [form] = Form.useForm<IPropertyForm>();
  const initialValues: IPropertyForm = {
    id,
    market: "cn",
    marketType: "china",
    currency: "cny",
    symbol: "",
    name: "",
    desc: "",
    amount: 0,
  };

  React.useEffect(() => {
    if (!id) {
      return;
    }
    fetch(`/api/property?id=${id}`)
      .then((res) => res.json())
      .then((res: { data: Property }) => {
        const d = {
          ...initialValues,
          ...res.data,
        };
        form.setFieldsValue(d);
      });
  }, [id]);

  const onFinish = async (values: IPropertyForm) => {
    const d = {
      ...initialValues,
      ...values,
    };
    const res = await fetch(`/api/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(d),
    });
    console.log(res);
  };

  return {
    initialValues,
    form: form as ReturnType<typeof Form.useForm<IPropertyForm>>[0],
    onFinish,
  };
};
