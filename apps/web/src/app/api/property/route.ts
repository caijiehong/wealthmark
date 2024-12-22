import { NextResponse, type NextRequest } from "next/server";
import { modelProperty, ModelPropertyHis, Property } from "@/app/lib/db";
import dayjs from "dayjs";

export async function GET(req: NextRequest) {
  const { id } = Object.fromEntries(req.nextUrl.searchParams) as {
    id: string;
  };

  const data = await modelProperty.getOne(+id);

  return NextResponse.json({
    data,
  });
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const data: Property & { amount: number } = {
    ...json,
    uid: "test",
  };
  const res = await modelProperty.insertOrUpdate(data);
  if (!Number(data.id)) {
    ModelPropertyHis.insertOrUpdate({
      uid: data.uid,
      symbol: data.symbol,
      amount: data.amount,
      markDate: +dayjs().format("YYYYMMDD"),
    });
  }

  return NextResponse.json({
    data: res,
  });
}
