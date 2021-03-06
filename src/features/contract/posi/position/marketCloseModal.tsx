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

  // ??????????????????
  const closeFuture = () => {
    let side = props?.posi?.side // ?????????1?????????-1??????
    let openPrice = props?.posi?.openPrice
    let amount = props?.posi?.absQuantity
    let final = 0
    let price = props?.posi?.lastPrice
    let contractSide = props?.posi?.contractSide
    let contractUnit = props?.posi?.contractUnit
    // ??????????????????????????? ???????????? * ???????????? * ???????????????-???????????????
    // ??????????????????????????? ???????????? * ???????????? * ???1/???????????? - 1/???????????? ???
    if (!contractSide) return '--'
    if (contractSide === 1) {
      // ??????

      if (price !== 0 && price !== '' && amount !== 0 && amount !== '') {
        final = new Big(amount).times(side).times(new Big(price).sub(openPrice)).times(contractUnit)
      }
    } else {
      // ??????

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
      gearingxie: 100, //?????? ???????????????
      contractId: props?.posi?.contractId, //??????ID
      side: -props?.posi?.side, // ???????????? ???1??????-1
      type: 3, //???????????? 1???????????????3????????????
      quantity: props?.posi?.absQuantity, //??????
      positionEffect: 2, //???????????? ??????1?????????2
      orderSubType: 0, //0??????????????????1?????????????????????2????????????????????????????????????3?????????????????????????????????4?????????????????????????????????
      // stopPrice: '', //????????????
      price: 0, //????????????
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
          {/* ??????????????????????????????????????????????????????????????????{props?.posi?.symbol}??????????????? */}
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