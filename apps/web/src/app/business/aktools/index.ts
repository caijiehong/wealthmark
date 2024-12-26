import { Currency, Market } from "@/app/lib/enums";
import {
  ICurrency_boc_sina,
  IStock_hk_hist,
  IStockHkSpotEmItem,
} from "./types";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

async function fetchAktools<T>(
  apiName: string,
  params?: Record<string, string>
) {
  "use cache";
  cacheTag("fetchAktools");
  cacheLife("hours");

  async function _fetchAkTools() {
    const url = `http://127.0.0.1:8888/api/public/${apiName}`;

    const urlWithParams = new URL(url);
    if (params) {
      for (const key in params) {
        urlWithParams.searchParams.append(key, params[key]!);
      }
    }

    const res = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data as T;
  }

  return _fetchAkTools();
}

/**
 * 获取某只股票/基金的最新价格
 * @param symbol
 */
export async function loadStokInfoUs(
  symbol: string,
  startDate: string,
  endDate: string
) {
  const res = await fetchAktools<any>("stock_us_hist", {
    // 美股编码必须大写
    symbol: symbol.toUpperCase(),
    period: "daily",
    start_date: startDate,
    end_date: endDate,
  });

  return res;
}

export async function loadStockRealTimeAll() {
  const res = await fetchAktools<IStockHkSpotEmItem[]>("stock_hk_spot_em");

  return res;
}

export async function stock_hk_hist(
  symbol: string,
  start_date: string,
  end_date: string,
  period: "daily" | "weekly" | "monthly" = "weekly"
) {
  const res = await fetchAktools<IStock_hk_hist[]>("stock_hk_hist", {
    symbol,
    start_date,
    end_date,
    period,
  });

  return res;
}

export async function loadStockRealTime(symbol: string) {
  const res = await loadStockRealTimeAll();

  const findObj = res.find((item) => item["代码"] === symbol);

  return findObj;
}

export async function loadStockHis(symbol: string, market: Market) {
  const res = await loadStockRealTimeAll();

  const findObj = res.find((item) => item["代码"] === symbol);

  return findObj;
}

export async function currency_boc_sina(
  currency: Currency,
  start_date: string,
  end_date: string
): Promise<ICurrency_boc_sina[]> {
  if (currency === Currency.cny) {
    return [];
  }

  const cur =
    currency === Currency.hkd
      ? "港币"
      : currency === Currency.usd
        ? "美元"
        : "人民币";

  const res = await fetchAktools<ICurrency_boc_sina[]>("currency_boc_sina", {
    symbol: cur,
    start_date,
    end_date,
  });

  return res;
}
