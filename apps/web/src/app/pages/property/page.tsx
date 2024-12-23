"use client";
import React from "react";
import { Button, Form, Input, List, Switch } from "antd-mobile";
import { useSearchParams } from "next/navigation";
import { fetchProperty } from "@/app/client/api";
import { PropertyAttributes, PropertyHisAttributes } from "@/app/lib/db";

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

  return (
    <List header="资产列表">
      <List.Item>{property.name}</List.Item>
      <List.Item>{property.symbol}</List.Item>
      {propertyHis.map((item) => {
        return (
          <List.Item key={item.markDate}>
            {item.markDate} {item.amount}
          </List.Item>
        );
      })}
    </List>
  );
};

export default App;
