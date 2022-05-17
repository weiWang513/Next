import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, useModal } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import LeverModal from "../../place/placeFeatures/leverModal";
import PlaceModeModal from "../../place/placeFeatures/placeModeModal";
import ClosePosiModal from "./closePosiModal";
import MarketCloseModal from "./marketCloseModal";
import PosiReverseWarn from "./posiReverseWarn";
import PosiReverse from "./posiReverse";
import PosiReverPlaceModal from "./posiReverPlaceModal";
import { getInjectInfo } from "../../../../functions/info";
const Big = require("big.js");
const Options = styled(Flex)`
  // padding-left: 16px;
`;

const OptionsItem = styled.div`
  min-width: 56px;
  padding: 0 12px;
  line-height: 24px;
  background: #1f1830;
  border-radius: 4px;
  margin-right: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  text-align: center;
  &:hover {
    opacity: 0.6;
  }
`;
const Lever = styled(OptionsItem)<{ c? }>`
  color: ${({ c }) => c};
`;

const posiOptions = (props) => {
  const [lever, setLever] = useState(1);
  const [marginType, setModeType] = useState(1);
  const [openLeverModal] = useModal(
    <LeverModal lever={lever} isPosi={true} posi={props.item} />,
    true,
    true,
    `LeverModal${props.random}`
  );
  const [openModeModal] = useModal(
    <PlaceModeModal marginType={marginType} isPosi={true} posi={props.item} />,
    true,
    true,
    `PosiModeModal${props.random}`
  );
  const [openClosePosiModal] = useModal(
    <ClosePosiModal isPosi={true} posi={props.item} />,
    true,
    true,
    `CloseModal${props.random}`
  );
  const [openMarketCloseModal] = useModal(
    <MarketCloseModal isPosi={true} posi={props.item} />,
    true,
    true,
    `MarketCloseModal${props.random}`
  );
  const [openPosiReverseModal] = useModal(
    <PosiReverse isPosi={true} posi={props.item} showModal={() => showPlaceModal()} />,
    true,
    true,
    `PosiReverse${props.random}`
  );
  const [openPosiReverseWarnModal] = useModal(
    <PosiReverseWarn isPosi={true} posi={props.item} openPosiReverseModal={openPosiReverseModal} />,
    true,
    true,
    `PosiReverseWarn${props.random}`
  );
  const [openPosiReverPlaceModal] = useModal(
    <PosiReverPlaceModal isPosi={true} posi={props.item} />,
    true,
    true,
    `PosiReverPlaceModal${props.random}`
  );
  const { t } = useTranslation();

  useEffect(() => {
    let _lever = Number(
      new Big(1)
        .div(props.item.initMarginRate || 0.01)
        .round()
        .toString()
    );
    console.log("props.modeType", props.item);
    setLever(_lever);
    setModeType(props.item?.marginType);
  }, [props.item]);
  const changeLever = (): void => {
    openLeverModal();
  };
  const changeModeType = (): void => {
    openModeModal();
  };

  const closePosi = (): void => {
    openClosePosiModal();
  };

  const marketClose = (): void => {
    openMarketCloseModal();
  };

  const posiReverse = (): void => {
    // let _known = Number(getInjectInfo('known'))
    // if (_known) {
    openPosiReverseModal();
    // openPosiReverPlaceModal()
    // } else {
    //   openPosiReverseWarnModal()
    // }
  };

  const showPlaceModal = () => {
    setTimeout(() => {
      openPosiReverPlaceModal();
    }, 100);
  };

  return (
    <Options>
      <OptionsItem onClick={() => changeModeType()}>
        <span>{marginType === 1 ? t("FullPosition") : t("isolated")}</span>
      </OptionsItem>
      <Lever onClick={() => changeLever()} c={lever >= 50 ? "rgba(236, 81, 109, 1)" : ""}>
        <span>
          {new Big(1)
            .div(props.item.initMarginRate || 0.01)
            .round()
            .toString()}
          x
        </span>
      </Lever>
      <OptionsItem onClick={() => closePosi()}>
        <span>{t("Close")}</span>
      </OptionsItem>
      <OptionsItem onClick={() => marketClose()}>
        <span>{t("CloseAtMarketPrice")}</span>
      </OptionsItem>
      <OptionsItem onClick={() => posiReverse()}>
        <span>{t("posiReverse")}</span>
      </OptionsItem>
    </Options>
  );
};

export default posiOptions;
