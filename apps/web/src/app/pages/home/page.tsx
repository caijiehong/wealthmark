import React from "react";
import { getUserInfo } from "@/app/lib/userInfo";
import { modelProperty } from "@/app/lib/db";
import HomeList from "@/app/components/home/list";

const App = async () => {
  const { uid } = await getUserInfo();

  const data = await modelProperty.getList(uid);

  return <HomeList properties={data} />;
};

export default App;
