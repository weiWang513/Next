import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Tooltip, useModal } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateLever } from "../../../../store/modules/placeSlice";
import LeverModal from "../../place/placeFeatures/leverModal";
const Big = require("big.js");
const LeverD = styled(Flex)`
  // width: 196px;
  // height: 216px;
  flex-direction: column;
  background: #08060f;
  padding: 4px 0;
  border-radius: 0px 0px 8px 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.2);
`;

const Target = styled(Flex)`
  justify-content: center;
  min-width: 54px;
  height: 24px;
  background: #1f1830;
  border-radius: 4px;
  span {
    font-size: 12px;
    font-weight: 500;
    color: ${({ c }) => c};
    line-height: 17px;
  }
  div {
    cursor: ${({ cur }) => cur}; // not-allowed;
  }
`;
const OptionItem = styled.div`
  width: 62px;
  height: 24px;
  font-size: 12px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #615976;
  line-height: 24px;
  padding-right: 8px;
  text-align: right;
  &:hover {
    background: #130f1d;
    color: #fff;
  }
`;
const LeverC = styled.div<{ cur? }>`
  cursor: ${({ cur }) => cur};
`;

const Lever = () => {
  const lever = useAppSelector((state) => state.place.lever);
  const maxLever = useAppSelector((state) => state.place.maxLever);
  const [openModal] = useModal(<LeverModal lever={lever} />);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const posListProps = useAppSelector((state) => state.assets.posListProps);
  const [hasPosi, setHasPosi] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    let _posi = posListProps.find((e) => e.contractId === contractId);
    if (_posi) {
      let _lever = new Big(1)
        .div(_posi.initMarginRate || 0.01)
        .round()
        .toString();

      dispatch(updateLever(_lever));
      setHasPosi(true);
    } else {
      setHasPosi(false);
    }
  }, [posListProps]);

  useEffect(() => {
    if (Number(lever) > Number(maxLever)) {
      dispatch(updateLever(maxLever));
    }
  }, [maxLever]);

  // useEffect(() => {
  //   if (getInjectInfo('placeParams')) {
  //     const placeParams = JSON.parse(getInjectInfo('placeParams'))
  //     placeParams.lever && dispatch(updateLever(placeParams.lever))
  //     console.log('maxLever', placeParams.lever)
  //     placeParams.priceType && dispatch(updatePriceType(placeParams.priceType < maxLever ? placeParams.priceType : maxLever))
  //     placeParams.modeType && dispatch(updateModeType(placeParams.modeType))
  //   }
  // }, [])
  const renderColor = () => {
    return hasPosi
      ? lever >= 50
        ? "rgba(236, 81, 109, 0.6)"
        : "rgba(97, 89, 118, 1)"
      : lever >= 50
      ? "rgba(236, 81, 109, 1)"
      : "#fff";
  };
  const dropdownTarget = () => {
    return (
      <Target onClick={() => changeLever()} c={renderColor()}>
        <span>{lever}x</span>
        {/* <ArrowD /> */}
      </Target>
    );
  };
  const changeLever = (): void => {
    if (!hasPosi) {
      openModal();
    }
  };
  return (
    <LeverC cur={hasPosi ? "not-allowed" : "pointer"}>
      {hasPosi ? (
        <>
          <Target onClick={() => changeLever()} c={renderColor()} cur="not-allowed">
            <Tooltip hideTargetDecoration text={t("disableLaP")}>
              <span>{lever}x</span>
              {/* <ArrowD /> */}
              {/* {dropdownTarget()} */}
            </Tooltip>
          </Target>
        </>
      ) : (
        <>{dropdownTarget()}</>
      )}
    </LeverC>
  );
};

export default Lever;
