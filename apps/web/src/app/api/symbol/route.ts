import { Market, SecurityType } from "@/app/lib/enums";
import { type NextRequest } from "next/server";
import { loadStockRealTime } from "@/app/business/aktools";
import { handleGet } from "@/app/lib/request";
import { modelFundNameEm, ModelStockUs } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  return handleGet<
    {
      market: Market;
      symbol: string;
      securityType: SecurityType;
    },
    { symbol: string; name: string } | null
  >(req, async ({ market, symbol, securityType }) => {
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
    } else if (market === Market.CN) {
      if (
        securityType === SecurityType.FUND ||
        securityType === SecurityType.ETF
      ) {
        const resFund = await modelFundNameEm.getOne(symbol);

        if (!resFund) {
          return null;
        }
        return { symbol, name: resFund.name };
      }
    }

    throw new Error("Invalid market");
  });
}
