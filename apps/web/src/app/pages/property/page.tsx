import React, { Suspense } from "react";
import Info from "@/app/components/property/info";
import His from "@/app/components/property/his";
import Chart from "@/app/components/property/chart";
import Action from "@/app/components/property/action";
import {
  modelProperty,
  ModelPropertyHis,
  PropertyHisAttributes,
} from "@/app/lib/db";
import { getUserInfo } from "@/app/lib/userInfo";
import { getUserPropertyHisWeek } from "@/app/business/userPropertyHis";

const Page = async ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = await searchParams;
  const { uid } = await getUserInfo();
  const propertyList = await modelProperty.getList(uid);
  const property = propertyList.find((item) => item.id === Number(id));

  if (!property) {
    throw new Error("Property not found");
  }

  let propertyHisOri: PropertyHisAttributes[] = [];
  const chartData = await getUserPropertyHisWeek({ uid, propertyList });
  const weekHis =
    chartData.allList.find((c) => c.property.symbol === property.symbol)
      ?.weekHis || [];

  if (property) {
    propertyHisOri = await ModelPropertyHis.getList(
      property.uid,
      property.symbol
    );
  }

  return (
    <>
      <Info property={property} />

      <Chart weekHis={weekHis} />

      <His symbol={property.symbol} propertyHisOri={propertyHisOri} />

      <Action property={property} />
    </>
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
