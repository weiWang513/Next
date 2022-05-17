import React, { MouseEvent, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../store/hook";
import { useSelector } from "react-redux";
import {
  getCoinInfo,
  selectCoinInfo,
  selectCoinInfoStatus,
  selectCurrentCoin,
  setCurrentCoin
} from "../../../store/modules/coinInfoSlice";
import { STATUS_IDLE } from "../../../contants";
import { useAppSelector } from "../../../store/hook";
import { dateFormatYMD } from "../../../utils/filters";

const Container = styled.div<{ visible? }>`
  width: ${({ visible }) => (visible ? "260px" : 0)};
  height: ${({ visible }) => (visible ? "auto" : 0)};
  background: #1f1830;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  padding: ${({ visible }) => (visible ? "16px" : 0)};
  box-sizing: border-box;
  z-index: 1005;
  position: absolute;
  left: 0;
  top: 45px;
  overflow: hidden;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  // transition: all 0.3s ease-in-out;
`;

const Title = styled.div`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  line-height: 24px;
`;

const SubTitle = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  line-height: 20px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  line-height: 17px;
`;

const Value = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  line-height: 15px;
`;

const DescWrap = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  line-height: 15px;
  text-align: justify;
`;

interface CoinInfoInterface {
  coinSymbol: string;
  visible: boolean;
}

const CoinInfo = ({ coinSymbol, visible }: CoinInfoInterface) => {
  const status = useSelector(selectCoinInfoStatus);
  const currentCoin = useSelector(selectCurrentCoin);
  const coinInfo = useSelector(selectCoinInfo);
  const dispatch = useAppDispatch();
  const coinSymbolLowerCase = String(coinSymbol).toLowerCase();
  const coinSymbolUpperCase = String(coinSymbol).toUpperCase();
  const { t } = useTranslation();
  const userHabit = useAppSelector((state) => state.app?.userHabit);

  useEffect(() => {
    if (userHabit.locale === "") return;

    // if (status === STATUS_IDLE || currentCoin !== coinSymbolLowerCase) {
    dispatch(getCoinInfo({ symbol: coinSymbolLowerCase, lang: userHabit.locale }));
    // }
  }, [coinSymbolLowerCase, userHabit.locale]);

  useEffect(() => {
    if (coinSymbolLowerCase !== currentCoin) {
      dispatch(setCurrentCoin({ symbol: coinSymbolLowerCase }));
    }
  }, [coinSymbolLowerCase, currentCoin]);

  if (!coinInfo) {
    return <></>;
  }

  const infoList = [
    {
      label: t("marketCap"),
      value: `$${coinInfo.marketCap || "--"}`
    },
    {
      label: t("circulatingSupply"),
      value: coinInfo.circulatingSupply || "--"
    },
    {
      label: t("maxSupply"),
      value: coinInfo.maxSupply || "--"
    },
    {
      label: t("totalSupply"),
      value: coinInfo.totalSupply || "--"
    },
    {
      label: t("issueDate"),
      value: dateFormatYMD(coinInfo.issueDate) || "--"
    },
    {
      label: t("issuePrice"),
      value: `$${coinInfo.issuePrice || "--"}`
    }
  ];

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <Container onClick={stopPropagation} visible={visible}>
        <Title>{coinSymbolUpperCase}</Title>
        {infoList.map((item) => {
          return (
            <ListItem key={item.label}>
              <Label>{item.label}</Label>
              <Value>{item.value}</Value>
            </ListItem>
          );
        })}
        <SubTitle>{t("moreInfo")}</SubTitle>
        <DescWrap>{coinInfo?.desc}</DescWrap>
      </Container>
    </>
  );
};

export default CoinInfo;
