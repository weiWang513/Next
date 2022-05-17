import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useAppSelector } from "../../store/hook";
import { selectIndictorList } from "../../store/modules/contractSlice";
import { formatByPriceTick } from "../../utils/filters";

const IndicatorSliderContainer = styled(Flex)`
  flex-direction: column;
  // height: 129px;
  margin-top: 8px;
`;

const PriceWrap = styled(Flex)`
  justify-content: space-between;
`;

const Price = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #aaa4bb;
  line-height: 15px;
`;

const ThumbWrap = styled(Flex)`
  justify-content: space-between;
  border-radius: 3px;
  margin-top: 4px;
  position: relative;
`;

const Thumb = styled.div`
  width: 115px;
  height: 6px;
  background: #f5f3fb;
`;

const Dot = styled.div<{ left: number }>`
  position: absolute;
  width: 0;
  height: 0;
  border-top: 5px solid rgba(96, 36, 253, 1);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  left: ${({ left }) => left}%;
  bottom: 3px;
  z-index: 2;
`;

const IndicatorSlider = ({ tradingData, contractId }) => {
  const [left, setLeft] = useState(0);

  const indictorList = useAppSelector(selectIndictorList);

  const _lastPrice = () => {
    let indictorListItem: { result: any } = indictorList.find(
      (el: any) => el.contractId === contractId
    );
    return (
      formatByPriceTick(indictorListItem?.result?.lastPrice, contractId) || "--"
    );
  };

  const getLeft = () => {
    let lastPrice = _lastPrice();
    let duration = tradingData?.high - tradingData?.low;
    let member = lastPrice - tradingData?.low;
    if (!duration) return 0;
    if (lastPrice < tradingData?.low) return 0;
    if (lastPrice > tradingData?.high) return 100;
    setLeft(Math.floor((member / duration) * 100));
  };

  useEffect(() => {
    let isActive = true;
    isActive && getLeft();

    return () => {
      isActive = false;
    };
  }, [indictorList, tradingData]);

  return (
    <IndicatorSliderContainer>
      <PriceWrap>
        <Price>{tradingData?.low}</Price>
        <Price>{tradingData?.high}</Price>
      </PriceWrap>
      <ThumbWrap>
        <Dot left={left} />
        <Thumb></Thumb>
        <Thumb></Thumb>
      </ThumbWrap>
    </IndicatorSliderContainer>
  );
};

export default IndicatorSlider;
