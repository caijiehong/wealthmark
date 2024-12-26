import { type NextRequest } from "next/server";
import {
  modelProperty,
  ModelPropertyHis,
  PropertyAttributes,
} from "@/app/lib/db";
import dayjs from "dayjs";
import { handleDelete, handlePost } from "@/app/lib/request";
import { getUserInfo } from "@/app/lib/userInfo";

export async function POST(req: NextRequest) {
  return handlePost<PropertyAttributes & { amount: number }>(
    req,
    async (data) => {
      const userInfo = await getUserInfo();
      data.uid = userInfo.uid;
      const res = await modelProperty.insertOrUpdate(data);
      if (!Number(data.id)) {
        ModelPropertyHis.insertOrUpdate({
          uid: data.uid,
          symbol: data.symbol,
          amount: data.amount,
          markDate: +dayjs().format("YYYYMMDD"),
        });
      }

      return res;
    }
  );
}
export async function Delete(req: NextRequest) {
  return handleDelete<PropertyAttributes>(req, async (data) => {
    const userInfo = await getUserInfo();
    data.uid = userInfo.uid;
    const p1 = modelProperty.remove(data.id, userInfo.uid, data.symbol);
    const p2 = ModelPropertyHis.deleteList(userInfo.uid, data.symbol);

    return Promise.all([p1, p2]);
  });
}
