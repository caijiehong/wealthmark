export interface IStockHkSpotEmItem {
  ["序号"]: number;
  ["代码"]: string;
  ["名称"]: string;
  ["最新价"]: number;
  ["涨跌额"]: number;
  ["涨跌幅"]: number;
  ["今开"]: number;
  ["最高"]: number;
  ["最低"]: number;
  ["昨收"]: number;
  ["成交量"]: number;
  ["成交额"]: number;
}

export interface IStock_hk_hist {
  /**
   * @example "2024-12-13T00:00:00.000"
   */
  ["日期"]: string;
  ["开盘"]: number;
  /**
   * @example 409.8
   */
  ["收盘"]: number;
  ["最高"]: number;
  ["最低"]: number;
  ["成交量"]: number;
  ["成交额"]: number;
  ["振幅"]: number;
  /**
   * @example -0.68
   */
  ["涨跌幅"]: number;
  ["涨跌额"]: number;
  ["换手率"]: number;
}
