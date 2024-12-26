import React, { Suspense } from "react";
import { getUserInfo } from "@/app/lib/userInfo";
import { modelProperty } from "@/app/lib/db";
import HomeList from "@/app/components/home/list";

const Page = async () => {
  const { uid } = await getUserInfo();

  const data = await modelProperty.getList(uid);

  return <HomeList properties={data} />;
};

const App = async () => {
  return (
    <Suspense fallback="loading">
      <Page />
    </Suspense>
  );
};

export default App;
