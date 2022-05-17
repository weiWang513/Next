import React from "react";
import styled from "styled-components";
import LanguageS from "./Language";
import FaitCurrency from "./FaitCurrency";

import SelectComponent from "../UserCenterPanel/selectComponent";
import LinkComponent from "../UserCenterPanel/LinkComponent";
const UnLoginPanel = styled.div``;
import { ReactComponent as ContractInfo } from "/public/images/SVG/contract_Info.svg";
import { ReactComponent as FmEntry } from "/public/images/SVG/fm/entry.svg";
import { ReactComponent as Trade } from "/public/images/SVG/trade.svg";
import { ReactComponent as Download } from "/public/images/SVG/download.svg";
import { ReactComponent as Coin } from "/public/images/SVG/coin.svg";
import { ReactComponent as Language } from "/public/images/SVG/Language_s.svg";
import { ReactComponent as Spot } from "/public/images/SVG/spot.svg";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const Line = styled.div`
  width: 296px;
  height: 1px;
  background: #f6f6f6;
  margin: 8px 0;
  margin-left: 24px;
`;

const unLoginPanel = (props) => {
  const { push } = useRouter();

  const { t } = useTranslation();

  const list: { title?; renderIcon?; isLine?; type?; options?; handel? }[] = [
    {
      title: t("FutureTread"),
      renderIcon: () => <Trade />,
      type: "select",
      options: [
        {
          title: t("UsdtContract"),
          handel: () => {
            push("/download");
          }
        },
        {
          title: t("UsdtrContract"),
          handel: () => {
            push("/download");
          }
        }
      ]
    },
    {
      title: t("SpotTrade"),
      renderIcon: () => <Spot />,
      handel: () => {
        push("/download");
      }
    },
    {
      title: t("FmTitle"),
      renderIcon: () => <FmEntry />,
      handel: () => {
        push("/finance/crypto_fixed_return");
      }
    },
    {
      title: t("ContractInfo"),
      renderIcon: () => <ContractInfo />,
      handel: () => {
        push("/download");
      }
    },
    {
      type: "line"
    },
    {
      title: t("Download"),
      renderIcon: () => <Download />,
      handel: () => {
        push("/download");
      }
    },
    {
      type: "language"
    },
    {
      type: "coin"
    }
  ];
  return (
    <UnLoginPanel>
      {list.map((e, i) => {
        switch (e.type) {
          case "select":
            return (
              <SelectComponent
                title={e.title}
                options={e.options}
                renderIcon={e.renderIcon}
                key={i}
              />
            );
          case "line":
            return <Line key={i} />;
          case "language":
            return <LanguageS key={i} />;
          case "coin":
            return <FaitCurrency key={i} />;

          default:
            return (
              <LinkComponent title={e.title} renderIcon={e.renderIcon} key={i} handel={e.handel} />
            );
        }
      })}
    </UnLoginPanel>
  );
};

export default unLoginPanel;
