import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, CheckboxGroup, Tooltip } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateCloseFlag, updatePositionEffect } from "../../../../store/modules/placeSlice";
import { toFix6 } from "../../../../utils/filters";
const Balance = styled(Flex)`
  justify-content: space-between;
  margin-top: 8px;
`;

const BalanceItem = styled(Flex)`
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
const CheckBoxC = styled(Flex)`
  justify-content: flex-end;
`;

const balance = (props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const posiMode = useAppSelector((state) => state.place.posiMode);
  const priceTypeTab = useAppSelector((state) => state.place.priceTypeTab);
  const positionEffect = useAppSelector((state) => state.place.positionEffect);
  const closeFlag = useAppSelector((state) => state.place.closeFlag);
  const side = useAppSelector((state) => state.place.side);
  const costBuy = useAppSelector((state) => state.place.costBuy);
  const costSell = useAppSelector((state) => state.place.costSell);
  const marginAvail = useAppSelector((state) => state.assets.marginAvail);
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const changeCloseFlag = (v: boolean): void => {
    dispatch(updateCloseFlag(v));
  };

  const cost = (v: number) => {
    const _d = contractItem?.contractSide === 1 ? 2 : 6;
    return v > 0
      ? Number(costBuy)
        ? toFix6(costBuy, _d)
        : "--"
      : Number(costSell)
      ? toFix6(costSell, _d)
      : "--";
  };

  return (
    <>
      {posiMode ? (
        <>
          {positionEffect === 1 && (
            <Balance>
              <BalanceItem>
                <Tooltip text={t("balanceTip")}>
                  <span className="label">{t("Margin")}</span>
                </Tooltip>
                <span className="value">{cost(1)}</span>
                <span className="label">{contractItem.currencyName}</span>
              </BalanceItem>
              <BalanceItem justify="flex-end">
                <Tooltip text={t("balanceTip")}>
                  <span className="label">{t("Margin")}</span>
                </Tooltip>
                <span className="value">{cost(-1)}</span>
                <span className="label">{contractItem.currencyName}</span>
              </BalanceItem>
            </Balance>
          )}
        </>
      ) : (
        <Balance>
          <BalanceItem>
            <Tooltip text={t("balanceTip")}>
              <span className="label">{t("Margin")}</span>
            </Tooltip>
            <span className="value">{cost(side)}</span>
            <span className="label">{contractItem.currencyName}</span>
          </BalanceItem>
          {priceTypeTab === 4 && (
            <BalanceItem justify="flex-end">
              <CheckBoxC>
                <span>
                  <CheckboxGroup
                    text={t("TriggerClosePosition")}
                    checked={closeFlag}
                    onChange={() => changeCloseFlag(!closeFlag)}
                    isDark
                  />
                </span>
              </CheckBoxC>
            </BalanceItem>
          )}
        </Balance>
      )}
    </>
  );
};

export default balance;
