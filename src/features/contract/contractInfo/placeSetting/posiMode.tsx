import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Tooltip, useModal } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateModeType } from "../../../../store/modules/placeSlice";
import PlaceModeModal from "../../place/placeFeatures/placeModeModal";

const ModeD = styled(Flex)`
  // width: 196px;
  // height: 216px;
  flex-direction: column;
  background: #08060f;
  padding: 4px 0;
  border-radius: 0px 0px 8px 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.2);
`;

const Target = styled(Flex)`
  min-width: 55px;
  justify-content: center;
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

const PosiModeDropdown = styled.div<{ cur? }>`
  cursor: ${({ cur }) => cur};
  margin-right: 4px;
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

const PosiMode = () => {
  const modeType = useAppSelector((state) => state.place.modeType);
  const [openModal] = useModal(<PlaceModeModal marginType={modeType} />);
  const { t } = useTranslation();
  const contractId = useAppSelector((state) => state.contract.contractId);
  const posListProps = useAppSelector((state) => state.assets.posListProps);
  const [hasPosi, setHasPosi] = useState(false);
  const dispatch = useAppDispatch();
  const posiModeA: { label: string; value: number }[] = [
    {
      label: t("FullPosition"), // '全仓',
      value: 1,
    },
    {
      label: t("isolated"), // '逐仓',
      value: 2,
    },
  ];

  useEffect(() => {
    let _posi = posListProps.find((e) => e.contractId === contractId);
    if (_posi) {
      dispatch(updateModeType(_posi?.marginType));
      setHasPosi(true);
    } else {
      setHasPosi(false);
    }
  }, [posListProps]);

  const dropdownTarget = () => {
    return (
      <Target
        onClick={() => changeModeType()}
        c={hasPosi ? "rgba(97, 89, 118, 1)" : "#fff"}
      >
        <span>{modeType === 1 ? t("FullPosition") : t("isolated")}</span>
        {/* <ArrowD /> */}
      </Target>
    );
  };
  const changeModeType = (): void => {
    if (!hasPosi) {
      openModal();
    }
    // if (v === 1) {

    // } else {

    // }
  };
  return (
    <PosiModeDropdown cur={hasPosi ? "not-allowed" : "pointer"}>
      {hasPosi ? (
        <>
          <Target
            onClick={() => changeModeType()}
            c={hasPosi ? "rgba(97, 89, 118, 1)" : "#fff"}
            cur="not-allowed"
          >
            <Tooltip hideTargetDecoration text={t("disableLaP")}>
              <span>{modeType === 1 ? t("FullPosition") : t("isolated")}</span>
            </Tooltip>
            {/* <ArrowD /> */}
          </Target>
        </>
      ) : (
        <>{dropdownTarget()}</>
      )}
    </PosiModeDropdown>
  );
};

export default PosiMode;
