/**
 * 数字千分位格式化
 * @param num
 * @returns
 */
export const formattedNumber = (num: number) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
