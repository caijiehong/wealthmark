import { Market } from "@/app/lib/enums";
import { type NextRequest } from "next/server";
import { loadStockRealTime } from "@/app/business/aktools";
import { handleGet } from "@/app/lib/request";

export async function GET(req: NextRequest) {
  return handleGet<{
    market: Market;
    symbol: string;
  }>(req, async ({ market, symbol }) => {
    if (market === Market.hk) {
      const resHK = await loadStockRealTime(symbol);
      if (!resHK) {
        return null;
      }
      return { symbol, name: resHK.名称 };
    }

    throw new Error("Invalid market");
  });
}
