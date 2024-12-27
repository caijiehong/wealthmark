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

export interface ICurrency_boc_sina {
  /**
   * @example "2024-12-18T00:00:00.000"
   */
  ["日期"]: string;
  ["中行汇买价"]: number;
  ["中行钞买价"]: number;
  ["中行钞卖价/汇卖价"]: number;
  /**
   * 汇率中间价, 基础换算单位是 100 人民币
   * @example 718.8
   */
  ["央行中间价"]: number;
}

export interface IStock_us_spot_em {
  ["序号"]: number;
  ["名称"]: string;
  ["最新价"]: number;
  ["涨跌额"]: number;
  ["涨跌幅"]: number;
  ["开盘价"]: number;
  ["最高价"]: number;
  ["最低价"]: number;
  ["昨收价"]: number;
  ["总市值"]: number;
  ["市盈率"]: number;
  ["成交量"]: number;
  ["成交额"]: number;
  ["振幅"]: number;
  ["换手率"]: number;
  /**
   * 105.META
   */
  ["代码"]: string;
}

export interface IStock_us_hist {
  ["日期"]: string;
  ["开盘"]: number;
  ["收盘"]: number;
  ["最高"]: number;
  ["最低"]: number;
  ["成交量"]: number;
  ["成交额"]: number;
  ["振幅"]: number;
  ["涨跌幅"]: number;
  ["涨跌额"]: number;
  ["换手率"]: number;
}

export interface IFund_name_em {
  ["基金代码"]: string;
  ["拼音缩写"]: string;
  ["基金简称"]: string;
  ["基金类型"]: string;
  ["拼音全称"]: string;
}

export interface IFund_etf_fund_info_em {
  // 净值日期: "2024-12-19T00:00:00.000",
  // 单位净值: 0.9622,
  // 累计净值: 0.9622,
  // 日增长率: 0.21,
  // 申购状态: "场内买入",
  // 赎回状态: "场内卖出"
  ["净值日期"]: string;
  ["单位净值"]: number;
  ["累计净值"]: number;
  ["日增长率"]: number;
  ["申购状态"]: string;
  ["赎回状态"]: string;
}
