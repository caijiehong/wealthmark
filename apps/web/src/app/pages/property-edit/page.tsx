import React, { Suspense } from "react";
import Client from "./client";
import { modelProperty, PropertyAttributes } from "@/app/lib/db";
import { Currency, Market, MarketType } from "@/app/lib/enums";

const Page = async ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = await searchParams;
  let property: PropertyAttributes | null = {
    id: 0,
    uid: "",
    symbol: "",
    market: Market.CN,
    marketType: MarketType.CHINA,
    currency: Currency.CNY,
    name: "",
    desc: "",
    flag: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  if (+id > 0) {
    property = await modelProperty.getOne(+id);
  }

  if (!property) {
    throw new Error("Property not found");
  }
  return (
    <Suspense fallback="loading">
      <Client property={property} />
    </Suspense>
  );
};

const App = async ({ searchParams }: { searchParams: { id: string } }) => {
  return (
    <Suspense fallback="loading">
      <Page searchParams={searchParams} />
    </Suspense>
  );
};
export default App;
