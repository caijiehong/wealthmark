import React from "react";
import Info from "@/app/components/property/info";
import His from "@/app/components/property/his";
import Chart from "@/app/components/property/chart";
import {
  modelProperty,
  ModelPropertyHis,
  PropertyHisAttributes,
} from "@/app/lib/db";

const App = async ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = await searchParams;
  const property = await modelProperty.getOne(+id);

  if (!property) {
    throw new Error("Property not found");
  }

  let propertyHisOri: PropertyHisAttributes[] = [];
  if (property) {
    propertyHisOri = await ModelPropertyHis.getList(
      property.uid,
      property.symbol
    );
  }

  return (
    <>
      <Info property={property} />
      <Chart />
      <His symbol={property.symbol} propertyHisOri={propertyHisOri} />
    </>
  );
};

export default App;
