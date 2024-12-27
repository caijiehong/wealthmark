import { type NextRequest } from "next/server";
import { modelFundNameEm, ModelStockUs } from "@/app/lib/db";
import { handlePost } from "@/app/lib/request";

import { fund_name_em, stock_us_spot_em } from "@/app/business/aktools";

async function update_stock_us_spot_em() {
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
}

async function update_fund_name_em() {
  const res = await fund_name_em();
  const list: Parameters<typeof modelFundNameEm.updateAll>[0] = [];

  res.forEach((item) => {
    list.push({
      symbol: item["基金代码"],
      name: item["基金简称"],
      shortName: item["拼音缩写"],
      type: item["基金类型"],
      pinyin: item["拼音全称"],
    });
  });
  modelFundNameEm.updateAll(list);
}

export async function POST(req: NextRequest) {
  return handlePost<{ action: string }>(req, async ({ action }) => {
    switch (action) {
      case "stock_us_spot_em": {
        await update_stock_us_spot_em();
        break;
      }
      case "fund_name_em": {
        await update_fund_name_em();
        break;
      }
    }

    return {};
  });
}
