import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex, Slider } from "@ccfoxweb/uikit";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  updateCommissionValueBuy,
  updateCommissionValueSell,
  updateCostBuy,
  updateCostSell,
  updateCount,
  updatePercent,
  updateQtyBuy,
  updateQtySell,
} from "../../../../store/modules/placeSlice";
import { slice6 } from "../../../../utils/filters";
import {
  calcCommissionValueFn,
  calcQuantityFn,
  costFn,
} from "../../../../utils/common";
const Big = require("big.js");
const Percentage = styled(Flex)`
  width: 288px;
  height: 36px;
  margin-top: 12px;
`;

const percentage = (props) => {
  // const [percent, setPercent] = useState(0)

  const lever = useAppSelector((state) => state.place.lever);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const side = useAppSelector((state) => state.place.side);
  const priceType = useAppSelector((state) => state.place.priceType);
  const priceTypeTab = useAppSelector((state) => state.place.priceTypeTab);
  const qtyBuy = useAppSelector((state) => state.place.qtyBuy);
  const qtySell = useAppSelector((state) => state.place.qtySell);
  const positionEffect = useAppSelector((state) => state.place.positionEffect);
  const stopPriceType = useAppSelector((state) => state.place.stopPriceType);
  const stopPrice = useAppSelector((state) => state.place.stopPrice);
  const price = useAppSelector((state) => state.place.price);
  const Passive = useAppSelector((state) => state.place.Passive);
  const modeType = useAppSelector((state) => state.place.modeType);
  const crossLever = useAppSelector((state) => state.place.crossLever);
  const countType = useAppSelector((state) => state.place.countType);
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const futureQuot = useAppSelector((state) => state.contract.snapshot);
  const posiMode = useAppSelector((state) => state.place.posiMode);
  const percent = useAppSelector((state) => state.place.percent);
  const avali = useAppSelector((state) => state.assets.available);
  const posListProps = useAppSelector((state) => state.assets.posListProps);

  useEffect(() => {
    handleSliderChange(0);
  }, [countType, priceTypeTab]);

  const dispatch = useAppDispatch();
  const handleSliderChange = (newValue: number) => {
    // setPercent(newValue);
    dispatch(updatePercent(newValue));
    if (!newValue) {
      dispatch(updateCount(""));
      return;
    }
    if (positionEffect === 1) {
      // dispatch(updateCount(`${newValue}%`));
      if ((priceType === 1 && price) || priceType === 3) {
        let _pm = newValue === 100 ? (1 - lever * 0.001) * 100 : newValue;
        setPercentAmount(Number(new Big(_pm).div(100).toString()), newValue);
      }
    } else {
      if (newValue) {
        let _posiB = renderPosiN(1);
        let _posiA = renderPosiN(-1);
        // let _posiN = _posiB > _posiA ? _posiA : _posiB
        const _qtyB = new Big(_posiB)
          .times(newValue)
          .div(100)
          .round(0, 0)
          .toString();
        const _qtyS = new Big(_posiA)
          .times(newValue)
          .div(100)
          .round(0, 0)
          .toString();
        console.log("handleSliderChange", _qtyB, _qtyS);
        dispatch(updateCount(`${newValue}%`));
        dispatch(updateQtyBuy(_qtyB));
        dispatch(updateQtySell(_qtyS));
      } else {
        dispatch(updateCount(""));
        dispatch(updateQtySell(""));
        dispatch(updateQtyBuy(""));
      }
    }
  };
  const renderPosiN = (v: number) => {
    return (
      Math.abs(
        posListProps.find((e) => e.contractId === contractId && e.side === -v)
          ?.fairQty
      ) || 0
    );
  };
  /**
   *  百分比下单金额->数量 转换
   * @param {百分比} v
   * @param {最大可开标志} allin
   */
  const setPercentAmount = (v, newValue) => {
    if (priceType === 1 && !price) {
      return false;
    }
    dispatch(updateCount(`${newValue}%`));
    console.log("setPercentAmount", v);
    // if (Number(props.available) <= 0) {
    if (Number(avali) <= 0) {
      // dispatch(updateCount(''))
      return false;
    }
    // 百分比下单金额
    let _percentAmount = slice6(new Big(avali).times(v).toString());
    // let _percentAmount = slice6(new Big(props.available).times(v).toString())
    calcQuantity(_percentAmount, false);
  };

  /**
   * 下单张数计算
   * @param {金额} percentAmount
   * @param {最大可开标志} allIn
   * @param {输入标志} inputFlag
   */
  const calcQuantity = (percentAmount, allIn, inputFlag?: boolean) => {
    let calcObjBuy = calcQuantityFn(
      percentAmount,
      allIn,
      1,
      contractItem,
      futureQuot,
      price,
      crossLever,
      modeType,
      lever,
      priceType,
      countType,
      true
    );
    let calcObjSell = calcQuantityFn(
      percentAmount,
      allIn,
      -1,
      contractItem,
      futureQuot,
      price,
      crossLever,
      modeType,
      lever,
      priceType,
      countType,
      true
    );
    dispatch(updateQtyBuy(calcObjBuy.quantity));
    dispatch(updateQtySell(calcObjSell.quantity));
    if (!inputFlag) {
      console.log("countType", countType, calcObjBuy, calcObjSell);
      let _count = 0;
      if (posiMode) {
        _count =
          Number(calcObjBuy._count) > Number(calcObjSell._count)
            ? calcObjSell._count
            : calcObjBuy._count;
      } else {
        if (side > 0) {
          _count = calcObjBuy._count;
        } else {
          _count = calcObjSell._count;
        }
      }
      // dispatch(updateCount(_count))
    }
    // 计算价值
    calcCommissionValue(calcObjBuy.quantity, 1);
    calcCommissionValue(calcObjSell.quantity, -1);
  };
  const calcCommissionValue = (_qty, side) => {
    let _commissionValue = calcCommissionValueFn(
      Math.floor(_qty),
      priceType,
      contractItem,
      price,
      futureQuot
    );
    // console.log('_commissionValue', _qty, side, _commissionValue.toString())
    if (side > 0) {
      // if (countType === 1) {
      //   dispatch(updateCount(_commissionValue))
      // }
      dispatch(updateCommissionValueBuy(_commissionValue));
      dispatch(
        updateCostBuy(costFn(_commissionValue, modeType, lever, crossLever))
      );
    } else {
      dispatch(updateCommissionValueSell(_commissionValue));
      dispatch(
        updateCostSell(costFn(_commissionValue, modeType, lever, crossLever))
      );
    }
  };
  return (
    <Percentage>
      <Slider
        name="slider"
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleSliderChange}
        step={1}
      />
    </Percentage>
  );
};

export default percentage;
