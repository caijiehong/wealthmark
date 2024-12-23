import { NextResponse, type NextRequest } from "next/server";

export async function handleGet<Query = {}, ResData = unknown>(
  req: NextRequest,
  handler: (query: Query) => Promise<ResData>
) {
  const query = Object.fromEntries(req.nextUrl.searchParams) as Query;

  const data = await handler(query);
  return NextResponse.json({
    data,
  });
}
export async function handlePost<Body = {}, ResData = unknown>(
  req: NextRequest,
  handler: (body: Body) => Promise<ResData>
) {
  const body: Body = await req.json();
  const data = await handler(body);
  return NextResponse.json({
    data,
  });
}
