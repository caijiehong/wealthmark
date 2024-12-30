import React, { Suspense } from "react";
import { getUserInfo } from "@/app/lib/userInfo";
import { modelProperty } from "@/app/lib/db";
import HomeList from "@/app/components/home/list";
import Tabs from "@/app/components/tabs";
import { getUserPropertyHisWeek } from "@/app/business/userPropertyHis";

const Page = async () => {
  const { uid } = await getUserInfo();

  const data = await modelProperty.getList(uid);
  const { totalList, allList } = await getUserPropertyHisWeek({
    uid,
    propertyList: data,
  });

  return (
    <Tabs activeKey="home">
      <HomeList allList={allList} totalList={totalList} />
    </Tabs>
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
