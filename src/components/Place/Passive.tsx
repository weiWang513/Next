import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, CheckboxGroup, Tooltip } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { updatePassive } from "../../store/modules/placeSlice";
const CheckBoxC = styled.div``;
const PaCheckBox = styled.div`
  display: flex;
  min-width: 90px;
  justify-content: flex-end;
`;
const passive = (props) => {
  const Passive = useAppSelector((state) => state.place.Passive);
  const priceType = useAppSelector((state) => state.place.priceType);
  const priceTypeTab = useAppSelector((state) => state.place.priceTypeTab);
  const dispatch = useAppDispatch();
  const changePassive = (v: boolean): void => {
    dispatch(updatePassive(v));
  };
  const { t } = useTranslation();
  const toolTips = () => {
    return (
      <Tooltip text={t("PassiveOrderTips")} mb="5px">
        {t("PassiveOrder")}
      </Tooltip>
    );
  };
  return (
    <PaCheckBox>
      <CheckBoxC>
        {priceType === 1 && priceTypeTab === 1 && (
          <>
            <CheckboxGroup
              text={toolTips()}
              checked={Passive}
              onChange={() => changePassive(!Passive)}
              isDark
            />
          </>
        )}
      </CheckBoxC>
    </PaCheckBox>
  );
};
export default passive;
