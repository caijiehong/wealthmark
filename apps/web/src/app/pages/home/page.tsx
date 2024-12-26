import React, { Suspense } from "react";
import { getUserInfo } from "@/app/lib/userInfo";
import { modelProperty } from "@/app/lib/db";
import HomeList from "@/app/components/home/list";
import Chart from "@/app/components/home/chart";
import { getUserPropertyHisWeek } from "@/app/business/propertyHis";

const Page = async () => {
  const { uid } = await getUserInfo();

  const data = await modelProperty.getList(uid);
  const weekHis = await getUserPropertyHisWeek({ uid, propertyList: data });

  return (
    <>
      <Chart weekHis={weekHis} />
      <HomeList properties={data} />
    </>
  );
};

const App = async () => {
  return (
    <Suspense fallback="loading">
      <Page />
    </Suspense>
  );
};

export default App;
