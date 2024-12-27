import { PropertyHisAttributes } from "@/app/lib/db";
import {
  Form,
  Input,
  DatePicker,
  Button,
  DatePickerRef,
  Space,
  AutoCenter,
} from "antd-mobile";
import dayjs from "dayjs";
import React, { RefObject, useEffect } from "react";

export interface IPropertyHisForm {
  id: number;
  markDate: number;
  amount: number;
}

export const FormPropertyHis: React.FC<{
  id: number;
  symbol: string;
  markDate: number;
  amount: number;
  onFinish: (values: IPropertyHisForm) => void;
  onDelete: (values: IPropertyHisForm) => void;
}> = ({
  id,
  markDate,
  amount,
  symbol,
  onFinish: onFinishProps,
  onDelete: onDeleteProps,
}) => {
  const [form] = Form.useForm<IPropertyHisForm>();

  useEffect(() => {
    form.setFieldsValue({ markDate, amount });
  }, [markDate, amount]);

  const onFinish = async (values: IPropertyHisForm) => {
    const saveData = { ...values, symbol, id };
    const res = await fetch(`/api/propertyHis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saveData),
    });
    const { data }: { data: PropertyHisAttributes } = await res.json();
    onFinishProps(data);
  };

  const onDelete = async () => {
    await fetch(`/api/propertyHis`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ markDate, symbol }),
    });
    onDeleteProps({ markDate, amount: 0, id });
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      mode="card"
      onFinish={onFinish}
      footer={
        <AutoCenter>
          <Space>
            <Button
              block
              type="button"
              color="danger"
              size="large"
              onClick={onDelete}
            >
              删除
            </Button>
            <Button block type="submit" color="primary" size="large">
              保存
            </Button>
          </Space>
        </AutoCenter>
      }
    >
      <Form.Item
        name="markDate"
        label="日期"
        trigger="onConfirm"
        onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
          datePickerRef.current?.open();
        }}
        rules={[{ required: true, message: "日期不能为空" }]}
        getValueFromEvent={(v: Date) => +dayjs(v).format("YYYYMMDD")}
        getValueProps={(v: number) => {
          // v 是形如 20210101 的数字, 需要通过 dayjs 转换为日期字符串
          return { value: dayjs(`${v} 00:00`).toDate() };
        }}
      >
        <DatePicker>
          {(value) =>
            value ? dayjs(value).format("YYYY年MM月DD日") : "请选择日期"
          }
        </DatePicker>
      </Form.Item>
      <Form.Item
        name="amount"
        label="资产数额"
        rules={[{ required: true, message: "当前数额不能为空" }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};
