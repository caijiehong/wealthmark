async function fetchAktools<T>(
  apiName: string,
  params: Record<string, string>
) {
  const url = `http://127.0.0.1:8888/api/public/${apiName}`;

  const urlWithParams = new URL(url);
  for (const key in params) {
    urlWithParams.searchParams.append(key, params[key]!);
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
