import { type NextRequest } from "next/server";
import { ModelPropertyHis, PropertyHisAttributes } from "@/app/lib/db";
import { handleDelete, handlePost } from "@/app/lib/request";
import { getUserInfo } from "@/app/lib/userInfo";

export async function POST(req: NextRequest) {
  return handlePost<PropertyHisAttributes>(req, async (data) => {
    const userInfo = await getUserInfo();
    data.uid = userInfo.uid;
    const res = await ModelPropertyHis.insertOrUpdate(data);

    return res;
  });
}
export async function DELETE(req: NextRequest) {
  return handleDelete<PropertyHisAttributes>(req, async (data) => {
    const userInfo = await getUserInfo();

    const res = await ModelPropertyHis.deleteItem(
      userInfo.uid,
      data.symbol,
      data.markDate
    );

    return res;
  });
}
