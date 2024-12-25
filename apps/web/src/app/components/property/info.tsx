"use client";
import React from "react";
import { List } from "antd-mobile";
import { PropertyAttributes } from "@/app/lib/db";

const App: React.FC<{ property: PropertyAttributes }> = ({ property }) => {
  return (
    <>
      <List header="资产列表">
        <List.Item>{property.name}</List.Item>
        <List.Item>{property.symbol}</List.Item>
      </List>
    </>
  );
};

export default App;
