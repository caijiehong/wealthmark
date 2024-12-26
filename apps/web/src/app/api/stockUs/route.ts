import { type NextRequest } from "next/server";
import { ModelStockUs } from "@/app/lib/db";
import { handlePost } from "@/app/lib/request";

import { stock_us_spot_em } from "@/app/business/aktools";

export async function POST(req: NextRequest) {
  return handlePost<{}>(req, async () => {
    const res = await stock_us_spot_em();
    const list: { symbol: string; name: string; akShareId: string }[] = [];

    res.forEach((item) => {
      // item["代码"] 举例 105.META
      // 需要取出数字和小数点后面的字符串作为 symbol
      const m = item["代码"].match(/\d+\.(\w+)/);
      const symbol = m && m[1];
      if (symbol) {
        list.push({
          symbol,
          name: item["名称"],
          akShareId: item["代码"],
        });
      }
    });
    ModelStockUs.updateAll(list);

    return {};
  });
}
