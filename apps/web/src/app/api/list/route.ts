import { modelProperty } from "@/app/lib/db";
import { type NextRequest } from "next/server";
import { handleGet } from "@/app/lib/request";
import { getUserInfo } from "@/app/lib/userInfo";

export async function GET(req: NextRequest) {
  return handleGet(req, async () => {
    const { uid } = await getUserInfo();

    const data = await modelProperty.getList(uid);

    return data;
  });
}
