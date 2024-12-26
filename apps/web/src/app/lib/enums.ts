/**
 * 所属市场
 */
export enum Market {
  CN = "CN",
  HK = "HK",
  US = "US",
  CASH = "CASH",
}
/**
 * 所属市场
 */
export const mapMarket = [
  { label: "A股", value: Market.CN },
  { label: "港股", value: Market.HK },
  { label: "美股", value: Market.US },
  { label: "现金", value: Market.CASH },
];

/**
 * 投资标的
 */
export enum MarketType {
  CHINA = "CHINA",
  GLOBAL = "GLOBAL",
  CASH = "CASH",
}

/**
 * 投资标的
 */
export const mapMarketType = [
  { label: "中国资产", value: MarketType.CHINA },
  { label: "国际资产", value: MarketType.GLOBAL },
  { label: "现金", value: MarketType.CASH },
];

/**
 * 币种
 */
export enum Currency {
  CNY = "CNY",
  HKD = "HKD",
  USD = "USD",
}

/**
 * 币种
 */
export const mapCurrency = [
  { label: "人民币", value: Currency.CNY },
  { label: "港币", value: Currency.HKD },
  { label: "美元", value: Currency.USD },
];

export function getCurrencyLabel(currency: Currency) {
  return mapCurrency.find((item) => item.value === currency)!.label;
}
