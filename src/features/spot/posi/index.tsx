import React, { useState } from "react";
import styled from "styled-components";
import { Flex, CheckboxGroup } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { updateHideOther } from "../../../store/modules/spotSlice";

import PosiHeader from "./posiHeader";
import CurOrder from "./curOrder";
import HisOrder from "./hisOrder";
import Match from "./match";

import Login from "../../../components/Place/login";

const Posi = styled.div`
  min-height: 568px;
  background: rgba(19, 15, 29, 1);
`;

const Header = styled(Flex)`
  justify-content: space-between;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(8, 6, 15, 1);
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  justify-content: flex-end;
`;

const CheckBoxC = styled(Flex)`
  padding: 0 16px;
  justify-content: flex-end;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    margin-left: 3px;
  }
`;

const TabContent = styled.div`
  height: 528px;
  overflow-x: hidden;
  // overflow: hidden;
`;

const posi = () => {
  const dispatch = useAppDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { t } = useTranslation();

  const hideOther = useAppSelector((state) => state.spot.hideOther);

  const changeHideOther = (v: boolean): void => {
    dispatch(updateHideOther(v));
  };

  const renderTabList = () => {
    switch (tabIndex) {
      case 0:
        return <CurOrder />;
      case 1:
        return <HisOrder />;
      case 2:
        return <Match />;

      default:
        break;
    }
  };

  return (
    <Posi>
      <Header>
        <PosiHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
        <Options>
          {tabIndex < 1 && (
            <CheckBoxC>
              <CheckboxGroup
                name="confirmed"
                type="checkbox"
                checked={hideOther}
                onChange={() => changeHideOther(!hideOther)}
                scale="sm"
                text={t("HideOther")}
                isDark
              />
            </CheckBoxC>
          )}
        </Options>
      </Header>
      <TabContent>{isLogin ? renderTabList() : <Login isPosiArea={true} />}</TabContent>
    </Posi>
  );
};

export default posi;
