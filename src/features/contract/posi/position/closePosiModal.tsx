import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Flex, Button, message, Modal, ModalProps, InputGroup, Input } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { uuid } from '../../../../utils/utils';
import { formatByPriceTick, round, toFix6 } from '../../../../utils/filters';
import { place } from '../../../../utils/common';
import { useAppSelector } from '../../../../store/hook';
import useUpDownColor from '../../../../hooks/useUpDownColor';
// import { useAppDispatch, useAppSelector } from "../../../../store/hook";
// import { updateModeType } from '../../../../store/modules/placeSlice';
// import { adjustMarginRate } from '../../../../services/api/contract';
// import { _shouldRestful } from '../../../../utils/tools';
const Big = require('big.js')
const ModeContent = styled.div`
  padding: 24px;
  padding-top: 0;
`

const Switch = styled(Flex)`
  width: 288px;
  height: 32px;
  background: #1F1830;
  border-radius: 4px;
  span.switch-item{
    cursor: pointer;
    flex: 1;
    height: 32px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 32px;
    text-align: center;
  }
  span.switch-index-item{
    background: #3F3755;
    color: #FFFFFF;
  }
`

const PriceAnPosiN = styled.div<{c?}>`
  font-size: 12px;
  font-weight: 500;
  color: #4A4062;
  line-height: 17px;
  margin-top: 16px;
  text-align: right;
  margin-bottom: 4px;
  span{
    color:${({c}) => c};
  }
`

const AddonBefore = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
`
const AddonAfter = styled.div`
  width: 48px;
  text-align: center;
  font-size: 12px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #FFFFFF;
  padding-left: 12px;
  line-height: 16px;
  border-left: 1px solid rgba(63, 55, 85, 1);
`

const PricePercent = styled(Flex)`
  margin-top: 4px;
  span{
    display:inline-block;
    flex: 1;
    background: #1F1830;
    border-radius: 4px;
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #4A4062;
    line-height: 24px;
    margin-right: 4px;
    text-align: center;
    opacity: 1;
    cursor: pointer;
    &:hover{
      color: #615976;
      outline: 1px solid #3F3755;
      background: #1F1830;
    }
  }
  span:nth-last-child(1) {
    margin-right: 0;
  }
`

const ClosePnl = styled(Flex)`
  justify-content: center;
  width: 288px;
  height: 40px;
  background: #130F1D;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #615976;
  line-height: 40px;
  margin-top: 16px;
  span{
    color: ${({c}) => c};
  }
`

const CreateBtns = styled(Flex)`
  padding-top: 24px;
`

const CancelBtn = styled(Button)`
  flex: 1;
  margin-right: ${({mr}) => mr};
`
const SaveBtn = styled(CancelBtn)`
`

const MarketPrice = styled(Flex)`
  cursor: pointer;
  height: 40px;
  background: #1F1830;
  border-radius: 4px;
  padding: 0 16px;
  span.label{
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
  span.market-price{
    flex: 1;
    font-size: 12px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 17px;
    text-align: right;
    padding-right: 12px;
  }

  span.symbol{
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 15px;
    padding-left: 12px;
    border-left: 1px solid #4A4062;
  }
`

const closePosiModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const [priceType, setPriceType] = useState(1)
  const [adjustMarginRateUuid, setAjustMarginRateUuid] = useState(uuid())
  const [price, setPrice] = useState<number|string>('')
  const [count, setCount] = useState<number|string>('')
  const [isLoading, setIsLoading] = useState(false)
  const contractList = useAppSelector(state => state.contract.allContractList)
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();

  const contractItem = useRef<{
    contractSide?;
    commodityName?;
    currencyName?;
  }>({})

  // const [contractItem, setContractItem] = useState({})
  const countPercent = [0.2, 0.4, 0.6, 0.8, 1]
  // const dispatch = useAppDispatch()

  const changeModeType = (v:number):void => {
    setPriceType(v)
  }
  useEffect(() => {
    contractItem.current = contractList.find(e=>e.contractId === props.posi.contractId)
  }, [])
  const confirm = ():void => {
    
  }

  const handlePriceChange = (v):void => {
    setPrice(v?.target?.value)
  }
  const handleCountChange = (v):void => {
    setCount(v?.target?.value)
  }

  const setPercentCount = (v:number):void => {
    setCount(Number(new Big(Math.abs(props.posi?.fairQty) || 0).times(v).round(0, 0).toString()))
  }

  // 平仓预计盈亏
  const closeFuture = () => {
    if (!count || !(priceType === 3 || price)) {
      return '--'
    }
    let side = props.posi.side // 方向，1为买，-1为卖
    let openPrice = props.posi.openPrice
    let amount = count
    let type = priceType
    let final = 0
    let p = type === 1 ? price : props.posi?.lastPrice
    let contractSide = props.posi.contractSide
    let contractUnit = props.posi.contractUnit
    // 对于正向合约来说： 平仓数量 * 持仓方向 * （平仓价格-开仓均价）
    // 对于反向合约来说： 平仓数量 * 持仓方向 * （1/开仓均价 - 1/平仓价格 ）
    if (!contractSide) return '--'
    if (contractSide === 1) {
      // 正向

      if (p !== 0 && p !== '' && amount !== 0 && amount !== '') {
        final = new Big(amount).times(side).times(new Big(p).sub(openPrice)).times(contractUnit)
      }
    } else {
      // 反向

      if (p !== 0 && p !== '' && amount !== 0 && amount !== '') {
        final = new Big(amount)
          .times(side)
          .times(new Big(1).div(openPrice).sub(new Big(1).div(p)))
          .times(contractUnit)
      }
    }
    const _d = contractItem.current?.contractSide === 1 ? 2 : 6
    return final > 0 ? `+${toFix6(final, _d)}` : `${toFix6(final, _d)}`
  }

  const close = () => {
    onDismiss()
  }

  const closePosi = () => {
    setIsLoading(true)
    let qs = {
      gearingxie: 100, //杠杆 平仓用不到
      contractId: props.posi.contractId, //合约ID
      side: -props.posi.side, // 买卖方向 买1，卖-1
      type: priceType, //价格类型 1（限价），3（市价）
      quantity: count, //数量
      positionEffect: 2, //开平方向 开仓1，平仓2
      orderSubType: 0, //0（默认值），1（被动委托），2（最近价触发条件委托），3（指数触发条件委托），4（标记价触发条件委托）
      // stopPrice: '', //触发价格
      price: priceType ? price : 0, //委托价格
    }

    place(qs, closePosSuccess, closePosFail, t('OrderedSuccessfully'))
    // place(qs, closePosSuccess, closePosFail, I18n.t('OrderSucceed'))

    onDismiss()
  }

  const closePosSuccess = tips => {
    message.success(tips)
    setPrice('')
    setCount('')
    setIsLoading(false)
    onDismiss()
    // this.setState({ price: '', quantity: '', loading: false })
  }

  const closePosFail = () => {
    setIsLoading(false)
    onDismiss()
  }

  const renderClosePnl = () => {
    const _closePnl = closeFuture()
    return (
      <>
        <ClosePnl c={Number(_closePnl) < 0 ? colorDown : Number(_closePnl) > 0 ? colorUp : ''}>
          {t('unrealizedProfitLoss')}: <span>{_closePnl}</span> {contractItem.current?.currencyName}
        </ClosePnl>
      </>
    )
  }

  const { t } = useTranslation()
  return (
    <Modal title={t('Close')} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      <ModeContent>
        <Switch>
          <span className={`switch-item ${priceType === 1 ? 'switch-index-item' : ''}`} onClick={() => changeModeType(1)}>{t('limit')}</span>
          <span className={`switch-item ${priceType === 3 ? 'switch-index-item' : ''}`} onClick={() => changeModeType(3)}>{t('market')}</span>
        </Switch>
        <PriceAnPosiN c={'#fff'}>
          {t('StopLast')}: {props.posi?.lastPrice} {contractItem.current?.contractSide === 2 ? contractItem.current?.commodityName : contractItem.current?.currencyName}
        </PriceAnPosiN>
        {
          priceType === 1 ? (
            <InputGroup
              isDark={true}
              startIcon={<AddonBefore>{t('holdPosiPrice')}:</AddonBefore>}
              // hasClear={value != ''}
              ta={'right'}
              scale={'md'}
              endIcon={<AddonAfter>{contractItem.current?.contractSide === 2 ? contractItem.current?.commodityName : contractItem.current?.currencyName}</AddonAfter>}
            >
              <Input scale={'md'} type="number" value={price} onChange={handlePriceChange} isDark={true} />
            </InputGroup>
          ) : (
            <MarketPrice>
              <span className="label">{t('OrderPrice')}:</span>
              <span className="market-price">{t('MarketClose')}</span>
              <span className="symbol">{contractItem.current?.currencyName}</span>
            </MarketPrice>
          )
        }
        <PriceAnPosiN c={'#fff'}>
          {t('FairQuantity')}: {Math.abs(props.posi?.fairQty)} {t('Cont')}
        </PriceAnPosiN>
        <InputGroup
          isDark={true}
          startIcon={<AddonBefore>{t('holdPosiAmount')}:</AddonBefore>}
          // hasClear={value != ''}
          ta={'right'}
          scale={'md'}
          endIcon={<AddonAfter>{t('Cont')}</AddonAfter>}
        >
          <Input scale={'md'} type="number" value={count} onChange={handleCountChange} isDark={true} />
        </InputGroup>
        <PricePercent>
          {
            countPercent.map((e, i) => {
              return (
                <span key={i} onClick={() => setPercentCount(e)}>{e * 100}%</span>
              )
            })
          }
        </PricePercent>
        {renderClosePnl()}
        <CreateBtns>
          <CancelBtn variant={'secondary'} scale={'md'} isDark={true} mr={'8px'} onClick={close}>{t('Cancel')}</CancelBtn>
          <SaveBtn variant={'primary'} scale={'md'} isDark={true} onClick={() => closePosi()} isLoading={isLoading}>{t('ConfirmB')}</SaveBtn>
        </CreateBtns>
        {/* <Button width='100%' variant={'primary'} onClick={confirm}>确定</Button> */}
      </ModeContent>
    </Modal>
  )
}

export default closePosiModal;