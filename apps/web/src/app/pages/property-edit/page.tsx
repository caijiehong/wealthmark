import React, { Suspense } from "react";
import Client from "./client";
import { modelProperty, PropertyAttributes } from "@/app/lib/db";
import { Currency, Market, MarketType, SecurityType } from "@/app/lib/enums";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
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
    securityType: SecurityType.STOCK,
  };
  if (+id > 0) {
    property = await modelProperty.getOne(+id);
  }

  if (!property) {
    throw new Error("Property not found");
  }
  return <Client property={property} />;
};

const App = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
  return (
    <Suspense fallback="loading">
      <Page searchParams={searchParams} />
    </Suspense>
  );
};
export default App;
