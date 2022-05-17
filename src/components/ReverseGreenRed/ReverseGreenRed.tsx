/*
 * 根据用户选择的涨跌颜色，显示对应的颜色（一般为红涨绿跌或者绿涨红跌）
 */

import { FC, ReactNode } from "react";
import useUpDownColor from "../../hooks/useUpDownColor";

interface ReverseGreenRedProps {
  // 用于判断涨跌的值，当传入字符串时，会先格式化为Number类型再进行判断
  value: string | number;
  // 是否根据涨跌显示 + 符号
  needPrefix?: boolean;
  // 显示的内容，默认为 value 参数
  children?: ReactNode;
  // 当没有涨跌时，不设置涨跌色
  disableWhenEqual?: boolean;
}

const ReverseGreenRed: FC<ReverseGreenRedProps> = ({
  needPrefix,
  value,
  children,
  disableWhenEqual = false
}) => {
  const { colorUp, colorDown } = useUpDownColor();
  let textColor = "";

  // 当没有涨跌时，不设置涨跌色
  if (Number(value) === 0 && disableWhenEqual) {
    textColor = "";
  } else {
    textColor = Number(value) >= 0 ? colorUp : colorDown;
  }

  return (
    <span style={{ color: textColor }}>
      {needPrefix ? (Number(value) >= 0 ? "+" : "") : ""}
      {children || value}
    </span>
  );
};

export default ReverseGreenRed;
