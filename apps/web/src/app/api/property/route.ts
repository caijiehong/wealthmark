import { NextResponse, type NextRequest } from "next/server";
// import { loadStokInfoUs } from "../../../business/aktools";
// import dayjs from "dayjs";
import { db } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  const model = await db.getModelProperty();

  const res = await model.findOne({
    where: {
      uid: "test",
    },
  });

  return NextResponse.json({
    res,
  });
}
