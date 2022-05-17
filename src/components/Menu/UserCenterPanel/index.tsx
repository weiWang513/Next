import React from "react";
import styled from "styled-components";

import SelectComponent from './selectComponent'
import LinkComponent from './LinkComponent'

import { ReactComponent as Assets } from "/public/images/SVG/response/wallet.svg";
import { ReactComponent as Order } from "/public/images/SVG/response/orders.svg";
import { ReactComponent as BuyCoin } from "/public/images/SVG/response/buyCoin.svg";
import { ReactComponent as Recharge } from "/public/images/SVG/response/recharge.svg";
import { ReactComponent as Withdraw } from "/public/images/SVG/response/withdraw.svg";
import { ReactComponent as Transfer } from "/public/images/SVG/response/transfer.svg";
import { ReactComponent as Invite } from "/public/images/SVG/response/invite.svg";
import { ReactComponent as Logout } from "/public/images/SVG/response/logOut.svg";
import { removeInjectInfo } from "../../../functions/info";
import { useAppDispatch } from "../../../store/hook";
import { setIsLogin } from "../../../store/modules/appSlice";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const UnLoginPanel = styled.div``

const Line = styled.div`
  width: 296px;
  height: 1px;
  background: #F6F6F6;
  margin: 8px 0;
  margin-left: 24px;
`

const unLoginPanel = props => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { push } = useRouter();

  const list:{title?;renderIcon?;isLine?;type?;options?;handel?;}[] = [{
    title: t('MyBalance'),
    renderIcon: () => <Assets />,
    handel: () => {
      push('/download')
    }
  },{
    title: t('Orders'),
    renderIcon: () => <Order />,
    type: 'select',
    options: [{
      title: t('SpotOrders'),
      handel: () => {
        push('/download')
      }
    },{
      title: t('ContractOrders'),
      handel: () => {
        push('/download')
      }
    }]
  },{
    type: 'line'
  },{
    title: t('FastOtc'),
    renderIcon: () => <BuyCoin />,
    handel: () => {
      push('/download')
    }
  },{
    title: t('RechargeCash'),
    renderIcon: () => <Recharge />,
    handel: () => {
      push('/download')
    }
  },{
    title: t('WithDrawCash'),
    renderIcon: () => <Withdraw />,
    handel: () => {
      push('/download')
    }
  },{
    title: t('Transfer'),
    renderIcon: () => <Transfer />,
    handel: () => {
      push('/download')
    }
  },{
    type: 'line'
  },{
    title: t('InviteReturn'),
    renderIcon: () => <Invite />,
    handel: () => {
      push('/download')
    }
  },{
    title: t('Logout'),
    renderIcon: () => <Logout />,
    handel: () => {
      removeInjectInfo("_authorization");
      dispatch(setIsLogin(false));
    }
  }]

  return <UnLoginPanel>
    {
      list.map((e, i) => {
        switch (e.type) {
          case 'select':
            return <SelectComponent title={e.title} options={e.options} renderIcon={e.renderIcon} key={i} />
          case 'line':
            return <Line key={i} />
          default:
            return <LinkComponent title={e.title} renderIcon={e.renderIcon} key={i} handel={e.handel} />
        }
      })
    }
  </UnLoginPanel>
}

export default unLoginPanel