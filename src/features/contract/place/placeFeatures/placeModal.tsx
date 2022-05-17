import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getTriggerSymbol, place } from '../../../../utils/common';
import { uuid } from '../../../../utils/utils';
import { updateCostBuy, updateCostSell, updateCount, updateLossInput, updatePercent, updatePrice, updateProfitInput, updateStopPrice } from '../../../../store/modules/placeSlice';
import { round, toFix6 } from '../../../../utils/filters';
import useUpDownColor from '../../../../hooks/useUpDownColor';

const ConfirmContent = styled.div`
  // height: 249px;
  width: 100%;
`

const SymbolW = styled(Flex)`
  height: 40px;
  span.symbol{
    display: flex;
    font-size: 16px;
    font-weight: bold;
    margin-right: 4px;
    color: #fff;
  }
  span.side{
    display: flex;
    background: ${({bgcB}) => bgcB};
    border-radius: 9px;
    padding: 2px 6px;
    margin-right: 4px;
    span{
      font-size: 10px;
      font-weight: 500;
      color: ${({c}) => c};
    }
  }
  span.lever{
    display: flex;
    background: #3F3755;
    border-radius: 9px;
    padding: 2px 6px;
    span{
      font-size: 10px;
      font-weight: 500;
      color: #FFFFFF;
    }
  }
`
const InfoItem = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  span.l{
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
  span.r{
    font-size: 12px;
    color: #615976;
    line-height: 15px;
    span.v{
      font-weight: bold;
      color: #FFFFFF;
      margin-right: 2px;
    }
  }
`

const StopPNL = styled(Flex)`
  width: 288px;
  height: 58px;
  background: #1F1830;
  border-radius: 8px;
  margin-top: 12px;
`

const StopPNLI = styled(Flex)`
  height: 38px;
  flex : 1;
  flex-direction: column;
  span.p{
    font-size: 14px;
    font-weight: bold;
    color: #14AF81;
    line-height: 17px;
  }
  span.l{
    font-size: 14px;
    font-weight: bold;
    color: #EC516D;
    line-height: 17px;
  }
  span.label{
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
`

const StopPNLIL = styled(StopPNLI)`
  border-right: 1px solid #181226;
`

const BtnW = styled(Flex)`
  justify-content: space-between;
  margin: 24px 0;
`

const ConfirmContentTips = styled.div`
  width: 336px;
  padding: 20px 24px;
  background: rgba(31, 24, 48, 1);
  border-radius: 0px 0px 16px 16px;
  span{
    font-size: 12px;
    color: #615976;
  }
  span.t{
    font-size: 12px;
    color: #615976;
  }
  span.sub-t{
    font-size: 12px;
    font-weight: 600;
    color: #fff;
  }
`
const NoPNL = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  width: 288px;
  height: 58px;
  background: #1F1830;
  border-radius: 8px;
  margin-top: 12px;
  span.t{
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 18px;
  }
  span.s-t{
    font-size: 12px;
    font-weight: 500;
    color: #3F3755;
    line-height: 17px;
  }
`

const CustomModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const lever = useAppSelector(state => state.place.lever)
  const contractId = useAppSelector(state => state.contract.contractId)
  const snapshot = useAppSelector(state => state.contract.snapshot)
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
  const modeType = useAppSelector(state => state.place.modeType)
  const contractItem = useAppSelector(state => state.contract.contractItem)
  
  const commissionValueBuy = useAppSelector(state => state.place.commissionValueBuy)
  const commissionValueSell = useAppSelector(state => state.place.commissionValueSell)
  const costBuy = useAppSelector(state => state.place.costBuy)
  const costSell = useAppSelector(state => state.place.costSell)
  const posiMode = useAppSelector(state => state.place.posiMode)
  const setSP = useAppSelector(state => state.place.setSP)
  const setSL = useAppSelector(state => state.place.setSL)
  const profitInput = useAppSelector(state => state.place.profitInput)
  const lossInput = useAppSelector(state => state.place.lossInput)
  const closeFlag = useAppSelector(state => state.place.closeFlag)
  const profitStopType = useAppSelector(state => state.place.profitStopType)
  const lossStopType = useAppSelector(state => state.place.lossStopType)
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();
  const [loading, setLoading] = useState(false)

  const getPlaceSide = () => {
    console.log(side, positionEffect, 'positionEffect')
    switch (side) {
      case 1:
        switch (positionEffect) {
          case 1:
            return t('OpenLong')
          case 2:
            return t('CloseLong')
          default:
            break;
        }
        break;
      case -1:
        switch (positionEffect) {
          case 1:
            return t('OpenShort')
          case 2:
            return t('CloseShort')
          default:
            break;
        }
        break;
    
      default:
        break;
    }
  }

  const cancel = (f):void => {
    f()
  }

  useEffect(() => {
    console.log('costBuy', costBuy, lever)
  }, [costBuy])

  const confirm = (f):void => {
    let _uuid = uuid()
    setLoading(true)
    const params = {
      gearingxie: lever,
      contractId,
      side: side,
      type: priceType,
      quantity: side > 0 ? qtyBuy : qtySell,
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
    console.log(params, 'placeOrder')
    place(params, () => callback(_uuid), fail, '')
  }

  const callback = (_uuid) => {
    setLoading(false)
    // message.success(i18n.t('OrderSucceed'), 1.5)
    message.success(t('OrderedSuccessfully'), 1.5)
    
    setPnl(_uuid, side)
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
    onDismiss()
    // setLoading(false)
  }
  const fail = () => {
    setLoading(false)
  }

  /**
   * 判断价格，下单是否会立即成交
   * @param {下单价格} v
   * @param {方向} side
   */
  const priceIsOver = (v, side) => {
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

  const setPnl = (_uuid, side) => {
    if (profitInput && setSP) {
      let params = {
        modeType: modeType,
        // gearingxie:
        //   modeType === 1
        //     ? crossLever // leverTypes[leverTypes.length - 1].value
        //     : leverType,
        gearingxie: lever,
        contractId: contractId,
        side: side * -1,
        type: 3,
        quantity: side > 0 ? qtyBuy : qtySell,
        positionEffect: 2,
        // price: 3 === 1 ? profitInput : 0,
        price: 0,
        stopPrice: profitInput,
        orderSubType: profitStopType,
        hasReady: priceType === 3 || priceIsOver(price, side) ? true : false,
        conditionOrderType: calcPnlStatus(profitInput, side), //1,
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
        side: side * -1,
        type: 3,
        quantity: side > 0 ? qtyBuy : qtySell,
        positionEffect: 2,
        // price: 3 === 1 ? lossInput : 0,
        price: 0,
        stopPrice: lossInput,
        orderSubType: lossStopType,
        hasReady: priceType === 3 || priceIsOver(price, side) ? true : false,
        conditionOrderType: calcPnlStatus(lossInput, side), // 2
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

  const getStopPriceType = (v:number):string => {
    switch (v) {
      case 2:
        return t('StopLast')
      case 3:
        return t('StopIndex')
      case 4:
        return t('StopMark')
    
      default:
        break;
    }
  }

  return (
    <Modal title={title} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      <ConfirmContent>
        <SymbolW bgcB={side > 0 ? orderUpColorArea : orderDownColorArea} c={side > 0 ? colorUp : colorDown}>
          <span className="symbol">{contractItem?.symbol}</span>
          <span className="side">
            <span>{getPlaceSide()}</span>
          </span>
          <span className="lever">
            <span>{modeType === 1 ? t('FullPosition') : t('isolated')} / {lever}x</span>
          </span>
        </SymbolW>
        <InfoItem>
          <span className="l">{t('OrderPrice')}</span>
          {
            priceType === 3 ? (
              <span className="r">
                {t('market')}
              </span>
            ) : (
              <span className="r">
                <span className="v">{price}</span> {contractItem?.contractSide === 1 ? contractItem?.currencyName : contractItem?.commodityName}
              </span>
            )
          }
        </InfoItem>
        <InfoItem>
          <span className="l">{t('Qty')}:</span>
          <span className="r">
            <span className="v">{side > 0 ? qtyBuy : qtySell}</span> {t('Cont')}
          </span>
        </InfoItem>
        {
          positionEffect === 1 && <InfoItem>
            <span className="l">{t('Cost')}:</span>
            <span className="r">
              <span className="v">{toFix6(side > 0 ? costBuy : costSell, contractItem?.contractSide === 1 ? 2 : 6) }</span> {contractItem?.currencyName}
            </span>
          </InfoItem>
        }
        {priceTypeTab === 4 && <InfoItem>
          <span className="l">{t('StopCondition')}:</span>
          <span className="r">
            <span className="v">{ getTriggerSymbol(snapshot, stopPrice, stopPriceType) }</span> {contractItem?.contractSide === 1 ? contractItem?.currencyName : contractItem?.commodityName}
          </span>
        </InfoItem>}
        {
          <>
            {
              positionEffect === 1 && priceTypeTab < 4 && <>
                {
                  setSL || setSP ? (
                    <StopPNL>
                      <StopPNLIL>
                        <span className="p">{profitInput || t('NotSet')}</span>
                        <span className="label">{t('stopProfit')}[{getStopPriceType(profitStopType)}]</span>
                      </StopPNLIL>
                      <StopPNLI>
                        <span className="l">{lossInput || t('NotSet')}</span>
                        <span className="label">{t('stopLoss')}[{getStopPriceType(lossStopType)}]</span>
                      </StopPNLI>
                    </StopPNL>
                  ) : (
                    <NoPNL>
                      <span className="t">{t('NotSetPnL')}</span>
                      <span className="s-t">{t('SetInPosi')}</span>
                    </NoPNL>
                  )
                }
              </>
            }
          </>
          
        }
        <BtnW>
          <Button width='47%' variant={'secondary'} onClick={() => cancel(onDismiss)} isDark={true}>{t('Cancel')}</Button>
          <Button width='47%' variant={'primary'} isLoading={loading} onClick={confirm}>{t('ConfirmB')}</Button>
        </BtnW>
      </ConfirmContent>
      {
        posiMode ? <ConfirmContentTips>
          <span className="sub-t">[{t('TwoWayPosition')}]：</span>
          <span className='t'>{t('TwoWayPositionTips')}</span>
        </ConfirmContentTips> : <ConfirmContentTips>
          <span className="sub-t">[{t('SingleSide')}]：</span>
          <span className='t'>{t('SingleSideTips')}</span>
        </ConfirmContentTips>
      }
      
    </Modal>
  )
}

export default CustomModal
