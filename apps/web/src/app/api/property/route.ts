import { NextResponse, type NextRequest } from "next/server";
// import { loadStokInfoUs } from "../../../business/aktools";
// import dayjs from "dayjs";
import { getModelProperty } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const model = await getModelProperty();

  const res = await model.findOne({
    where: {
      uid: "test",
    },
  });

  return NextResponse.json({
    res,
  });
}
