import React from "react";
import styled from "styled-components";
import { Flex, Tooltip } from "@ccfoxweb/uikit";
import { ReactComponent as SimplexLogo } from "/public/images/SVG/otc/simplex_logo.svg";
import { ReactComponent as Visa } from "/public/images/SVG/otc/visa.svg";
import { ReactComponent as Master } from "/public/images/SVG/otc/master.svg";
import { ReactComponent as RightArrow } from "/public/images/SVG/otc/right_arrow.svg";
import { ReactComponent as Info } from "/public/images/SVG/otc/info.svg";
import { toFix6 } from "../../utils/filters";
import { useAppSelector } from "../../store/hook";

import { useTranslation } from "next-i18next";

import { ossFiatCoin } from "../../utils/oss";

const Container = styled(Flex)`
  width: 100%;
  height: 64px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px 12px;
  justify-content: space-between;
  cursor: pointer;
`;

const LWrap = styled(Flex)`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
`;

const LWrapL = styled.img`
  width: 32px;
  height: 32px;
  display: block;
  margin-right: 8px;
`;

const LWrapR = styled(Flex)`
  flex: 1;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  .title {
    color: rgba(19, 15, 29, 1);
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
  }
  .ratio {
    color: rgba(170, 164, 187, 1);
    font-size: 12px;
    line-height: 20px;
    display: flex;
    flex-direction: row;
    aligin-items: center;
  }
`;

const RWwap = styled(Flex)`
  height: 100%;
  align-items: flex-start;
  flex: 1;
`;

const RWrapInner = styled(Flex)`
  justify-content: flex-end;
  align-items: center;
  height: 24px;
`;

const InfoI = styled.div`
  width: 20px;
  height: 20px;
  margin-left: 5px;
  background: url("/images/SVG/otc/OTC_info_g.png");
  background-size: 20px 20px;
  &:hover {
    background: url("/images/SVG/otc/OTC_info.png");
    background-size: 20px 20px;
  }
`;

interface OtcCardTopProps {
  serviceProviderItem: any;
  currencyIdItem: any;
  faitCurrencyIdItem: any;
  ratiolist: any;
  showArrow?: boolean;
}

const OtcCardTop = ({
  serviceProviderItem,
  currencyIdItem,
  faitCurrencyIdItem,
  ratiolist,
  showArrow
}: OtcCardTopProps) => {
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const { t } = useTranslation();

  return (
    <Container>
      <LWrap>
        <LWrapL src={ossFiatCoin(serviceProviderItem?.serviceProviderTag)} />
        <LWrapR>
          <span className={"title"}>
            {serviceProviderItem?.extMsg
              ? JSON.parse(serviceProviderItem?.extMsg || "{}")?.serviceProviderName[
                  userHabit?.locale || "en_US"
                ]
              : serviceProviderItem?.serviceProviderName || "--"}
          </span>
          <span className={"ratio"}>
            1{currencyIdItem?.symbol || "--"} ≈
            {Number(
              toFix6(
                ratiolist?.find(
                  (el) => el.serviceProviderTag === serviceProviderItem?.serviceProviderTag
                )?.ratio
              )
            ) || "--"}
            {faitCurrencyIdItem?.symbol || "--"}
            <Tooltip
              placement={"top"}
              text={t("PriceTips")}
              hideTargetDecoration
              color={"#fff"}
              bg={"rgba(34, 10, 96, 0.9)"}
              tipWidth={220}
            >
              <InfoI />
            </Tooltip>
          </span>
        </LWrapR>
      </LWrap>
      <RWwap>
        <RWrapInner>
          {serviceProviderItem?.serviceProviderTag === "Simplex_credit_card" && <Visa />}
          {serviceProviderItem?.serviceProviderTag === "Simplex_credit_card" && (
            <Master style={{ marginLeft: "4px" }} />
          )}

          {showArrow && <RightArrow style={{ marginLeft: "4px" }} />}
        </RWrapInner>
      </RWwap>
    </Container>
  );
};

export default OtcCardTop;
