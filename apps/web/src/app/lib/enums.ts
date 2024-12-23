export enum Market {
  cn = "cn",
  hk = "hk",
  us = "us",
  cash = "cash",
}
export const market = [
  { label: "A股", value: Market.cn },
  { label: "港股", value: Market.hk },
  { label: "美股", value: Market.us },
  { label: "现金", value: Market.cash },
];

export enum MarketType {
  china = "china",
  global = "global",
  cash = "cash",
}

export const marketType = [
  { label: "中国资产", value: MarketType.china },
  { label: "国际资产", value: MarketType.global },
  { label: "现金", value: MarketType.cash },
];
export enum Currency {
  cny = "cny",
  hkd = "hkd",
  usd = "usd",
}

export const currency = [
  { label: "人民币", value: Currency.cny },
  { label: "港币", value: Currency.hkd },
  { label: "美金", value: Currency.usd },
];
