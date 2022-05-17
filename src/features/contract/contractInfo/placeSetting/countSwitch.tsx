import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateCountType } from "../../../../store/modules/placeSlice";

const CountType = styled(Flex)`
  // min-width: 78px;
  height: 28px;
  background: #08060f;
  border-radius: 20px;
  padding: 0 2px;
  margin-left: 26px;
  cursor: pointer;
  // width: 0;
  span.item {
    height: 24px;
    border-radius: 12px;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 24px;
  }
  span.index-item {
    background: #4a4062;
    color: #ffffff;
  }
`;

const CountSwitch = () => {
  const countType = useAppSelector((state) => state.place.countType);
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log(contractItem, "contractItem");
  }, [contractItem]);

  const changeCountType = (v: number): void => {
    dispatch(updateCountType(v));
  };

  return (
    <CountType>
      <span
        className={`item ${countType === 1 ? "index-item" : ""}`}
        onClick={() => changeCountType(1)}
      >
        {contractItem.contractSide === 1
          ? contractItem?.commodityName
          : contractItem.currencyName}
      </span>
      <span
        className={`item ${countType === 0 ? "index-item" : ""}`}
        onClick={() => changeCountType(0)}
      >
        {t("Cont")}
      </span>
    </CountType>
  );
};

export default CountSwitch;
