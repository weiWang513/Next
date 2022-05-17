import { selectUserHabit } from "../store/modules/appSlice";
import { useAppSelector } from "../store/hook";

const useUpDownColor = () => {
  const userHabit = useAppSelector(selectUserHabit);

  const colorGreen = "rgba(20, 175, 129, 1)";
  const colorGreenArea = "rgba(20, 175, 129, 0.15)";
  const orderColorGreenArea = "rgba(20, 175, 129, 0.2)";
  const orderHoverColorGreenArea = "rgba(20, 175, 129, 0.3)";

  const colorRed = "rgba(236, 81, 109, 1)";
  const colorRedArea = "rgba(236, 81, 109, 0.15)";
  const orderColorRedArea = "rgba(236, 81, 109, 0.2)";
  const orderHoverColorRedArea = "rgba(236, 81, 109, 0.3)";


  const colorUp = userHabit?.upDownColor === "0" ? colorGreen : colorRed;
  const colorUpArea =
    userHabit?.upDownColor === "0" ? colorGreenArea : colorRedArea;

  const colorDown = userHabit?.upDownColor === "0" ? colorRed : colorGreen;
  const colorDownArea =
    userHabit?.upDownColor === "0" ? colorRedArea : colorGreenArea;

  const orderDownColorArea =
    userHabit?.upDownColor === "0" ? orderColorRedArea : orderColorGreenArea;
  const orderDownHoverColorArea =
    userHabit?.upDownColor === "0" ? orderHoverColorRedArea : orderHoverColorGreenArea;

  const orderUpColorArea =
    userHabit?.upDownColor === "1" ? orderColorRedArea : orderColorGreenArea;
  const orderUpDownHoverColorArea =
    userHabit?.upDownColor === "1" ? orderHoverColorRedArea : orderHoverColorGreenArea;

  // const orderColorArea

  return { colorGreen, colorRed, colorUp, colorUpArea, colorDown, colorDownArea, orderDownColorArea, orderDownHoverColorArea, orderUpColorArea, orderUpDownHoverColorArea };
};

export default useUpDownColor;
