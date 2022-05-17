import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, InputGroup, Slider, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateLever, updateModeType } from '../../../../store/modules/placeSlice';
import { ReactComponent as Minus } from "/public/images/SVG/minus.svg";
import { ReactComponent as Plus } from "/public/images/SVG/plus.svg";
import { ReactComponent as LeverTips } from "/public/images/SVG/leverTip.svg";
import { ReactComponent as LeverWarn } from "/public/images/SVG/leverWarn.svg";
import { adjustMargin, adjustMarginRate } from '../../../../services/api/contract';
import { uuid } from '../../../../utils/utils';
import { savePlaceParams } from '../../../../utils/common';
import { _shouldRestful } from '../../../../utils/tools';
import { formatAmount, formatByPriceTick, toFix6 } from '../../../../utils/filters';
const Big = require('big.js')

const ModeContent = styled.div`
  padding-top: 0;
  padding-bottom: 24px;
`
const AddonBefore = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  line-height: 17px;
`;

const AddonAfter = styled(Flex)`
  // width: 106px;
  height: 16px;
  padding-left: 12px;
  border-left: 1px solid rgba(63, 55, 85, 1);
  span.symbol{
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFFFF;
    margin-right: 12px;
  }
  span.all-in{
    width: 40px;
    height: 20px;
    background: #3F3755;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
  }

`

const Switch = styled(Flex)`
  width: 288px;
  height: 32px;
  background: #1F1830;
  border-radius: 4px;
  margin-bottom: 24px;
  span.switch-item{
    flex: 1;
    height: 32px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
  span.switch-index-item{
    background: #3F3755;
    color: #FFFFFF;
  }
`

const UClosePrice = styled(Flex)`
  justify-content: center;
  margin-top: 12px;
  width: 288px;
  height: 48px;
  background: #1F1830;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  text-align: center;
  span {
    color: #fff;
  }
`

const Max = styled(Flex)`
  width: 288px;
  height: 40px;
  background: #1F1830;
  border-radius: 4px;
  justify-content: space-between;
  padding: 0 12px;
  margin-top: 12px;
`

const MaxN = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  span.n{
    color: #fff;
  }
`
const AllIn = styled.div`
  width: 40px;
  height: 20px;
  background: #3F3755;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  opacity: 0.6;
  &:hover{
    opacity: 1;
  }
`

const ajustMarginModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const contractList = useAppSelector(state => state.contract.contractList)
  const accountList = useAppSelector(state => state.assets.accountList)
  const [marginN, setMarginN] = useState('')
  const [addFlag, setAddFlag] = useState(1)
  const { t } = useTranslation()
  const [adjustUuid, setAdjustUuid] = useState(uuid())
  const [submiting, setSubmiting] = useState(false)
  const [contractItem, setContractItem] = useState<{currencyName?;contractSide?;commodityName?;}>({})
  const dispatch = useAppDispatch()

  const confirm = ():void => {
    setSubmiting(true)
    setTimeout(() => setSubmiting(false), 7000)

    let qs = {
      contractId: props.posi.contractId,
      margin: '',
      posiSide: props.posi.posiSide,
    }

    // 判断是增加还是减少保证金
    if (addFlag === 1) {
      // 如果增加的保证金大于可用余额 ，提示错误信息
      if (parseFloat(marginN) > parseFloat(getAvail())) {
        message.error(`${t('IncreaseMarginA')}`)
        setSubmiting(false)
        return
      }

      qs.margin = marginN.toString()
    } else {
      // 如果减少的保证金大于最大可减少保证金，提示错误信息
      if (parseFloat(marginN) > parseFloat(props.posi.extraMargin)) {
        message.error(`${t('ReduceMarginA')}`)
        setSubmiting(false)
        return
      }

      qs.margin = (-marginN).toString()
    }
    // this.loadingShow()
    adjustMargin({
      params: qs,
      headers: { unique: adjustUuid },
    })
      .then(res => {
        setAdjustUuid(uuid())
        setMarginN('')
        setSubmiting(false)
        if (res.data.code === 0) {
          message.success(`${t('AdjustmentSucceed')}`)
          _shouldRestful()
          onDismiss()
          // props.close()
        }
      })
      .catch(err => {
        setAdjustUuid(uuid())
        setSubmiting(false)
      })
  } 
  useEffect(() => {
    let _contractItem = contractList.find(e=>e.contractId === props?.posi?.contractId)
    console.log('_contractItem', _contractItem)
    setContractItem(_contractItem)
  }, [])

  const renderAddonAfter = () => {
    return (
      <AddonAfter>
        <span className="symbol">{contractItem?.currencyName}</span>
        {/* <span className="all-in">{t('All')}</span> */}
      </AddonAfter>
    )
  }

  const getAvail = () => {
    let item = accountList.find(el => el.currencyId === props?.posi?.currencyId)
    return item ? toFix6(item.available, contractItem?.contractSide === 1 ? 2 : 6) : 0
  }

  const _maxAmt = () => {
    console.log('props.posi.extraMargin', props.posi.extraMargin)
    return addFlag === 1 ? getAvail() : toFix6(props.posi.extraMargin, contractItem?.contractSide === 1 ? 2 : 6)
  }

  const handelAll = () => {
    let _max = _maxAmt()
    setMarginN(_max)
  }

  const calcStrongPrice = () => {
    // 持仓记录为逐仓，marginType=2时：强平价=开仓价- 持仓方向 *  { ( initMargin+extraMargin ) / ( abs(持仓数量)*合约单位 )- maintainMarginRate * 开仓价  }
    let price = '--'
    let item = props.posi
    let openPrice = item.openPrice
    let posiQty = item.posiQty
    let side = item.side
    let initMargin = item.initMargin
    let extraMargin = item.extraMargin
    let maintainMarginRate = item.maintainMarginRate
    let contractItem = contractList.find(el => el.contractId === item.contractId)
    let contractUnit = contractItem ? contractItem.contractUnit : 1
    let contractSide = contractItem ? contractItem.contractSide : 1

    let finalExtra = 0

    if (!openPrice || !side || !initMargin || !extraMargin || !maintainMarginRate || !contractUnit || !posiQty)
      return '--'

    if (addFlag === 1) {
      let addMargin = Number(marginN) || 0
      finalExtra = new Big(addMargin).plus(extraMargin)
    } else {
      let subMargin = Number(marginN) || 0
      finalExtra = new Big(extraMargin).sub(subMargin)
    }

    if (Number(finalExtra) < 0) return '--'

    // let entrustValue =
    //   contractSide === 1
    //     ? new Big(posiQty).abs().times(contractUnit).times(openPrice).toString()
    //     : new Big(posiQty).abs().times(contractUnit).div(openPrice).toString()

    // price =
    //   contractSide === 1
    //     ? new Big(openPrice)
    //         .sub(
    //           new Big(side).times(
    //             new Big(0)
    //               .plus(new Big(entrustValue).div(lever))
    //               .div(posiQty)
    //               .div(contractUnit)
    //               .sub(new Big(openPrice).times(finalExtra))
    //           )
    //         )
    //         .toString()
    //     : // （方向*开仓价）/（杠杆倍数的倒数-最低维持保证金率+方向）
    //       new Big(openPrice).times(side).div(new Big(1).div(lever).sub(finalExtra).plus(side)).toString()

    price =
      contractSide === 1
        ? new Big(openPrice)
            .sub(
              new Big(side).times(
                new Big(initMargin)
                  .plus(finalExtra)
                  .div(new Big(posiQty).abs().times(contractUnit))
                  .sub(new Big(maintainMarginRate).times(openPrice))
              )
            )
            .toString()
        : // 强平价= abs(持仓数量)*合约单位*开仓价 / { 合约单位*abs(持仓数量)* (1-持仓数量的方向*maintainMarginRate) + 持仓数量的方向*开仓价*(initMargin+extraMargin) }
          new Big(posiQty)
            .abs()
            .times(contractUnit)
            .times(openPrice)
            .div(
              new Big(contractUnit)
                .times(posiQty)
                .abs()
                .times(new Big(1).sub(new Big(side).times(maintainMarginRate)))
                .plus(new Big(side).times(openPrice).times(new Big(initMargin).plus(finalExtra)))
            )
            .toString()

    price = formatByPriceTick(price, item.contractId)

    return Number(price) < 0 ? 0 : ` ${price} `
  }

  const handleChange = (e):void =>{
    let _n = formatAmount(e.target.value, marginN)
    setMarginN(_n)
  }

  const btnDisabled = () => {
    return !marginN
  }
  
  return (
    <Modal title={t('ModifyMargin')} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      {
        console.log('render')
      }
      <ModeContent>
        <Switch>
          <span className={`switch-item ${addFlag === 1 ? 'switch-index-item' : ''}`} onClick={() => setAddFlag(1)}>{t('Add')}</span>
          <span className={`switch-item ${addFlag === -1 ? 'switch-index-item' : ''}`} onClick={() => setAddFlag(-1)}>{t('Reduc')}</span>
        </Switch>
        <InputGroup
          isDark={true}
          startIcon={<AddonBefore>{addFlag > 0 ? t('AddMargin') : t('ReductionMargin')}</AddonBefore>}
          // hasClear={value != ''}
          endIcon={renderAddonAfter()}
          ta={"right"}
        >
          <Input scale={'md'} type="text" value={marginN} onChange={handleChange} isDark={true} />
        </InputGroup>
        <Max>
          <MaxN>
            {addFlag > 0 ? t('MaxAdd') : t('MaxRedu')}: <span className="n">{_maxAmt()}</span>
          </MaxN>
          <AllIn onClick={() => handelAll()}>{t('All')}</AllIn>
          {/* <Button variant={'secondary'} scale={'xs'} isDark={true} onClick={() => handelAll()}>
            {t('All')}
          </Button> */}
        </Max>
        <UClosePrice>
          {t('LiqPriceC')}: <span>{calcStrongPrice()}</span> {contractItem?.contractSide === 1 ? contractItem.currencyName : contractItem?.commodityName} 
        </UClosePrice>
        <Button width='100%' variant={'primary'} loading={submiting} onClick={confirm} mt='24px' isDark={true} disabled={btnDisabled()}>{t('ConfirmB')}</Button>
      </ModeContent>
    </Modal>
  )
}

export default ajustMarginModal;