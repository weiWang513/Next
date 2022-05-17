import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAppSelector } from "../store/hook";
import { useTranslation } from "next-i18next";
import useInterval from "../hooks/useInterval";
import { Big } from "big.js";
import { dateFormat2, formatBigNumber } from "../utils/filters";
import { ReactComponent as Twitter } from "/public/images/fmToB/Twitter.svg";
import { ReactComponent as Telegram } from "/public/images/fmToB/tel.svg";
import ChangeSize from "../hooks/useClientSize";

const Footer = styled.footer`
  background: #130f1d;
`;
const FooterBg = styled.footer`
  background: #0b0814;
`;
const FooterCenter = styled.div`
  width: 100%;
  padding: 24px 0;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 1200px;
    margin: 0 auto;
  }
`;
const FooterTop = styled.div`
  padding-top: 80px;
  display: flex;
  justify-content: space-between;
`;
const TopLeft = styled.aside`
  display: flex;
  & > ul {
    display: flex;
    flex-direction: column;
    div {
      padding-bottom: 16px;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      line-height: 24px;
    }
    a {
      font-size: 14px;
      font-weight: 500;
      color: #665f7a;
      line-height: 32px;
      &:hover {
        color: #6f5aff;
      }
    }
    span {
      font-size: 14px;
      font-weight: 500;
      color: #665f7a;
      line-height: 24px;
    }
    & + ul {
      margin-left: 100px;
    }
  }
`;
const TopRight = styled.aside`
  display: flex;
  flex-direction: column;
  & > div {
    padding-bottom: 16px;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    line-height: 24px;
  }
  & > a {
    box-sizing: border-box;
    width: 180px;
    height: 48px;
    padding: 0 24px;
    margin-bottom: 16px;
    background: #1f1830;
    border-radius: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      background: #6f5aff;
      box-shadow: 0px 8px 16px 0px rgba(111, 90, 255, 0.3);
    }
    span {
      margin-left: 4px;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      font-family: DINPro-Bold;
    }
  }
`;

const LinkWarp = styled.div`
  display: flex;
  align-items: center;
  a{
    margin-right: 12px;
  }
`
const PartnerWarp = styled.div`
  padding-top: 100px;
  padding-bottom: 24px;
  & > div {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    line-height: 24px;
  }
  & > ul {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      align-items: center;
      & + li:before {
        content: "|";
        display: block;
        margin: 0 12px;
        font-size: 14px;
        font-weight: 500;
        color: #665f7a;
      }
      a {
        font-size: 14px;
        font-weight: 500;
        color: #665f7a;
        line-height: 32px;
        &:hover {
          color: #6f5aff;
        }
      }
    }
  }
`;
const FooterBottom = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    // height: 64px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;
const BottomLeft = styled.aside`
  font-size: 14px;
  font-weight: 500;
  color: #665f7a;
  margin-top: 15px;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
    width: 100%;
  }
`;
const BottomRight = styled.aside`
  font-size: 14px;
  font-weight: 500;
  color: #665f7a;
  & > span {
    color: #fff;
  }
`;
const FooterAdap = styled.div`
  width: 100%;
  background: #130f1d;
  padding: 16px;
  & > ul {
    & > li {
      width: 100%;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      line-height: 22px;
      & > span {
        font-size: 36px;
        img {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  // .drop-menu {
  //   transition: transform 0.15s, opacity 0.15s;
  //   transform: ${({op}) => `scaleY(${op})`};
  //   transform-origin: right;
  //   opacity: ${({op}) => op || 0};
  //   & > li {
  //     font-size: 14px;
  //     color: #665f7a;
  //     line-height: 32px;
  //     font-weight: 400;
  //     a{
  //       display: block;
  //     }
  //   }
  // }
`;

const Ul = styled.ul<{op?;h?;}>`
  transition: transform 0.15s, opacity 0.15s, height 0.15s;
  transform: ${({op}) => `scaleY(${op})`};
  transform-origin: top;
  opacity: ${({op}) => op || 0};
  height: ${({op, h}) => op ? h : 0};
  & > li {
    font-size: 14px;
    color: #665f7a;
    line-height: 32px;
    font-weight: 400;
    a{
      display: block;
    }
  }
`

interface CoinItem {
  latest: number;
  currencyId: number;
}

const HomeFooter = () => {
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const realTime = useAppSelector((state) => state.app.realTime);
  const tradingVolume = useAppSelector((state) => state?.home?.tradingVolume);
  // const coinList: CoinItem[] = useAppSelector((state) => state?.contract?.coinList);

  const [aboutUrl, setAboutUrl] = useState("");
  const [contactUrl, setContactUrl] = useState("");
  const [newsUrl, setNewsUrl] = useState("");
  const [contractUrl, setContractUrl] = useState("");
  const [faqsUrl, setFaqsUrl] = useState("");
  const [helpUrl, setHelpUrl] = useState("");
  const [submitUrl, setSubmitUrl] = useState("");
  const [termUrl, setTermUrl] = useState("");
  const [feeUrl, setFeeUrl] = useState("");
  const [privacyUrl, setPrivacyUrl] = useState("");
  const [pageTime, setPageTime] = useState(null);
  const [tradingVolume24hList, setTradingVolume24hList] = useState([]);

  const { t } = useTranslation();

  const partnerList = [
    // 链闻
    {
      name: "链闻 CHAINNEWS",
      url: ""
    },
    // TokenInsight
    {
      name: "TokenInsight",
      url: "https://www.tokeninsight.com"
    },
    // 趣跟单
    {
      name: "趣跟单",
      url: ""
    },
    // 币世界
    {
      name: "币世界",
      url: ""
    },
    // 火车头
    {
      name: "火车头资本",
      url: ""
    },
    // coinvoice
    {
      name: "COINVOICE",
      url: "http://www.coinvoice.cn/"
    },
    // 羊驼区块链
    {
      name: "羊驼区块链",
      url: ""
    },
    // AICoin
    {
      name: "AICoin",
      url: ""
    },
    // 好的连
    {
      name: "好的链 MyToken",
      url: "https://www.mytokencap.com/"
    },
    // cobo
    {
      name: "cobo",
      url: "https://cobo.com/"
    },
    // VNBA
    {
      name: "VNBA",
      url: ""
    },
    // 币本
    {
      name: "币本直播",
      url: ""
    },
    // 哈希时代
    {
      name: "哈希时代",
      url: ""
      // url: "https://www.hashage.cn/",
    },
    // 果味财经
    {
      name: "果味财经",
      url: ""
    },
    // chainexit
    {
      name: "CHAINEXT",
      url: ""
    },
    // AKG
    {
      name: "AKG",
      url: ""
    },
    // 币乎
    {
      name: "币乎",
      url: "https://bihu.com/"
    },
    // veryhash
    {
      name: "VERYHASH",
      url: "https://www.veryhash.com/"
    },
    // 比特币交易网
    {
      name: "比特币交易网",
      url: ""
    },
    // 星球日报
    {
      name: "星球日报",
      url: ""
    }
  ];

  const getTime = () => {
    setPageTime(pageTime + 1000);
  };

  const getAmount = (currencyId) => {
    // 这里原本的意愿应该是展示USDT合约成交额，ETH币本位合约成交额，BTC币本位合约成交额

    let tradeObj = new Big(0);
    if (currencyId === 1) {
      // eth
      tradingVolume24hList.forEach((item) => {
        if (item.currencyId === 1) {
          tradeObj = tradeObj.plus(item?.currencyTurnover || 0);
        }
      });
    } else if (currencyId === 2) {
      // btc
      tradingVolume24hList.forEach((item) => {
        if (item.currencyId === 2) {
          tradeObj = tradeObj.plus(item?.currencyTurnover || 0);
        }
      });
    } else if (currencyId === 7) {
      // usdt
      tradingVolume24hList.forEach((item) => {
        if (item.currencyId === 7) {
          tradeObj = tradeObj.plus(item?.usdtTurnover || 0);
        }
      });
    }

    // return toFix6(tradeObj?.toString(), currencyId === 7 ? 2 : 6) || "";
    return formatBigNumber(tradeObj?.toString()) || "";
  };

  useInterval(getTime, 1000);

  useEffect(() => {
    if (
      !tradingVolume.contractTradingVolume24h ||
      tradingVolume.contractTradingVolume24h.length === 0
    ) {
      return;
    }

    setTradingVolume24hList(tradingVolume?.contractTradingVolume24h);
  }, [tradingVolume]);
  // useEffect(() => {
  //   if (
  //     !tradingVolume.tradingVolume24h ||
  //     tradingVolume.tradingVolume24h.length === 0 ||
  //     coinList.length === 0
  //   ) {
  //     return;
  //   }
  //   let tempList = [];
  //   tradingVolume?.tradingVolume24h.map((el: { currencyId; volume }) => {
  //     let mapObj = { ...el };
  //     let latest = coinList?.find(
  //       (item: { currencyId }) => item.currencyId === el.currencyId
  //     )?.latest;
  //     mapObj.volume = new Big(el.volume || 0).div(latest).toString();
  //     tempList.push(mapObj);
  //   });
  //   setTradingVolume24hList(tempList);
  // }, [tradingVolume, coinList]);

  useEffect(() => {
    if (userHabit.locale === "zh_CN") {
      setAboutUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/articles/360029055511-%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC"
      );
      setContactUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/articles/360029055791-%E8%81%94%E7%B3%BB%E6%88%91%E4%BB%AC"
      );
      setNewsUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/categories/360001823632-CCFOX-%E8%B5%84%E8%AE%AF"
      );
      setContractUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/sections/360004481491-%E5%90%88%E7%BA%A6%E6%8C%87%E5%8D%97"
      );
      setFaqsUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/categories/360001631712-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98"
      );
      setHelpUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/sections/360004480191-%E6%96%B0%E6%89%8B%E6%8C%87%E5%8D%97"
      );
      setSubmitUrl("https://ccfox.zendesk.com/hc/zh-cn/requests/new");
      setTermUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/articles/360029055231-%E6%9C%8D%E5%8A%A1%E6%9D%A1%E6%AC%BE"
      );
      setFeeUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/articles/360028064072-%E8%B4%B9%E7%8E%87%E6%A0%87%E5%87%86"
      );
      setPrivacyUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/articles/360029055831-%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4"
      );
    } else if (userHabit.locale === "zh_TW") {
      setAboutUrl(
        "https://ccfox.zendesk.com/hc/zh-hk/articles/360029055511-%E9%97%9C%E6%96%BC%E6%88%91%E5%80%91"
      );
      setContactUrl(
        "https://ccfox.zendesk.com/hc/zh-cn/articles/360029055791-%E8%81%94%E7%B3%BB%E6%88%91%E4%BB%AC"
      );
      setNewsUrl(
        "https://ccfox.zendesk.com/hc/zh-hk/categories/360001823632-CCFOX-%E8%B3%87%E8%A8%8A"
      );
      setContractUrl(
        "https://ccfox.zendesk.com/hc/zh-hk/sections/360004481491-%E5%90%88%E7%B4%84%E6%8C%87%E5%8D%97"
      );
      setFaqsUrl(
        "https://ccfox.zendesk.com/hc/zh-hk/categories/360001631712-%E5%B8%B8%E8%A6%8B%E5%95%8F%E9%A1%8C"
      );
      setHelpUrl(
        "https://ccfox.zendesk.com/hc/zh-hk/sections/360004480191-%E6%96%B0%E6%89%8B%E6%8C%87%E5%8D%97"
      );
      setSubmitUrl("https://ccfox.zendesk.com/hc/zh-hk/requests/new");
      setTermUrl(
        "https://ccfox.zendesk.com/hc/zh-hk/articles/360029055231-%E6%9C%8D%E5%8B%99%E6%A2%9D%E6%AC%BE"
      );
      setFeeUrl(
        "https://ccfox.zendesk.com/hc/zh-hk/articles/360028064072-%E8%B2%BB%E7%8E%87%E6%A8%99%E6%BA%96"
      );
      setPrivacyUrl(
        "https://ccfox.zendesk.com/hc/zh-hk/articles/360029055831-%E9%9A%B1%E7%A7%81%E4%BF%9D%E8%AD%B7"
      );
    } else {
      setAboutUrl("https://ccfox.zendesk.com/hc/en-us/articles/360029055511-About-Us");
      setContactUrl("https://ccfox.zendesk.com/hc/en-us/articles/360029055791-Contact-Us");
      setNewsUrl("https://ccfox.zendesk.com/hc/en-us/categories/360001823632-CCFOX-Blog");
      setContractUrl("https://ccfox.zendesk.com/hc/en-us/sections/360004481491-Futures-Guide");
      setFaqsUrl("https://ccfox.zendesk.com/hc/en-us/categories/360001631712-FAQ");
      setHelpUrl("https://ccfox.zendesk.com/hc/en-us/sections/360004480191-Beginner-s-Guide");
      setSubmitUrl("https://ccfox.zendesk.com/hc/en-us/requests/new");
      setTermUrl("https://ccfox.zendesk.com/hc/en-us/articles/360029055231-Terms-of-Services");
      setFeeUrl("https://ccfox.zendesk.com/hc/en-us/articles/360028064072-Fees");
      setPrivacyUrl("https://ccfox.zendesk.com/hc/en-us/articles/360029055831-Privacy-Policy");
    }
  }, [userHabit.locale]);

  useEffect(() => {
    realTime && setPageTime(realTime);
  }, [realTime]);
  let size = ChangeSize();

  const [showElem1, setShowElem1] = useState<boolean>(false);
  const [showElem2, setShowElem2] = useState<boolean>(false);
  const [showElem3, setShowElem3] = useState<boolean>(false);
  const [showElem4, setShowElem4] = useState<boolean>(false);
  return (
    <>
      {size.width > 767 ? (
        <Footer>
          <FooterCenter>
            <FooterTop>
              <TopLeft>
                <ul>
                  <li>
                    <div>{t("About")}</div>
                  </li>
                  <li>
                    <a href={aboutUrl} target="_blank">
                      {t("AboutUs")}
                    </a>
                  </li>
                  <li>
                    <a href={contactUrl} target="_blank">
                      {t("ContactUs")}
                    </a>
                  </li>
                  {/* <li>
                    <a href={newsUrl} target="_blank">
                      {t("CcfoxNews")}
                    </a>
                  </li> */}
                </ul>
                {/* <ul>
                  <li>
                    <div>{t("Help")}</div>
                  </li>
                  <li>
                    <a href={contractUrl} target="_blank">
                      {t("ContractGuide")}
                    </a>
                  </li>
                  <li>
                    <a href={faqsUrl} target="_blank">
                      {t("FAQ")}
                    </a>
                  </li>
                  <li>
                    <a href={helpUrl} target="_blank">
                      {t("HelpAssiant")}
                    </a>
                  </li>
                  <li>
                    <a href={submitUrl} target="_blank">
                      {t("HelpOrder")}
                    </a>
                  </li>
                </ul>
                <ul>
                  <li>
                    <div>{t("Support")}</div>
                  </li>
                  <li>
                    <a href={termUrl} target="_blank">
                      {t("Terms")}
                    </a>
                  </li>
                  <li>
                    <a href={feeUrl} target="_blank">
                      {t("Fees")}
                    </a>
                  </li>
                  <li>
                    <a href={privacyUrl} target="_blank">
                      {t("Privacy")}
                    </a>
                  </li>
                  <li>
                    <a href="https://ccfox-api.github.io/spot/v1/en/index.html" target="_blank">
                      API
                    </a>
                  </li>
                </ul> */}
                <ul>
                  <li>
                    <div>{t("Contact")}</div>
                  </li>
                  <li>
                    <a>{t("FAQ")}</a>
                  </li>
                  <li>
                    <a>
                      {t("fmToB1")}
                    </a>
                  </li>
                </ul>
                <ul>
                  <li>
                    <div>{t("Contact")}</div>
                  </li>
                  <li>
                    <a href="mailto:support@ccfox.com">{t("ServiceSupport")}: support@ccfox.com</a>
                  </li>
                  <li>
                    <a
                      href={
                        userHabit.locale === "ko_KR"
                          ? "mailto:BDkr@ccfox.com"
                          : "mailto:business@ccfox.com"
                      }
                    >
                      {t("BusinessCooperation")}:{" "}
                      {userHabit.locale === "ko_KR" ? "BDkr@ccfox.com" : "business@ccfox.com"}
                    </a>
                  </li>
                  {/* <li>
                    <a href="mailto:vip@ccfox.com">{t("BeVIP")}: vip@ccfox.com</a>
                  </li> */}
                </ul>
              </TopLeft>
              <TopRight>
                <div>{t("JoinCommunity")}</div>
                <LinkWarp>
                  <a href="https://twitter.com/CCFOX2020" target="_blank">
                    <Twitter />
                  </a>
                  <a href="https://t.me/ccfox_English" target="_blank">
                    <Telegram />
                  </a>
                </LinkWarp>
              </TopRight>
            </FooterTop>
            {/* <PartnerWarp>
              <div>{t("HomePartner")}: </div>
              <ul>
                {partnerList.map((item, index) => (
                  <li key={index}>
                    {item.url ? (
                      <a href={item.url} target="_blank">
                        {item.name}
                      </a>
                    ) : (
                      <a>{item.name}</a>
                    )}
                  </li>
                ))}
              </ul>
            </PartnerWarp> */}
          </FooterCenter>
        </Footer>
      ) : (
        <FooterAdap>
          <ul>
            <li>
              <div>{t("About")}</div>
              <span onClick={() => setShowElem1(!showElem1)}>{showElem1 ? "-" : "+"}</span>
            </li>
            <Ul op={showElem1? 1 : 0} h='96px'>
              <li>
                <a href={aboutUrl} target="_blank">
                  {t("AboutUs")}
                </a>
              </li>
              <li>
                <a href={contactUrl} target="_blank">
                  {t("ContactUs")}
                </a>
              </li>
              {/* <li>
                <a href={newsUrl} target="_blank">
                  {t("CcfoxNews")}
                </a>
              </li> */}
            </Ul>
            <li>
              <div>{t("Help")}</div>
              <span onClick={() => setShowElem2(!showElem2)}>{showElem2 ? "-" : "+"}</span>
            </li>
            <Ul op={showElem2? 1 : 0} h='128px'>
              <li>
                <a href={contractUrl} target="_blank">
                  {t("ContractGuide")}
                </a>
              </li>
              <li>
                <a href={faqsUrl} target="_blank">
                  {t("FAQ")}
                </a>
              </li>
              <li>
                <a href={helpUrl} target="_blank">
                  {t("HelpAssiant")}
                </a>
              </li>
              <li>
                <a href={submitUrl} target="_blank">
                  {t("HelpOrder")}
                </a>
              </li>
            </Ul>
            <li>
              <div>{t("Support")}</div>
              <span onClick={() => setShowElem3(!showElem3)}>{showElem3 ? "-" : "+"}</span>
            </li>
            <Ul op={showElem3? 1 : 0} h='128px'>
              <li>
                <a href={termUrl} target="_blank">
                  {t("Terms")}
                </a>
              </li>
              <li>
                <a href={feeUrl} target="_blank">
                  {t("Fees")}
                </a>
              </li>
              <li>
                <a href={privacyUrl} target="_blank">
                  {t("Privacy")}
                </a>
              </li>
              <li>
                <a
                  href="https://ccfox-api.github.io/spot/v1/en/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API
                </a>
              </li>
            </Ul>
            <li>
              <div>{t("Contact")}</div>
              <span onClick={() => setShowElem4(!showElem4)}>{showElem4 ? "-" : "+"}</span>
            </li>
            <Ul op={showElem4 ? 1 : 0} h='96px'>
              <li>
                <a href="mailto:support@ccfox.com">{t("ServiceSupport")}: support@ccfox.com</a>
              </li>
              <li>
                <a
                  href={
                    userHabit.locale === "ko_KR"
                      ? "mailto:BDkr@ccfox.com"
                      : "mailto:business@ccfox.com"
                  }
                >
                  {t("BusinessCooperation")}:{" "}
                  {userHabit.locale === "ko_KR" ? "BDkr@ccfox.com" : "business@ccfox.com"}
                </a>
              </li>
              <li>
                <a href="mailto:vip@ccfox.com">{t("BeVIP")}: vip@ccfox.com</a>
              </li>
            </Ul>
            <li>
              <div>{t("JoinCommunity")}</div>
              <span>
                <a href="https://twitter.com/CCFOX2020" target="_blank">
                  <img src={"/images/home/Twitter-2.png"} alt="" />
                </a>
                <a href="https://t.me/ccfox_English" target="_blank">
                  <img src={"/images/home/lark.png"} alt="" />
                </a>
              </span>
            </li>
          </ul>
        </FooterAdap>
      )}
      <FooterBg>
        <FooterCenter>
          <FooterBottom>
            <BottomLeft>© 2021 - 2022 Benzhong.com All rights reserved.</BottomLeft>
            {/* <BottomRight>
              {size.width > 768 && `${dateFormat2(pageTime)} | `}
              {t("DayQuoteVolume")}:<span> {getAmount(7)} </span>
              USDT /<span> {getAmount(1)} </span>
              ETH /<span> {getAmount(2)} </span>
              BTC
            </BottomRight> */}
          </FooterBottom>
        </FooterCenter>
      </FooterBg>
    </>
  );
};

export default HomeFooter;
