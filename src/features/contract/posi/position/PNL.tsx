import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Flex, useModal } from "@ccfoxweb/uikit";
import { ReactComponent as EditPnl } from "/public/images/SVG/editPnl.svg";
import { useTranslation } from "next-i18next";
import PnlEditModal from "./PnlEditModal";
import useUpDownColor from "../../../../hooks/useUpDownColor";

const PnlContent = styled(Flex)`
  // padding-left: 16px;
  cursor: pointer;
`;

const Pnl = styled(Flex)`
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
`;

const Pnln = styled.div<{ c? }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ c }) => c};
`;

const UnsetPnl = styled(Flex)`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
`;

const pnl = (props) => {
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } =
    useUpDownColor();
  const posiItem = useRef({});
  const [openModal] = useModal(
    <PnlEditModal posi={posiItem.current} strongPrice={props.strongPrice} />,
    true,
    true,
    `PnlModal${props.random}`
  );
  const { t } = useTranslation();

  const PnlEdit = () => {
    return <EditPnl />;
  };

  const setPnl = () => {
    openModal();
  };
  useEffect(() => {
    posiItem.current = props?.item;
  }, [props?.item]);
  return (
    <PnlContent onClick={() => setPnl()}>
      {props.item?.profitList?.length || props.item?.lossList?.length ? (
        <Pnl>
          {/* {t('PnlList')} */}
          <Pnln c={colorUp}>{props.item?.profitList?.length}</Pnln>{" "}
          {t("StopProfit")} /{" "}
          <Pnln c={colorDown}>{props.item?.lossList?.length}</Pnln>{" "}
          {t("StopLoss")}
          {PnlEdit()}
        </Pnl>
      ) : (
        <UnsetPnl>
          {t("UnSetedPnl")}
          {PnlEdit()}
        </UnsetPnl>
      )}
    </PnlContent>
  );
};

export default pnl;
