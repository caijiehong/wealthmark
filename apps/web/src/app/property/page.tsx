"use client";
import React from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Space,
  DatePicker,
  Picker,
} from "antd-mobile";
import { Property } from "@/app/lib/db";
import { useSearchParams } from "next/navigation";
import FormPicker from "@/app/components/picker";

interface IPropertyForm {
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

const App = () => {
  const params = useSearchParams();

  const id = +(params.get("id") || "");
  const [form] = Form.useForm<IPropertyForm>();

  const onFinish = async (values: IPropertyForm) => {
    console.log("Received values:", values);

    const res = await fetch(`/api/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...initialValues,
        ...values,
      }),
    });
    console.log(res);
  };

  const initialValues: IPropertyForm = {
    market: "cn",
    marketType: "china",
    currency: "cny",
    symbol: "",
    name: "",
    desc: "",
    amount: 0,
  };
  const [visible, setVisible] = React.useState(false);

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
  return (
    <Form
      layout="horizontal"
      mode="card"
      onFinish={onFinish}
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
        columns={[
          [
            { label: "A股", value: "cn" },
            { label: "港股", value: "hk" },
            { label: "美股", value: "us" },
            { label: "现金", value: "cash" },
          ],
        ]}
      />

      <FormPicker
        formItemName="marketType"
        formItemLabel="投资标的"
        columns={[
          [
            { label: "国内", value: "china" },
            { label: "国际", value: "global" },
            { label: "现金", value: "cash" },
          ],
        ]}
      />
      <FormPicker
        formItemName="currency"
        formItemLabel="币种"
        columns={[
          [
            { label: "人民币", value: "cny" },
            { label: "港币", value: "hkd" },
            { label: "美金", value: "usd" },
          ],
        ]}
      />
      <Form.Item
        name="symbol"
        label="股票基金代码"
        rules={[{ required: true, message: "股票基金代码不能为空" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="资产名称"
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
        name="desc"
        label="描述"
        rules={[{ required: true, message: "描述不能为空" }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default App;
