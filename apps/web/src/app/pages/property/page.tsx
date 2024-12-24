"use client";
import React, { useEffect } from "react";
import { List, Steps, Card, FloatingBubble, Popup } from "antd-mobile";
import { useSearchParams } from "next/navigation";
import { fetchProperty } from "@/app/client/api";
import { PropertyAttributes, PropertyHisAttributes } from "@/app/lib/db";
import { Step } from "antd-mobile/es/components/steps/step";
import dayjs from "dayjs";
import { AddOutline } from "antd-mobile-icons";
import {
  FormPropertyHis,
  IPropertyHisForm,
} from "@/app/components/form/propertyHis";
import Canvas from "@antv/f2-react";
import { Chart, Interval } from "@antv/f2";

const App = () => {
  const params = useSearchParams();

  const id = +(params.get("id") || "");

  const [property, setProperty] = React.useState<PropertyAttributes>({
    uid: "",
    symbol: "",
    name: "",
    desc: "",
    market: "",
    marketType: "",
    currency: "",
    flag: 0,
  });
  const [propertyHis, setPropertyHis] = React.useState<PropertyHisAttributes[]>(
    []
  );

  React.useEffect(() => {
    if (!id) {
      throw new Error("id is required");
    }
    fetchProperty(id).then((data) => {
      setProperty(data.property);
      setPropertyHis(data.propertyHis);
    });
  }, [id]);

  const [maskVisible, setMaskVisible] = React.useState(false);
  const [editAmount, setEditAmount] = React.useState(0);
  const [editMarkDate, setEditMarkDate] = React.useState(0);

  const editHis = (markDate: number, amout: number) => {
    setEditAmount(amout);
    setEditMarkDate(markDate);
    setMaskVisible(true);
  };

  const onFinish = (values: IPropertyHisForm) => {
    const findIndex = propertyHis.findIndex(
      (c) => c.markDate === values.markDate
    );
    if (findIndex > -1) {
      propertyHis[findIndex]!.amount = values.amount;
    } else {
      propertyHis.push({
        uid: property.uid,
        symbol: property.symbol,
        markDate: values.markDate,
        amount: values.amount,
      });
    }
    setPropertyHis([...propertyHis].sort((a, b) => b.markDate - a.markDate));
    setMaskVisible(false);
  };
  const onDelete = (values: IPropertyHisForm) => {
    const findIndex = propertyHis.findIndex(
      (c) => c.markDate === values.markDate
    );
    if (findIndex > -1) {
      propertyHis.splice(findIndex, 1);
    }
    setPropertyHis([...propertyHis].sort((a, b) => b.markDate - a.markDate));
    setMaskVisible(false);
  };

  const dataCanvas = [
    { genre: "Sports", sold: 275 },
    { genre: "Strategy", sold: 115 },
    { genre: "Action", sold: 120 },
    { genre: "Shooter", sold: 350 },
    { genre: "Other", sold: 150 },
  ];

  return (
    <>
      <List header="资产列表">
        <List.Item>{property.name}</List.Item>
        <List.Item>{property.symbol}</List.Item>
      </List>
      <Canvas>
        <Chart data={dataCanvas}>
          <Interval x="genre" y="sold" />
        </Chart>
      </Canvas>
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
                    onClick={() => editHis(item.markDate, item.amount)}
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
          onClick={() => editHis(+dayjs().format("YYYYMMDD"), 0)}
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
            symbol={property.symbol}
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
