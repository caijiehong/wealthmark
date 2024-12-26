"use client";
import React from "react";
import { Steps, Card, FloatingBubble, Popup } from "antd-mobile";
import { PropertyHisAttributes } from "@/app/lib/db";
import { Step } from "antd-mobile/es/components/steps/step";
import dayjs from "dayjs";
import { AddOutline } from "antd-mobile-icons";
import {
  FormPropertyHis,
  IPropertyHisForm,
} from "@/app/components/form/propertyHis";

const App: React.FC<{
  symbol: string;
  propertyHisOri: PropertyHisAttributes[];
}> = ({ symbol, propertyHisOri }) => {
  const [maskVisible, setMaskVisible] = React.useState(false);
  const [editAmount, setEditAmount] = React.useState(0);
  const [editMarkDate, setEditMarkDate] = React.useState(0);
  const [propertyHis] = React.useState<PropertyHisAttributes[]>(propertyHisOri);
  const [editId, setEditId] = React.useState(0);

  const editHis = (markDate: number, amout: number, id: number) => {
    setEditId(id);
    setEditAmount(amout);
    setEditMarkDate(markDate);
    setMaskVisible(true);
  };

  const onFinish = (values: IPropertyHisForm) => {
    const findItem = propertyHis.find((c) => c.id === values.id);
    if (findItem) {
      findItem.amount = values.amount;
      findItem.markDate = values.markDate;
    } else {
      // add item to propertyHis
      propertyHis.push({
        uid: "",
        symbol,
        markDate: values.markDate,
        amount: values.amount,
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    propertyHis.sort((a, b) => b.markDate - a.markDate);
    setMaskVisible(false);
  };
  const onDelete = (values: IPropertyHisForm) => {
    const findIndex = propertyHis.findIndex(
      (c) => c.markDate === values.markDate
    );
    if (findIndex > -1) {
      propertyHis.splice(findIndex, 1);
    }
    setMaskVisible(false);
  };

  return (
    <>
      <Card title="更新记录">
        <Steps direction="vertical">
          {propertyHis.map((item) => {
            return (
              <Step
                key={item.markDate}
                title={dayjs(item.markDate.toString()).format("YYYY年MM月DD日")}
                status="finish"
                description={
                  <div
                    onClick={() => editHis(item.markDate, item.amount, item.id)}
                  >{`当天数额：${item.amount}`}</div>
                }
              />
            );
          })}
        </Steps>
      </Card>
      <FloatingBubble
        axis="lock"
        style={{
          "--initial-position-bottom": "24px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
      >
        <AddOutline
          fontSize={32}
          onClick={() => editHis(+dayjs().format("YYYYMMDD"), 0, 0)}
        />
      </FloatingBubble>
      <Popup
        visible={maskVisible}
        showCloseButton
        bodyStyle={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          minHeight: "40vh",
        }}
        onClose={() => {
          setMaskVisible(false);
        }}
      >
        <Card title="💰当天资产数额">
          <FormPropertyHis
            id={editId}
            symbol={symbol}
            amount={editAmount}
            markDate={editMarkDate}
            onFinish={onFinish}
            onDelete={onDelete}
          />
        </Card>
      </Popup>
    </>
  );
};

export default App;
