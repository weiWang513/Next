import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Input, InputGroup, Select } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import FirstPrice from "./firstPrice";
import { useSelector } from "react-redux";
import { selectCurrentSpot } from "../../../../store/modules/spotSlice";
const Big = require("big.js");

const PriceInput = styled.div`
  width: 288px;
  // height: 40px;
  // background: #1f1830;
  border-radius: 4px;
  margin-top: 10px;
  // cursor: pointer;
`;

const AddonBefore = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  line-height: 17px;
`;
const AddonAfter = styled(Flex)`
  // width: 130px;
  text-align: center;
  justify-content: center;
  span.symbol {
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #ffffff;
    line-height: 15px;
    min-width: 35px;
  }
  height: 16px;
  padding-left: 12px;
  border-left: 1px solid #4a4062;
`;
const RInput = styled(Input)`
  height: 40px;
  background: #1f1830;
  border-color: #1f1830;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  line-height: 21px;
`;

const MarketPrice = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  cursor: pointer;
  height: 40px;
  background: #1f1830;
  border-radius: 4px;
  padding: ${({ p }) => p};
  span.label {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
  span.market-price {
    flex: 1;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    line-height: 17px;
    text-align: right;
    padding-right: 12px;
  }

  span.symbol {
    min-width: 48px;
    text-align: center;
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #ffffff;
    line-height: 15px;
    padding-left: 12px;
    border-left: 1px solid #4a4062;
  }
`;

const priceInput = ({ priceTypeTab, price, changePrice }) => {
  const contractItem = useSelector(selectCurrentSpot);
  const { t } = useTranslation();

  const renderPerfix = () => {
    return <AddonBefore>{t("Price")}:</AddonBefore>;
  };
  const renderAddonAfter = () => {
    return (
      <AddonAfter>
        <span className="symbol">{contractItem?.currencyName}</span>
      </AddonAfter>
    );
  };
  const handleChange = (v) => {
    let n = v.target.value;
    if (!contractItem?.priceTick) {
      return false;
    }
    if (n === "") {
      changePrice(n);
    }
    let pt = contractItem?.priceTick;
    let reg = /^\d+\.?\d*$/;
    // let regNumber = /^\d+\.?\d+$/;
    let regNumber = /^(([1-9]\d*)(\.?\d*)?|0\.\d*|0)$/;
    if (reg.test(n)) {
      if (pt && regNumber.test(n)) {
        let price = Number.isInteger(Number(new Big(n).div(pt)))
          ? n
          : new Big(Math.floor(new Big(n).div(pt))).times(pt).toString();
        changePrice(price.length > 18 ? price.slice(0, 19) : price);
      } else {
        changePrice(price);
      }
    } else {
      return false;
    }
  };
  const renderPrice = () => {
    switch (priceTypeTab) {
      case 1:
        return (
          <>
            <InputGroup startIcon={renderPerfix()} endIcon={renderAddonAfter()} ta={"right"}>
              <RInput value={price} maxLength={18} onChange={handleChange} />
            </InputGroup>
            <FirstPrice changePrice={changePrice} />
          </>
        );
      case 3:
        return (
          <MarketPrice p="0 16px;">
            <span className="label">{t("OrderPrice")}:</span>
            <span className="market-price">{t("MarketPrice")}</span>
            <span className="symbol">{contractItem?.currencyName}</span>
          </MarketPrice>
        );
      default:
        break;
    }
  };
  return <PriceInput>{renderPrice()}</PriceInput>;
};

export default priceInput;
