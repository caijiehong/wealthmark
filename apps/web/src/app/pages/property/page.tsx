import React, { Suspense } from "react";
import Info from "@/app/components/property/info";
import His from "@/app/components/property/his";
import Chart from "@/app/components/property/chart";
import {
  modelProperty,
  ModelPropertyHis,
  PropertyHisAttributes,
} from "@/app/lib/db";
import {
  getPropertyHisWeek,
  PropertyHisWeek,
} from "@/app/business/propertyHis";

const Page = async ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = await searchParams;
  const property = await modelProperty.getOne(+id);

  if (!property) {
    throw new Error("Property not found");
  }

  let propertyHisOri: PropertyHisAttributes[] = [];
  let weekHis: PropertyHisWeek[] = [];
  if (property) {
    propertyHisOri = await ModelPropertyHis.getList(
      property.uid,
      property.symbol
    );

    if (propertyHisOri.length) {
      weekHis = await getPropertyHisWeek({
        symbol: property.symbol,
        currency: property.currency,
        propertyHis: propertyHisOri,
      });
    }
  }

  return (
    <>
      <Info property={property} />

      <Chart weekHis={weekHis} symbol={property.symbol} />

      <His symbol={property.symbol} propertyHisOri={propertyHisOri} />
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
