import { isNumber } from "./typeChecks";

/**
 * 格式化大数据
 * @param value
 */
export function formatBigNumber(value) {
  if (isNumber(+value)) {
    if (value > 1000000000) {
      return `${+(value / 1000000000).toFixed(3)}B`;
    }
    if (value > 1000000) {
      return `${+(value / 1000000).toFixed(3)}M`;
    }
    if (value > 1000) {
      return `${+(value / 1000).toFixed(3)}K`;
    }
    return value;
  }
  return "--";
}
