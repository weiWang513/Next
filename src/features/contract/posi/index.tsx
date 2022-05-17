import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, useModal, CheckboxGroup } from "@ccfoxweb/uikit";
import { ReactComponent as Phone } from "/public/images/SVG/phone.svg";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { updateHideOther } from "../../../store/modules/contractSlice";
import { _shouldRestful } from "../../../utils/tools";

import Positions from './position/posiListT'
import CurOrder from './curOrder'
import ConOrder from './conOrder'
import Match from './match'
import Flow from './flow'
import HisOrder from './hisOrder'
import FcOrders from './fcOrders'
import FlOrders from './flOrders'
import PosiHeader from './posiHeader'
import CleanAll from './position/cleanAllBtn'
import ConHisOrder from "./hisConOrder";

import Login from '../../../components/Place/login'


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

// const Tabs = styled(Flex)`
//   // flex-direction: column;
//   flex: 1;
//   align-items: flex-start;
// `

// const TabsItem = styled.div`
//   display: flex;
//   align-items: center;
//   margin-right: 16px;
//   flex-direction: column;
//   // background: ${({ bgColor, top }) => bgColor ? bgColor : `rgba(19, 15, 29, ${top / 760})`};
//   color: ${({ color }) => color};
//   font-size: 14px;
//   font-weight: 600;
//   line-height: 37px;
//   // width: 20px;
//   overflow: visible;
//   cursor: pointer;
// `
// const Line = styled.div`
//   width: 20px;
//   border-bottom: 3px solid #6F5AFF;
// `

const Options = styled.div`
  min-width: 350px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  justify-content: flex-end;
`;

const CheckBoxC = styled(Flex)`
  padding: 0 16px;
  justify-content: flex-end;
  width: initial;
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

  const hideOther = useAppSelector(state => state.contract.hideOther)

  useEffect(() => {
    _shouldRestful();
  }, []);

  const changeHideOther = (v: boolean): void => {
    dispatch(updateHideOther(v));
  };

  const renderTabList = () => {
    switch (tabIndex) {
      case 0:
        return <Positions></Positions>;
      case 1:
        return <CurOrder />;
      case 2:
        return <ConOrder />;
      case 3:
        return <Match />;
      case 4:
        return <HisOrder />;
      case 5:
        return <ConHisOrder />;
      case 6:
        return <FcOrders />;
      case 7:
        return <FlOrders />;
      case 8:
        return <Flow />;
      default:
        break;
    }
  }

  return (
    <Posi>
      <Header>
        <PosiHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
        <Options>
          <CleanAll />
          <CheckBoxC>
            <CheckboxGroup
              name="confirmed"
              type="checkbox"
              checked={hideOther}
              onChange={() => changeHideOther(!hideOther)}
              scale="sm"
              text={t('HideOtherContract')}
              isDark
            />
          </CheckBoxC>
        </Options>
      </Header>
      <TabContent>
        {isLogin ? renderTabList() : <Login isPosiArea={true} />}
      </TabContent>
    </Posi>
  );
};

export default posi;
