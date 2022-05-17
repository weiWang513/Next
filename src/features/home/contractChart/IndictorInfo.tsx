import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { Big } from "big.js";
import { useAppSelector } from "../../../store/hook";
import { selectIndictorList } from "../../../store/modules/contractSlice";
import { formatByPriceTick } from "../../../utils/filters";
import useUpDownColor from "../../../hooks/useUpDownColor";

const IndicatorInfoWrap = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
`;

const Symbol = styled.div<{ screenSzie?: any }>`
  font-size: ${({ screenSzie }) => (screenSzie?.width > 1200 ? "13px" : "12px")};
  font-weight: 600;
  color: #220a60;
  line-height: 18px;
  white-space: nowrap;
`;

const Ratio = styled.div<{ color: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ color }) => color};
  line-height: 15px;
  margin-left: 4px;
`;

const Price = styled.div<{ color: string }>`
  font-size: 18px;
  font-weight: 900;
  color: ${({ color }) => color};
  line-height: 23px;
  margin-top: 4px;
  font-family: DINPro-Black;
`;

const ColumeFlex = styled(Flex)`
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ColumnLastPrice = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 18px;
  line-height: 22px;
  font-weight: bold;
  margin: 3px 0;
`;

interface indictorListItemType {
  lastPrice;
  priceChangeRadio;
}

const IndicatorInfo = ({ item, screenSzie }) => {
  const [indictorListItem, setIndictorListItem] = useState<indictorListItemType>();

  const indictorList = useAppSelector(selectIndictorList);

  const { colorUp, colorDown } = useUpDownColor();

  const _lastPrice = () => {
    return formatByPriceTick(indictorListItem?.lastPrice, item.contractId) || "--";
  };

  const priceChangeRadio = (v) => {
    let res = "0";
    if (v) {
      res = new Big(v).times(100).toFixed(2);
    }
    return res;
  };

  useEffect(() => {
    if (!item?.contractId) return;

    let _indictorListItem: { result } = indictorList?.find(
      (el: any) => el.contractId === item.contractId
    );

    setIndictorListItem(_indictorListItem?.result);
  }, [indictorList, item.contractId]);

  return (
    <IndicatorInfoWrap>
      {screenSzie?.width > 1200 ? (
        <>
          <Flex>
            <Symbol>{item?.symbol.replace(/\/|\-/, "/")}</Symbol>
            <Ratio color={indictorListItem?.priceChangeRadio > 0 ? colorUp : colorDown}>
              {indictorListItem?.priceChangeRadio > 0 ? "+" : ""}
              {priceChangeRadio(indictorListItem?.priceChangeRadio)}%
            </Ratio>
          </Flex>
          <Price color={indictorListItem?.priceChangeRadio > 0 ? colorUp : colorDown}>
            {_lastPrice()}
          </Price>
        </>
      ) : (
        <>
          <ColumeFlex>
            <Symbol screenSzie={screenSzie}>{item?.symbol.replace(/\/|\-/, "/")}</Symbol>
            <ColumnLastPrice color={indictorListItem?.priceChangeRadio > 0 ? colorUp : colorDown}>
              {_lastPrice()}
            </ColumnLastPrice>
            <Ratio color={indictorListItem?.priceChangeRadio > 0 ? colorUp : colorDown}>
              {indictorListItem?.priceChangeRadio > 0 ? "+" : ""}
              {priceChangeRadio(indictorListItem?.priceChangeRadio)}%
            </Ratio>
          </ColumeFlex>
        </>
      )}
    </IndicatorInfoWrap>
  );
};

export default IndicatorInfo;
