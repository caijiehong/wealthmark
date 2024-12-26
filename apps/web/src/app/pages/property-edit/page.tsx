import React, { Suspense } from "react";
import Client from "./client";
import { modelProperty } from "@/app/lib/db";

const Page = async ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = await searchParams;
  const property = await modelProperty.getOne(+id);

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
