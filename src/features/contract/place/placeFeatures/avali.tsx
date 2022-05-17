import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex, useModal } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  updateAllInQuantityBuy,
  updateAllInQuantitySell,
  updateAllInValueBuy,
  updateAllInValueSell,
  updateCount,
  updatePercent,
} from "../../../../store/modules/placeSlice";
import { ReactComponent as Transfer } from "/public/images/SVG/transfer_avail.svg";
import { calcQuantityFn } from "../../../../utils/common";
import Passive from "../../../../components/Place/Passive";
import TransferModal from "../assetInfo/transferModal";
import { toFix6 } from "../../../../utils/filters";

const Big = require("big.js");
const Avali = styled(Flex)`
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Avalible = styled(Flex)`
  justify-content: ${({ justify }) => justify || "flex-start"};
  span.label,
  span.symbol {
    font-size: 12px;
    font-weight: bold;
    color: #615976;
    line-height: 15px;
  }
  span.value {
    font-size: 12px;
    font-weight: bold;
    color: #ffffff;
    line-height: 15px;
    margin: 0 4px;
  }
`;
const TransferIcon = styled(Transfer)`
  cursor: pointer;
`;

const AF = styled(Flex)`
  flex: 1;
  width: 100%;
  flex-direction: ${({ fd }) => fd};
  justify-content: space-between;
`;

const avali = (props) => {
  const countType = useAppSelector((state) => state.place.countType);
  const allInValueBuy = useAppSelector((state) => state.place.allInValueBuy);
  const allInValueSell = useAppSelector((state) => state.place.allInValueSell);
  const allInQuantityBuy = useAppSelector(
    (state) => state.place.allInQuantityBuy
  );
  const allInQuantitySell = useAppSelector(
    (state) => state.place.allInQuantitySell
  );
  const lever = useAppSelector((state) => state.place.lever);
  const price = useAppSelector((state) => state.place.price);
  const crossLever = useAppSelector((state) => state.place.crossLever);
  const modeType = useAppSelector((state) => state.place.modeType);
  const priceType = useAppSelector((state) => state.place.priceType);
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const snapshot = useAppSelector((state) => state.contract.snapshot);
  const posiMode = useAppSelector((state) => state.place.posiMode);
  const side = useAppSelector((state) => state.place.side);
  const positionEffect = useAppSelector((state) => state.place.positionEffect);
  const avali = useAppSelector((state) => state.assets.available);
  const posListProps = useAppSelector((state) => state.assets.posListProps);
  const currencyList = useAppSelector((state) => state.contract.currencyList);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const isLogin = useAppSelector((state) => state.app.isLogin);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [openTransferModal] = useModal(
    <TransferModal
      contractItem={contractItem}
      currencyList={currencyList}
      isLogin={isLogin}
    />
  );
  useEffect(() => {
    if (contractItem.priceTick && snapshot?.lastPrice) {
      let _A = (1 - 0.001 * (lever > 100 ? 100 : lever)) * avali;
      const _buyObj = calcQuantityFn(
        _A,
        true,
        1,
        contractItem,
        snapshot,
        price,
        crossLever,
        modeType,
        lever,
        priceType,
        countType,
        false
      );
      const _sellObj = calcQuantityFn(
        _A,
        true,
        -1,
        contractItem,
        snapshot,
        price,
        crossLever,
        modeType,
        lever,
        priceType,
        countType,
        false
      );
      // console.log('_buyObj', _buyObj,  _sellObj)
      dispatch(updateAllInValueBuy(_buyObj.allInValue));
      dispatch(updateAllInValueSell(_sellObj.allInValue));
      dispatch(updateAllInQuantityBuy(_buyObj.allInQuantity));
      dispatch(updateAllInQuantitySell(_sellObj.allInQuantity));
    }
  }, [
    countType,
    lever,
    crossLever,
    modeType,
    priceType,
    contractItem,
    snapshot,
  ]);

  const renderPosiN = (v: number) => {
    let absQ = posListProps.find(
      (e) => e.contractId === contractId && e.side === -v
    );

    return countType
      ? renderValue(Math.abs(absQ?.fairQty))
      : Math.abs(absQ?.fairQty) || 0;
  };

  const transfer = (): void => {
    openTransferModal();
    dispatch(updateAllInQuantityBuy(""));
    dispatch(updateAllInQuantitySell(""));
    dispatch(updatePercent(0));
    dispatch(updateCount(0));
  };

  const maxBuy = (v: number): any => {
    let _maxBuy = countType ? allInValueBuy : allInQuantityBuy;
    let _maxSell = countType ? allInValueSell : allInQuantitySell;
    return v > 0
      ? Number(_maxBuy) > 0
        ? _maxBuy
        : "--"
      : Number(_maxSell) > 0
      ? _maxSell
      : "--";
  };

  const renderValue = (v) => {
    const _d = contractItem?.contractSide === 1 ? 2 : 6;
    const _v =
      contractItem?.contractSide === 1
        ? new Big(Math.abs(v) || 0).times(contractItem?.contractUnit).toString()
        : new Big(Math.abs(v) || 0)
            .times(contractItem.contractUnit)
            .div(snapshot?.lastPrice || 1)
            .toString();
    return `${toFix6(_v, _d)}`;
  };

  return (
    <>
      <Avali>
        <Avalible>
          <span className="label">{t("Avali")}</span>
          <span className="value">
            {toFix6(avali, contractItem?.contractSide === 1 ? 2 : 6)}
          </span>
          <span className="label">{contractItem.currencyName}</span>
        </Avalible>
        <TransferIcon onClick={transfer} />
      </Avali>
      <Avali>
        {posiMode ? (
          <AF fd={positionEffect === 1 ? "row" : "row-reverse"}>
            <Avalible
              justify={positionEffect === 1 ? "flex-start" : "flex-end"}
            >
              <span className="label">
                {positionEffect === 1 ? t("MaxLong") : t("MaxCloseShort")}
              </span>
              <span className="value">
                {positionEffect === 1 ? maxBuy(1) : renderPosiN(1)}
              </span>
              <span className="label">
                {countType
                  ? contractItem?.contractSide === 1
                    ? contractItem?.commodityName
                    : contractItem?.currencyName
                  : t("Cont")}
              </span>
            </Avalible>
            <Avalible
              justify={positionEffect === 2 ? "flex-start" : "flex-end"}
            >
              <span className="label">
                {positionEffect === 1 ? t("MaxShort") : t("MaxCloseLong")}
              </span>
              <span className="value">
                {positionEffect === 1 ? maxBuy(-1) : renderPosiN(-1)}
              </span>
              <span className="label">
                {countType
                  ? contractItem?.contractSide === 1
                    ? contractItem?.commodityName
                    : contractItem?.currencyName
                  : t("Cont")}
              </span>
            </Avalible>
          </AF>
        ) : (
          <Flex>
            {console.log("allInValueBuy", allInValueBuy, allInValueSell)}
            {side > 0 ? (
              <Avalible>
                <span className="label">{t("MaxBuy")}</span>
                <span className="value">{maxBuy(1)}</span>
                <span className="label">
                  {countType
                    ? contractItem?.contractSide === 1
                      ? contractItem?.commodityName
                      : contractItem?.currencyName
                    : t("Cont")}
                </span>
              </Avalible>
            ) : (
              <Avalible>
                <span className="label">{t("MaxSell")}</span>
                <span className="value">{maxBuy(-1)}</span>
                <span className="label">
                  {countType
                    ? contractItem?.contractSide === 1
                      ? contractItem?.commodityName
                      : contractItem?.currencyName
                    : t("Cont")}
                </span>
              </Avalible>
            )}
            <Passive />
          </Flex>
        )}
      </Avali>
    </>
  );
};

export default avali;
