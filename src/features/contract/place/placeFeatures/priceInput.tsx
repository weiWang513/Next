import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Input, InputGroup, Select } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  updatePrice,
  updatePriceType,
} from "../../../../store/modules/placeSlice";
import FirstPrice from "./firstPrice";

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
    // margin-right: ${({ r }) => r};
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

const PriceSelect = styled(Select)`
  width: 72px;
  flex: 0 0 72px;
  // background: rgba(24, 18, 38, 1);
`;

const StopPriceC = styled(Flex)`
  background: rgba(31, 24, 48, 1);
  padding-right: 4px;
`;

const ConditionInputWrap = styled.div``;

const priceInput = (props) => {
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const price = useAppSelector((state) => state.place.price);
  const priceTypeTab = useAppSelector((state) => state.place.priceTypeTab);
  const priceType = useAppSelector((state) => state.place.priceType);
  const positionEffect = useAppSelector((state) => state.place.positionEffect);
  const dispatch = useAppDispatch();
  const Big = require("big.js");
  const { t } = useTranslation()

  const changePriceType = (v): void => {
    console.log("priceType", v);
    dispatch(updatePriceType(v.value));
  };
  const renderPerfix = () => {
    return <AddonBefore>{t('OrderPrice')}:</AddonBefore>;
  };
  const renderAddonAfter = () => {
    return (
      <AddonAfter r={priceTypeTab === 4 ? "10px" : ""}>
        <span className="symbol">
          {contractItem.contractSide === 1
            ? contractItem?.currencyName
            : contractItem?.commodityName}
        </span>
        {priceTypeTab === 4 && renderSelect()}
      </AddonAfter>
    );
  };

  const renderSelect = () => {
    return (
      <PriceSelect
        width={72}
        scale="sm"
        isDark={true}
        value={priceType}
        sp={10}
        ep={6}
        options={[
          {
            label: t('limit'),
            value: 1,
          },
          {
            label: t('market'),
            value: 3,
          },
        ]}
        background="rgba(24, 18, 38, 1)"
        onChange={changePriceType}
      />
    );
  };
  const handleChange = (v) => {
    let n = v.target.value;
    if (!contractItem?.priceTick) {
      return false;
    }
    if (n === "") {
      dispatch(updatePrice(n));
    }
    let pt = contractItem.priceTick;
    let reg = /^\d+\.?\d*$/;
    let regNumber = /^\d+\.?\d+$/;
    if (reg.test(n)) {
      if (pt && regNumber.test(n)) {
        let price = Number.isInteger(Number(new Big(n).div(pt)))
          ? n
          : new Big(Math.floor(new Big(n).div(pt))).times(pt).toString();
        dispatch(
          updatePrice(price.length > 8 ? price.slice(0, 9) : price)
        );
      } else {
        dispatch(updatePrice(n));
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
            <InputGroup
              startIcon={renderPerfix()}
              endIcon={renderAddonAfter()}
              ta={"right"}
            >
              <RInput value={price} maxLength={9} onChange={handleChange} />
            </InputGroup>
            {positionEffect === 1 && <FirstPrice />}
          </>
        );
      case 3:
        return (
          <MarketPrice p="0 16px;">
            <span className="label">{t('OrderPrice')}:</span>
            <span className="market-price">{t('MarketPrice')}</span>
            <span className="symbol">
              {contractItem.contractSide === 1
                ? contractItem?.currencyName
                : contractItem?.commodityName}
            </span>
          </MarketPrice>
        );
      case 4:
        if (priceType === 1) {
          return (
            <ConditionInputWrap>
              <InputGroup
                startIcon={renderPerfix()}
                endIcon={renderAddonAfter()}
                ta={"right"}
                ep={4}
              >
                <RInput value={price} maxLength={9} onChange={handleChange} />
              </InputGroup>
              {/* <FirstPrice /> */}
            </ConditionInputWrap>
          );
        } else {
          return (
            <StopPriceC>
              <MarketPrice p="0 0 0 16px;">
                <span className="label">{t('OrderPrice')}:</span>
                <span className="market-price">{t('MarketPrice')}</span>
                <span className="symbol">
                  {contractItem.contractSide === 1
                    ? contractItem?.currencyName
                    : contractItem?.commodityName}
                </span>
              </MarketPrice>
              {renderSelect()}
            </StopPriceC>
          );
        }
      default:
        break;
    }
  };

  useEffect(() => {
    console.log("priceType", priceType);
  }, [priceType]);
  return (
    <PriceInput>
      {/* {
        priceTypeTab === 3 ? (
          <MarketPrice>
            <span className="label">委托价格:</span>
            <span className="market-price">市场最优价</span>
            <span className="symbol">{contractItem?.commodityName}</span>
          </MarketPrice>
        ) : (
          <InputGroup
            startIcon={renderPerfix()}
            endIcon={renderAddonAfter()}
            ta={'right'}
          >
            <RInput value={price} maxLength={9} type="number" onChange={handleChange} />
          </InputGroup>
        )
      } */}
      {renderPrice()}
    </PriceInput>
  );
};

export default priceInput;
