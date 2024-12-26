import { Market } from "@/app/lib/enums";
import { type NextRequest } from "next/server";
import { loadStockRealTime } from "@/app/business/aktools";
import { handleGet } from "@/app/lib/request";
import { ModelStockUs } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  return handleGet<{
    market: Market;
    symbol: string;
  }>(req, async ({ market, symbol }) => {
    if (market === Market.HK) {
      const resHK = await loadStockRealTime(symbol);
      if (!resHK) {
        return null;
      }
      return { symbol, name: resHK.名称 };
    } else if (market === Market.US) {
      const resUs = await ModelStockUs.getOne(symbol);
      if (!resUs) {
        return null;
      }
      return { symbol, name: resUs.name };
    }

    throw new Error("Invalid market");
  });
}
