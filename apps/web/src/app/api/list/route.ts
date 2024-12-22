import { modelProperty } from "@/app/lib/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, abc: any) {
  console.log("abc", abc);

  const { uid } = Object.fromEntries(req.nextUrl.searchParams) as {
    uid: string;
  };

  const data = await modelProperty.getList(uid);

  return NextResponse.json({
    data,
  });
}
