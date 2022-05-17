import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, InputGroup, Slider, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { ReactComponent as Minus } from "/public/images/SVG/minus.svg";
import { ReactComponent as Plus } from "/public/images/SVG/plus.svg";
import { ReactComponent as LeverTips } from "/public/images/SVG/leverTip.svg";
import { ReactComponent as LeverWarn } from "/public/images/SVG/leverWarn.svg";
import { useAppDispatch, useAppSelector } from '../../../../store/hook';
import { uuid } from '../../../../utils/utils';
import { toFix6 } from '../../../../utils/filters';
import { cancels } from '../../../../services/api/contract';
import { place } from '../../../../utils/common';
import useUpDownColor from '../../../../hooks/useUpDownColor';
const Big = require('big.js')

const ModeContent = styled.div`
  padding-top: 0;
  padding-bottom: 24px;
`
const Tips = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #615976;
  line-height: 24px;
  text-align: center;
`
const UPnl = styled.div<{c?}>`
  width: 288px;
  height: 40px;
  background: #130F1D;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(97, 89, 118, 1);
  line-height: 40px;
  text-align: center;
  margin: 24px 0;
  span{
    color: ${({c}) => c};
  }
`
const CreateBtns = styled(Flex)`
`

const CancelBtn = styled(Button)`
  flex: 1;
  margin-right: ${({mr}) => mr};
`
const SaveBtn = styled(CancelBtn)`
`

const marketCloseModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const contractList = useAppSelector(state => state.contract.contractList)
  const conditionOrders = useAppSelector(state => state.assets.conditionOrders)
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();

  const [marketCloseUuid, setMarketCloseUuid] = useState(uuid())
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const contractItem = useRef<{
    contractSide?;
    commodityName?;
    currencyName?;
  }>({})

  useEffect(() => {
    contractItem.current = contractList.find(e=>e.contractId === props.posi.contractId)
  }, [])

  const confirm = ():void => {
    _closePosi()
  } 

  // 平仓预计盈亏
  const closeFuture = () => {
    let side = props?.posi?.side // 方向，1为买，-1为卖
    let openPrice = props?.posi?.openPrice
    let amount = props?.posi?.absQuantity
    let final = 0
    let price = props?.posi?.lastPrice
    let contractSide = props?.posi?.contractSide
    let contractUnit = props?.posi?.contractUnit
    // 对于正向合约来说： 平仓数量 * 持仓方向 * （平仓价格-开仓均价）
    // 对于反向合约来说： 平仓数量 * 持仓方向 * （1/开仓均价 - 1/平仓价格 ）
    if (!contractSide) return '--'
    if (contractSide === 1) {
      // 正向

      if (price !== 0 && price !== '' && amount !== 0 && amount !== '') {
        final = new Big(amount).times(side).times(new Big(price).sub(openPrice)).times(contractUnit)
      }
    } else {
      // 反向

      if (price !== 0 && price !== '' && amount !== 0 && amount !== '') {
        final = new Big(amount)
          .times(side)
          .times(new Big(1).div(openPrice).sub(new Big(1).div(price)))
          .times(contractUnit)
      }
    }
    const _d = contractItem.current?.contractSide === 1 ? 2 : 6
    return final > 0 ? `+${toFix6(final, _d)}` : `${toFix6(final, _d)}`
  }

  const currencyName = () => {
    let item = contractList.find(el => el.contractId === props?.posi?.contractId)
    return item ? item?.currencyName : '--'
  }

  const _closePosi = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 7000)
    let qs = {
      gearingxie: 100, //杠杆 平仓用不到
      contractId: props?.posi?.contractId, //合约ID
      side: -props?.posi?.side, // 买卖方向 买1，卖-1
      type: 3, //价格类型 1（限价），3（市价）
      quantity: props?.posi?.absQuantity, //数量
      positionEffect: 2, //开平方向 开仓1，平仓2
      orderSubType: 0, //0（默认值），1（被动委托），2（最近价触发条件委托），3（指数触发条件委托），4（标记价触发条件委托）
      // stopPrice: '', //触发价格
      price: 0, //委托价格
    }
    // console.log('cancelsArr', conditionOrders)
    // if (
    //   // conditionOrders.some(
    //   //   item => item.contractId === props?.posi?.contractId && props?.posi?.side !== item.side && item.orderStatus < 11
    //   // )
    //   props?.posi?.profitList?.length || props?.posi?.lossList?.length
    // ) {
    //   // let closeOrders = conditionOrders.filter(
    //   //   el =>
    //   //     el.contractId === props?.posi?.contractId &&
    //   //     props?.posi?.side !== el.side &&
    //   //     el.positionEffect === 2 &&
    //   //     el.orderStatus < 11
    //   // )
    //   let cancelsArr = [...props?.posi?.profitList, ...props?.posi?.lossList].map(el => {
    //     return {
    //       contractId: el.contractId,
    //       originalOrderId: el.orderId,
    //     }
    //   })
    //   console.log('cancelsArr', cancelsArr)
    //   cancels({
    //     data: { cancels: cancelsArr },
    //     headers: { unique: marketCloseUuid },
    //   }).then(res => {
    //     setMarketCloseUuid(uuid())
    //     // place(qs, closePosSuccess, closePosFail, I18n.t('OrderSucceed'))
    //     place(qs, closePosSuccess, closePosFail, t('OrderedSuccessfully'))
    //   })
    // } else {
    setMarketCloseUuid(uuid())
    place(qs, closePosSuccess, closePosFail, t('OrderedSuccessfully'))
      // place(qs, closePosSuccess, closePosFail, I18n.t('OrderSucceed'))
    // }
  }

  const closePosSuccess = tips => {
    message.success(tips)
    setLoading(false)
    onDismiss()
  }

  const closePosFail = () => {
    setLoading(false)
    onDismiss()
  }

  const close = () => {
    onDismiss()
  }

  const renderUPnl = () => {
    const _upnl = closeFuture()
    return (
      <UPnl c={Number(_upnl) > 0 ? colorUp : colorDown}>{t('unrealizedProfitLoss')}: <span>{_upnl}</span> {currencyName()}</UPnl>
    )
  }

  useEffect(() => {
    console.log('props?.posi', props?.posi)
  }, [props?.posi])
  
  return (
    <Modal title={t('CloseAtMarketPrice')} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      <ModeContent>
        <Tips>
          {t('CancleOrderTips', {symbol: props?.posi?.symbol})}
          {/* 系统将按市场最新价帮你全部平仓同时将自动撤销{props?.posi?.symbol}的平仓委托 */}
        </Tips>
        {
          renderUPnl()
        }
        <CreateBtns>
          <CancelBtn variant={'secondary'} scale={'md'} isDark={true} mr={'8px'} onClick={close}>{t('Cancel')}</CancelBtn>
          <SaveBtn variant={'primary'} scale={'md'} isDark={true} onClick={confirm} isLoading={loading}>{t('ConfirmB')}</SaveBtn>
        </CreateBtns>
      </ModeContent>
    </Modal>
  )
}

export default marketCloseModal;