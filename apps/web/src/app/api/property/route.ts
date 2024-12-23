import { type NextRequest } from "next/server";
import {
  modelProperty,
  ModelPropertyHis,
  Property,
  PropertyHis,
} from "@/app/lib/db";
import dayjs from "dayjs";
import { handlePost, handleGet } from "@/app/lib/request";
import { getUserInfo } from "@/app/lib/userInfo";

export async function GET(req: NextRequest) {
  return handleGet<{ id: string }>(req, async ({ id }) => {
    const property = await modelProperty.getOne(+id);
    let propertyHis: PropertyHis[] = [];
    if (property) {
      propertyHis = await ModelPropertyHis.getList(
        property.uid,
        property.symbol
      );
    }
    return { property, propertyHis };
  });
}

export async function POST(req: NextRequest) {
  return handlePost<Property & { amount: number }>(req, async (data) => {
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
  });
}
