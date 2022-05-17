import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Flex, Button, useModal, message } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { uuid } from '../../../../utils/utils'
import { getFirstPrice, orderNoticeCalc, place } from "../../../../utils/common";
import PlaceModal from "./placeModal";
import RiskModal from "./riskModal";
import { updateCostBuy, updateCostSell, updateCount, updateLossInput, updatePercent, updatePrice, updateProfitInput, updateSide, updateStopPrice } from "../../../../store/modules/placeSlice";
const PlaceBtn = styled(Flex)`
  flex-direction: ${({fd}) => fd};
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 8px;
  border-top: 1px solid #1F1830;
`

const Btn = styled(Button)`
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  flex: 1;
  height: 40px;
  border-radius: 4px;
`

const placeBtn = props => {
  const lever = useAppSelector(state => state.place.lever)
  const contractId = useAppSelector(state => state.contract.contractId)
  const side = useAppSelector(state => state.place.side)
  const priceType = useAppSelector(state => state.place.priceType)
  const priceTypeTab = useAppSelector(state => state.place.priceTypeTab)
  const qtyBuy = useAppSelector(state => state.place.qtyBuy)
  const qtySell = useAppSelector(state => state.place.qtySell)
  const positionEffect = useAppSelector(state => state.place.positionEffect)
  const stopPriceType = useAppSelector(state => state.place.stopPriceType)
  const stopPrice = useAppSelector(state => state.place.stopPrice)
  const price = useAppSelector(state => state.place.price)
  const Passive = useAppSelector(state => state.place.Passive)
  const count = useAppSelector(state => state.place.count)
  const modeType = useAppSelector(state => state.place.modeType)
  const closeFlag = useAppSelector(state => state.place.closeFlag)

  const posiMode = useAppSelector(state => state.place.posiMode)

  const setSP = useAppSelector(state => state.place.setSP)
  const setSL = useAppSelector(state => state.place.setSL)
  const profitInput = useAppSelector(state => state.place.profitInput)
  const lossInput = useAppSelector(state => state.place.lossInput)
  const profitStopType = useAppSelector(state => state.place.profitStopType)
  const lossStopType = useAppSelector(state => state.place.lossStopType)
  const snapshot = useAppSelector(state => state.contract.snapshot)
  const userHabit = useAppSelector(state => state.app.userHabit);
  const posListProps = useAppSelector(state => state.assets.posListProps)
  const placeConfirm = useAppSelector(state => state.app.placeConfirm);
  const { t } = useTranslation()

  const _side = useRef<number|string>('')

  const dispatch = useAppDispatch()
  const placeOrder = (v:number):void => {
    _side.current = v
    if (priceTypeTab === 4 && !stopPrice) {
      message.info(t('ConditionPriceWarn'))
      return
    }
    if (priceType === 1 && !price) {
      message.info(t('PriceWarn'))
      return
    }
    if (!count) {
      message.info(t('CountWarn'))
      return
    }
    if (positionEffect === 2) {
      let _closeN = renderPosiN(v)
      if (v > 0) {
        if (qtyBuy > _closeN) {
          message.info(t('EffectOverTips'))
          return
        }
      } else {
        if (qtySell > _closeN) {
          message.info(t('EffectOverTips'))
          return
        }
      }
    }
    let _comparePrice = priceType === 1 ? price : snapshot?.lastPrice
    if (setSP && profitInput) {
      if (v > 0) {
        if (Number(profitInput) <= Number(_comparePrice)) {
          message.info(t('StopPPriceWarn'))
          return
        }
      } else {
        if (Number(profitInput) >= Number(_comparePrice)) {
          message.info(t('StopPPriceWarn'))
          return
        }
      }
    }
    if (setSL && lossInput) {
      if (v > 0) {
        if (Number(lossInput) >= Number(_comparePrice)) {
          message.info(t('StopLPriceWarn'))
          return
        }
      } else {
        if (Number(lossInput) <= Number(_comparePrice)) {
          message.info(t('StopLPriceWarn'))
          return
        }
      }
    }

    v && dispatch(updateSide(v))
    orderNotice(v)
    // const params = {
    //   gearingxie: lever,
    //   contractId,
    //   side: v,
    //   type: priceType,
    //   quantity: v > 0 ? qtyBuy : qtySell,
    //   positionEffect,
    //   orderSubType: priceTypeTab < 4 ? !Passive ? 0 : 1 : stopPriceType,
    //   stopPrice,
    //   price,
    //   modeType,
    // }
    // console.log(params, 'placeOrder')
    // place(params, callback, fail, '')
  }

  const renderPosiN = (v:number) => {
    let absQ = posListProps.find(e => e.contractId === contractId && e.side === -v)
    return Math.abs(absQ?.fairQty) || 0
  }

  const handelPlace = () => {
    if (placeConfirm) {
      openModal()
    } else {
      confirm()
    }
  }

    // 下单委托价 高于 {标记价格*（1+0.5/杠杆倍数）}的买单 或 低于 {最新价*（1-0.5/杠杆倍数）} 时，会有以下提醒
  // 如果是市价下单， 下单委托价=对手价
  const orderNotice = side => {
    let _price = priceType === 3 ? getFirstPrice(side, snapshot) : price
    orderNoticeCalc(side, snapshot, _price, lever, openRiskModal, () => handelPlace())
  }

  const callback = () => {
  }
  const fail = () => {
  }
  const [openModal] = useModal(<PlaceModal title={t('PlaceConfirm')} />)
  const [openRiskModal] = useModal(<RiskModal title={t('PlaceConfirm')} confirm={handelPlace} />)

  // useEffect(() => {
  //   console.log('userHabit?.upDownColor', userHabit?.upDownColor === "0" ? 'success' : 'danger', userHabit?.upDownColor)
  // }, [])

  const confirm = ():void => {
    let _uuid = uuid()
    const params = {
      gearingxie: lever,
      contractId,
      side: _side.current,
      type: priceType,
      quantity: _side.current > 0 ? qtyBuy : qtySell,
      positionEffect: posiMode ? positionEffect : closeFlag ? 2 : 1,
      orderSubType: priceTypeTab < 4 ? !Passive ? 0 : 1 : stopPriceType,
      stopPrice,
      Passive: Passive,
      price: priceType === 1 ? price : 0,
      modeType,
      clientOrderId: _uuid,
    }
    // if (priceType > 2) {
    //   params.orderSubType = stopType
    //   params.stopPrice = stopPrice
    //   // params.positionEffect = 2
    // }
    console.log('placeOrder', params)
    place(params, () => cb(_uuid), fail, '')
  }

  const cb = (_uuid) => {
    // message.success(i18n.t('OrderSucceed'), 1.5)
    message.success(t('OrderedSuccessfully'), 1.5)
    
    setPnl(_uuid)
    // 下单成功清空表单
    dispatch(updatePrice(''))
    dispatch(updateStopPrice(''))
    dispatch(updateCount(''))
    dispatch(updateCostBuy(''))
    dispatch(updateCostSell(''))
    dispatch(updatePercent(0))
    // setPrice('')
    // setStopPrice('')
    // setCount('')
    // props.shouldRestful()
    // setPlaceModal(false)
    // onDismiss()
    // setLoading(false)
  }

  const setPnl = (_uuid) => {
    if (profitInput && setSP) {
      let params = {
        modeType: modeType,
        // gearingxie:
        //   modeType === 1
        //     ? crossLever // leverTypes[leverTypes.length - 1].value
        //     : leverType,
        gearingxie: lever,
        contractId: contractId,
        side: Number(_side.current) * -1,
        type: 3,
        quantity: _side.current > 0 ? qtyBuy : qtySell,
        positionEffect: 2,
        // price: 3 === 1 ? profitInput : 0,
        price: 0,
        stopPrice: profitInput,
        orderSubType: profitStopType,
        hasReady: priceType === 3 || priceIsOver(price, _side.current) ? true : false,
        conditionOrderType: calcPnlStatus(profitInput, _side.current), //1,
        uuid: _uuid,
      }
      // if (priceType > 2) {
      //   params.orderSubType = stopType
      //   params.stopPrice = stopPrice
      //   // params.positionEffect = 2
      // }
      console.log('profitInput', params)
      place(
        params,
        () => {
          // message.success(i18n.t('ProfitOrderSucceed'), 1.5)
          message.success(t('ProfitOrderSucceed'), 1.5)
          dispatch(updateProfitInput(''))
          // setProfitInput('')
        },
        () => {
          // setLoading(false)
        },
        t('ProfitOrderSucceed')
        // i18n.t('ProfitOrderSucceed')
      )
    }
    if (lossInput && setSL) {
      let params = {
        modeType: modeType,
        // gearingxie:
        //   modeType === 1
        //     ? crossLever // leverTypes[leverTypes.length - 1].value
        //     : leverType,
        gearingxie: lever,
        contractId: contractId,
        side: Number(_side.current) * -1,
        type: 3,
        quantity: _side.current > 0 ? qtyBuy : qtySell,
        positionEffect: 2,
        // price: 3 === 1 ? lossInput : 0,
        price: 0,
        stopPrice: lossInput,
        orderSubType: lossStopType,
        hasReady: priceType === 3 || priceIsOver(price, _side.current) ? true : false,
        conditionOrderType: calcPnlStatus(lossInput, _side.current), // 2
        uuid: _uuid,
      }
      // if (priceType > 2) {
      //   params.orderSubType = stopType
      //   params.stopPrice = stopPrice
      //   // params.positionEffect = 2
      // }
      console.log('profitInputLoss', params)
      place(
        params,
        () => {
          // message.success(i18n.t('LossOrderSucceed'), 1.5)
          // setLossInput('')
          message.success(t('LossOrderSucceed'), 1.5)
          dispatch(updateLossInput(''))
        },
        () => {
          // setLoading(false)
        },
        t('LossOrderSucceed')
        // i18n.t('LossOrderSucceed')
      )
    }
  }

    /**
   * 判断价格，下单是否会立即成交
   * @param {下单价格} v
   * @param {方向} side
   */
     const priceIsOver = (v, side) => {
      console.log('priceIsOver', v, side, snapshot.lastPrice)
      if ((side > 0 && Number(v) > snapshot.lastPrice) || (side < 0 && Number(v) < snapshot.lastPrice)) {
        return true
      } else {
        return false
      }
    }
  
    /**
     * 判断止盈止损方向
     * @param {止盈止损价格} PnlPrice
     * @param {下单方向} side
     * return 1 止盈 2 止损
     */
    const calcPnlStatus = (PnlPrice, side) => {
      let _price = priceType === 3 ? snapshot.lastPrice : Number(price)
      console.log('calcPnlStatus', _price, PnlPrice)
      if (side > 0) {
        return Number(PnlPrice) > Number(_price) ? 1 : 2
      } else {
        return Number(PnlPrice) < Number(_price) ? 1 : 2
      }
    }

  return (
    <>
      {
        posiMode ? (
          <PlaceBtn fd={positionEffect === 1 ? 'row' : 'row-reverse'}>
            <Button scale={'md'} width='100%' mr={positionEffect === 1 ? '8px' : ''} onClick={() => placeOrder(1)} variant={userHabit?.upDownColor === "0" ? 'success' : 'danger'}>{positionEffect === 1 ? t('OpenLong') : t('CloseLong')}</Button>
            <Button scale={'md'} width='100%' mr={positionEffect === 2 ? '8px' : ''} onClick={() => placeOrder(-1)} variant={userHabit?.upDownColor === "0" ? 'danger' : 'success'}>{positionEffect === 1 ? t('OpenShort') : t('CloseShort')}</Button>
          </PlaceBtn>
        ) : (
          <PlaceBtn>
            {
              side > 0 ? (
                <Button scale={'md'} width='100%' onClick={() => placeOrder(1)} variant={userHabit?.upDownColor === "0" ? 'success' : 'danger'}>{positionEffect === 1 ? t('OpenLong') : t('CloseLong')}</Button>
              ) : (
                <Button scale={'md'} width='100%' onClick={() => placeOrder(-1)} variant={userHabit?.upDownColor === "0" ? 'danger' : 'success'}>{positionEffect === 1 ? t('OpenShort') : t('CloseShort')}</Button>
              )
            }
          </PlaceBtn>
        )
      }
    </>
  )
}

export default placeBtn;