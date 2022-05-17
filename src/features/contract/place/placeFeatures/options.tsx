import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, CheckboxGroup } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updatePassive, updateSetSL, updateSetSP } from "../../../../store/modules/placeSlice";
import PassiveCom from "../../../../components/Place/Passive";
const Options = styled(Flex)`
  width: 288px;
  height: 32px;
  justify-content: space-between;
`;
const CheckBoxC = styled.div`
  margin-right: 16px;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    margin-left: 3px;
  }
`;

const Pnl = styled(Flex)``;

const options = (props) => {
  const setSP = useAppSelector((state) => state.place.setSP);
  const setSL = useAppSelector((state) => state.place.setSL);
  const posiMode = useAppSelector((state) => state.place.posiMode);
  const positionEffect = useAppSelector((state) => state.place.positionEffect);
  const priceTypeTab = useAppSelector((state) => state.place.priceTypeTab);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const changeSetSP = (v: boolean): void => {
    dispatch(updateSetSP(v));
  };
  const changeSetSL = (v: boolean): void => {
    dispatch(updateSetSL(v));
  };
  return (
    <>
      {!!posiMode && priceTypeTab !== 4 && positionEffect === 1 && (
        <Options>
          <Pnl>
            <CheckBoxC>
              <CheckboxGroup
                text={t("stopProfit")}
                checked={setSP}
                onChange={() => changeSetSP(!setSP)}
                isDark
              />
            </CheckBoxC>
            <CheckBoxC>
              <CheckboxGroup
                text={t("stopLoss")}
                checked={setSL}
                onChange={() => changeSetSL(!setSL)}
                isDark
              />
            </CheckBoxC>
          </Pnl>
          <PassiveCom />
        </Options>
      )}
    </>
  );
};

export default options;
