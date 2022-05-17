import React from "react";
import styled from "styled-components";
import { Flex, Button, Tooltip } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../store/hook";
import dayjs from "dayjs";

const ContractInfoW = styled.div`
  position: absolute;
  left: 0;
  top: 0px;
  // top: 60px;
`;
// const ContractInfo = styled.div`
//   width: 240px;
//   height: 326px;
//   background: #1F1830;
//   box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
//   border-radius: 8px;
//   padding: 16px;
//   z-index: 1005;
//   position: absolute;
//   left: 0;
//   // top: 0px;
//   top: 45px;
// `

const ContractInfo = styled.div<{ show? }>`
  width: ${({ show }) => (show ? "240px" : 0)};
  height: ${({ show }) => (show ? "326px" : 0)};
  background: #1f1830;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  padding: ${({ show }) => (show ? "16px" : 0)};
  z-index: 1005;
  position: absolute;
  left: 0;
  // top: 0px;
  top: 45px;
  overflow: hidden;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: all 0.3s ease-in-out;
`;

const Symbol = styled.div`
  font-size: 18px;
  font-family: DINPro-Bold, DINPro;
  font-weight: bold;
  color: #ffffff;
  line-height: 24px;
`;

const ContractType = styled.span`
  height: 17px;
  background: #130f1d;
  border-radius: 2px;
  font-size: 12px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #615976;
  line-height: 17px;
  padding: 0 6px;
  display: inline-block;
  margin-bottom: 8px;
  margin-top: 4px;
`;

const InfoLine = styled(Flex)`
  margin-top: 8px;
  justify-content: space-between;
  span.l {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
  span.v {
    font-size: 12px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: #ffffff;
    line-height: 15px;
  }
`;

const CoinDesk = styled.a`
  text-decoration: none !important;
`;

const contractInfo = (props) => {
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const { t } = useTranslation();
  const endTime = () => {
    let _contractItem = contractItem;
    let _endTime = "";
    if (contractItem?.contractId) {
      // 到期日
      if (_contractItem.contractType === 1) {
        _endTime = dayjs(_contractItem.deliveryTime / 1000).format(
          "YYYY/MM/DD HH:mm:ss"
        );
      } else {
        _endTime = t("Perseverance");
      }
    }

    return _endTime || "--";
  };
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const zendeskLocale = {
    ["zh_CN"]: "zh-cn",
    ["zh_TW"]: "zh-hk",
    ["en_US"]: "en-us",
    ["ko_KR"]: "ko-kr",
  };

  const coinArticle = {
    ["BTC"]: "4414630010009",
    ["ETH"]: "4414635019545",
    ["LTC"]: "4414641803161",
    ["EOS"]: "4414627766041",
    ["BCH"]: "4414635851673",
    ["UNI"]: "4414636583577",
    ["DOT"]: "4414648775577",
    ["FIL"]: "4414637742105",
    ["SUSHI"]: "4414656265241",
    ["LINK"]: "4414630671129",
    ["DOGE"]: "4414638218649",
    ["AXS"]: "4414650014617",
    ["ICP"]: "4414638245913",
    ["ADA"]: "4414655987737",
    ["FTM"]: "4414638120473",
  };

  const coinIntro = () => {
    const symbol =
      contractItem?.contractSide === 1
        ? contractItem?.commodityName
        : contractItem?.currencyName;
    return `https://ccfox.zendesk.com/hc/${
      zendeskLocale[userHabit?.locale || "en_US"]
    }/articles/${coinArticle[symbol]}-${symbol}`;
  };

 

  return (
    <>
      <ContractInfo onClick={stopPropagation} show={props.showContractInfo}>
        <Symbol>{contractItem?.symbol}</Symbol>
        <ContractType>
          {contractItem?.contractSide === 1 ? t("UBased") : t("CurrencyBased")}
        </ContractType>
        <InfoLine>
          <Tooltip text={t("marginSource1", { symbol: contractItem?.symbol })}>
            <span className="l">{t("IndexSource")}</span>
          </Tooltip>
          <span className="v">{t("ChainextIndex")}</span>
        </InfoLine>
        <InfoLine>
          <Tooltip text={t("marginDate")}>
            <span className="l">{t("EndDate")}</span>
          </Tooltip>
          <span className="v">{endTime()}</span>
        </InfoLine>
        <InfoLine>
          <span className="l">{t("DenominationCurrency")}</span>
          <span className="v">{contractItem?.currencyName}</span>
        </InfoLine>
        <InfoLine>
          <Tooltip text={t("marginBao")}>
            <span className="l">{t("QuotationCurrency")}</span>
          </Tooltip>
          <span className="v">
            {contractItem?.contractSide === 1
              ? contractItem.currencyName
              : contractItem?.commodityName}
          </span>
        </InfoLine>
        <InfoLine>
          <Tooltip text={t("marginUnit")}>
            <span className="l">{t("ContractUnit")}</span>
          </Tooltip>
          <span className="v">
            {contractItem?.contractUnit}
            {contractItem?.commodityName}/{t("Cont")}
          </span>
        </InfoLine>
        <InfoLine>
          <Tooltip text={t("marginPriceTick")}>
            <span className="l">{t("PriceTick")}</span>
          </Tooltip>
          <span className="v">{contractItem?.priceTick}</span>
        </InfoLine>
        <InfoLine>
          <Tooltip text={t("marginLotsize")}>
            <span className="l">{t("LotSize")}</span>
          </Tooltip>
          <span className="v">{contractItem?.lotSize}</span>
        </InfoLine>
        <CoinDesk href={coinIntro()} target="_blank">
          <Button
            variant={"secondary"}
            scale={"md"}
            isDark={true}
            width="100%"
            mt="16px"
          >
            {t("moreInfo")}
          </Button>
        </CoinDesk>
      </ContractInfo>
    </>
  );
};

export default contractInfo;
