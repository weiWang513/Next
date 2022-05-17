import React, { useRef } from "react";
import styled from "styled-components";
import { Flex, Dropdown } from "@ccfoxweb/uikit";

import { ReactComponent as Order } from "/public/images/SVG/order.svg";
import { ReactComponent as IconOrderSpot } from "/public/images/SVG/order-spot.svg";
import { ReactComponent as IconOrderCcontract } from "/public/images/SVG/order-contract.svg";
import { useTranslation } from "next-i18next";
import { hostReplace } from "../../utils/utils";

const PhoneWarp = styled(Flex)`
  width: 56px;
  height: 56px;
  align-items: center;
  justify-content: center;
  // margin-left: 24px;
  cursor: pointer;
  &:hover {
    svg {
      path {
        fill: #6f5aff;
      }
    }
  }
`;
const DropPadding = styled.div`
  padding-top: 4px;
`;
const OrdersMain = styled(Flex)`
  // width: 196px;
  // height: 216px;
  flex-direction: column;
  background: #1f1830;
  border-radius: 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;
const ListItem = styled(Flex)`
  // width: 100%;
  min-width: 172px;
  height: 48px;
  padding: 0 8px;
  cursor: pointer;
  align-items: center;
  span {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
  }
  .selected {
    color: #14af81;
  }
  &:hover {
    background: #130f1d;
    span {
      color: #6f5aff;
    }
  }
`;
const targetHoverStyle = `
  // background: #1F1830;
  svg {
    path {
      fill: #6F5AFF;
    }
  }
`;

const DownloadApp = () => {
  const { t } = useTranslation();
  const dropRef = useRef(null);

  interface Option {
    key: string;
    value: string;
    icon: any;
  }
  const options: Option[] = [
    {
      key: t("fm29"),
      value: "/user/fm/fmOrder",
      icon: () => <IconOrderSpot />
    },
    {
      key: t("SpotOrders"),
      value: "/user/spot/curOrder",
      icon: () => <IconOrderSpot />
    },
    {
      key: t("ContractOrders"),
      value: "/user/order/CurFuture",
      icon: () => <IconOrderCcontract />
    }
  ];
  const dropdownTarget = (): any => {
    return (
      <PhoneWarp>
        <Order />
      </PhoneWarp>
    );
  };
  const handelClick = (v: Option): void => {
    if (v.value) {
      window.location.href = `https://${hostReplace()}${v.value}`;
    }
  };
  return (
    <Dropdown
      position="bottom-left"
      target={dropdownTarget()}
      targetHoverStyle={targetHoverStyle}
      ref={dropRef}
    >
      <DropPadding>
        <OrdersMain>
          {options.map((i) => {
            return (
              <ListItem
                key={i.key}
                onClick={() => {
                  handelClick(i);
                  dropRef.current.close();
                }}
              >
                {i.icon()}
                <span>{i.key}</span>
              </ListItem>
            );
          })}
        </OrdersMain>
      </DropPadding>
    </Dropdown>
  );
};

export default DownloadApp;
