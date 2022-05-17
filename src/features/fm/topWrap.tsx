import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { Box, Flex, Text, Tooltip } from "@ccfoxweb/uikit";
import { ReactComponent as EyeOpen } from "/public/images/SVG/fm/eye_open_icon.svg";
import { ReactComponent as EyeClose } from "/public/images/SVG/fm/eye_close_icon.svg";
import { ReactComponent as Tips } from "/public/images/SVG/fm/tips_icon.svg";
import { useAppSelector } from "../../store/hook";
import { statistics } from "../../services/api/fm";
import { toFix6 } from "../../utils/filters";
import { Big } from "big.js";
import useSocketIO from "../../hooks/useSocketIO";
import { hostReplace } from "../../utils/utils";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";

const TopWrapContainer = styled.div`
  background: #1A1A1A;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const TL = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  h1,
  h2 {
    font-size: 38px;
    font-weight: 600;
    color: #130f1d;
    line-height: 47px;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 48px;
      line-height: 67px;
    }
  }
  h1 {
    margin-top: 10px;
    ${({ theme }) => theme.mediaQueries.md} {
      margin-top: 20px;
    }
  }
  p {
    font-size: 12px;
    font-weight: 500;
    color: #aaa4bb;
    line-height: 32px;
    &:nth-of-type(1) {
      margin-top: 24px;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 16px;
    }
  }
`;

const AssetsPanel = styled.div`
  margin-top: 50px;
  width: 360px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%);
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1), inset 2px 2px 4px 0px rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  position: relative;
  .user-panel-png {
    width: 130px;
    height: 132px;
    position: absolute;
    top: -20px;
    right: -20px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
    width: 408px;
  }
`;

const AssetsPanelInnerWrap = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px 32px 32px 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Button = styled(Flex)`
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.11);
  border-radius: 5px;
  // backdrop-filter: blur(4px);
  justify-content: center;
  margin-top: 28px;
  cursor: pointer;
  span {
    font-size: 18px;
    font-weight: 600;
    color: #220a60;
    line-height: 25px;
  }
`;

const TipsIcon = styled(Tips)`
  cursor: pointer;
  &:hover {
    path {
      fill: rgba(97, 83, 135, 1);
    }
  }
`;

const PlaceholderImg = styled.img<{ isLogin?: boolean }>`
  position: absolute;
  top: 230px;
  left: 0;
  width: 438px;
  height: 396px;
  display: ${({ isLogin }) => (isLogin ? "visible" : "none")};
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
    top: -105px;
    left: 751px;
    display: block;
  }
`;

const TopWrap = (props) => {
  const [totalProfit, setTotalProfit] = useState("0"); // 理财累计收益折合(USDT)
  const [totalFiatProfit, setTotalFiatProfit] = useState("0");
  const [totalCurrencyAccounts, setTotalCurrencyAccounts] = useState("0"); // 理财总资产(USDT)
  const [totalCurrencyAccountsList, setTotalCurrencyAccountsList] = useState([]); // 理财总资产列表
  const [totalFiatCurrencyAccounts, setTotalFiatCurrencyAccounts] = useState("0");
  const [assetsHidden, setAssetsHidden] = useState(false);

  const { t } = useTranslation();
  const { push } = useRouter();
  const { initSocket, disconnect } = useSocketIO("future");
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const coinList = useAppSelector((state) => state.contract.coinList);
  const exchangeList = useAppSelector((state) => state.contract.exchangeList);

  const hiddenText = "******";

  const _statistics = () => {
    if (!isLogin) return;
    statistics().then((res) => {
      let data = res?.data;

      if (data?.code === 0) {
        setTotalProfit(data?.data?.totalProfit);

        setTotalCurrencyAccountsList(data?.data?.totalCurrencyAccounts || []);
      }
    });
  };

  const toggleHideAssets = () => {
    setAssetsHidden(!assetsHidden);
  };

  const openMyAssets = () => {
    console.log("openMyAssets", isMobile);
    if (isMobile) {
      push("/download");
    } else {
      window.location.href = `https://${hostReplace()}/user/fm/fmOrder`;
    }
  };

  useEffect(() => {
    if (userHabit.currency === "") return;

    let rate =
      exchangeList?.find((el: { name: string; rate: number }) => el.name === userHabit.currency)
        ?.rate || 0;
    let latest =
      coinList?.find((el: { currencyId: number; latest: string | number }) => el.currencyId === 7)
        ?.latest || 0;

    setTotalFiatProfit(new Big(totalProfit || 0).times(rate).times(latest).toString());

    let _totalCurrencyAccounts = new Big(0);
    totalCurrencyAccountsList?.forEach((item) => {
      let _latest =
        coinList?.find(
          (el: { currencyId: number; latest: string | number }) => el.currencyId === item.currencyId
        )?.latest || 0;
      _totalCurrencyAccounts = new Big(_totalCurrencyAccounts).plus(
        new Big(item.amount || 0).times(_latest)
      );
    });

    setTotalCurrencyAccounts(_totalCurrencyAccounts?.toString() || "0");
    setTotalFiatCurrencyAccounts(
      new Big(_totalCurrencyAccounts || 0).times(rate).times(latest).toString()
    );
  }, [coinList, exchangeList, userHabit]);

  useEffect(() => {
    _statistics();
  }, [isLogin, props.reloadR]);

  useEffect(() => {
    initSocket();
    return () => {
      disconnect();
    };
  }, []);

  return (
    <TopWrapContainer>
      <PlaceholderImg src="/images/fm/regular_top.png" isLogin={isLogin} />

      <TL>
        <h1>{t("FmTitle")}</h1>
        <h2>{t("topWrap1")}</h2>
        <p>· {t("topWrap2")}</p>
        <p>· {t("topWrap3")}</p>
        <p>· {t("topWrap4")}</p>
      </TL>
      {isLogin && (
        <AssetsPanel>
          <img
            className="user-panel-png"
            src="/images/fm/user-panel-png.png"
            alt="user-panel-png"
          />
          <AssetsPanelInnerWrap>
            {/* 理财概览 */}
            <Flex>
              <Text color={"#0B0814"} fontSize={"18px"} bold mr={"8px"}>
                {t("topWrap5")}
              </Text>

              {assetsHidden ? (
                <EyeClose cursor="pointer" onClick={toggleHideAssets} />
              ) : (
                <EyeOpen cursor="pointer" onClick={toggleHideAssets} />
              )}
            </Flex>

            {/* 理财总资产(USDT) */}
            <Flex mt={"24px"}>
              <Text color={"#807898"} fontSize={"14px"} mr={"8px"}>
                {t("topWrap6")}(USDT)
              </Text>

              <Tooltip
                text={t("topWrap7")}
                placement={"top"}
                hideTargetDecoration
                tipWidth={200}
                color={"#fff"}
                bg={"rgba(34, 10, 96, 0.9)"}
              >
                <TipsIcon />
              </Tooltip>
            </Flex>

            <Flex alignItems={"flex-end"}>
              <Text color={"#130F1D"} fontSize={"28px"} bold mr={"8px"}>
                {assetsHidden ? hiddenText : toFix6(totalCurrencyAccounts, 2)}
              </Text>
              <Text color={"#AAA4BB"} fontSize={"12px"} mb={"5px"}>
                ≈ {assetsHidden ? hiddenText : toFix6(totalFiatCurrencyAccounts, 2)}{" "}
                {userHabit?.currency}
              </Text>
            </Flex>

            <Box
              width={"100%"}
              height={"1px"}
              background={"#fff"}
              opacity={0.6}
              mt={"16px"}
              mb={"16px"}
            />

            {/* 理财累计收益折合(USDT) */}
            <Flex alignItems={"flex-end"}>
              <Text color={"#807898"} fontSize={"14px"} mr={"8px"}>
                {t("topWrap8")}(USDT)
              </Text>
              <Tooltip
                text={t("topWrap9")}
                placement={"top"}
                hideTargetDecoration
                tipWidth={200}
                color={"#fff"}
                bg={"rgba(34, 10, 96, 0.9)"}
              >
                <TipsIcon />
              </Tooltip>
            </Flex>

            <Flex alignItems={"flex-end"}>
              <Text color={"#130F1D"} fontSize={"28px"} bold mr={"8px"}>
                {assetsHidden ? hiddenText : toFix6(totalProfit, 6)}
              </Text>
              <Text color={"#AAA4BB"} fontSize={"12px"} mb={"5px"}>
                ≈ {assetsHidden ? hiddenText : toFix6(totalFiatProfit, 2)} {userHabit?.currency}
              </Text>
            </Flex>

            {/* 我的理财 */}
            <Button className={"regular-button"} onClick={openMyAssets}>
              <span>{t("topWrap10")}</span>
            </Button>
          </AssetsPanelInnerWrap>
        </AssetsPanel>
      )}
    </TopWrapContainer>
  );
};

export default TopWrap;
