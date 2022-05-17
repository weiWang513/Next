import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, ModalProps, Button, Tooltip } from '@ccfoxweb/uikit'
import { queryUserProfitLossList } from "../../../../services/api/contract";
import { toFix6 } from '../../../../utils/filters'
import { useTranslation } from "next-i18next";
import { hostReplace } from "../../../../utils/utils";
const Big = require('big.js')

const ModalContent = styled.div`
  width: 100%;
  padding-bottom: 24px;
`
const AvailRow = styled.div`
  display: flex;
  & > aside {
    flex: 1;
    height: 84px;
    background: #1F1830;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & + aside {
      margin-left: 8px;
    }
    span {
      font-size: 12px;
      font-weight: 500;
      color: #615976;
      line-height: 16px;
    }
    section {
      padding: 8px 0 4px;
      font-size: 16px;
      font-family: DINPro-Bold;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 20px;
    }
  }
`
const InfoList = styled.div`
  padding-top: 16px;
  & > li {
    height: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & + li {
      margin-top: 4px;
    }
    .label-text {
      font-size: 12px;
      font-weight: 500;
      color: #615976;
    }
    .value-text {
      height: 100%;
      display: flex;
      font-size: 12px;
      font-family: DINPro-Bold;
      font-weight: bold;
      color: #FFFFFF;
      &.color-green {
        color: #14AF81;
      }
      &.color-red {
        color: #EC516D;
      }
    }
  }
`
const BtnRow = styled.section`
  margin-top: 16px;
  display: flex;
  & > button {
    flex: 1;
    & + button {
      margin-left: 8px;
    }
  }
`

const AssetModal: React.FC<ModalProps> = ({ contractItem, accountList, infoObj, riskRate, onDismiss, openTransfer, ...props }) => {
  const [yesterdayCloseProfitLoss, setYesterdayCloseProfitLoss] = useState(0)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    _queryUserProfitLossList()
  }, [])

  const _queryUserProfitLossList = () => {
    setLoading(true)
    //当日盈亏
    let qs = {
      pageSize: 10,
      currencyId: contractItem.currencyId,
    }
    queryUserProfitLossList(qs).then(res => {
      if (res.data.code === 0) {
        let yesterdayCloseProfitLoss = res.data.data.list[0] ? res.data.data.list[0].closeProfitLoss : 0
        setYesterdayCloseProfitLoss(yesterdayCloseProfitLoss)
      }
      setLoading(false)
    })
  }

  const currentRealizedProfitLoss = () => {
    let res = 0
    let currencyId = contractItem.currencyId
    let item = accountList.find(el => el.currencyId === currencyId)
    if (item) {
      res =
        toFix6(
          new Big(item.closeProfitLoss ? new Big(item.closeProfitLoss).toFixed(10) : 0)
            .sub(new Big(yesterdayCloseProfitLoss).toFixed(10))
            .toString()
        ) || 0
    }

    return loading ? 0 : res
  }

  return (
    <Modal title={t("ContractAssetInfo")} isDark={true} width={"330px"} onDismiss={onDismiss} {...props}>
      <ModalContent>
        <AvailRow>
          <aside>
            <Tooltip text={t("marginBalance")}>
              <span>{t("WalletBalance")}</span>
            </Tooltip>
            <section>{infoObj?.accountRights}</section>
            <span>{contractItem.currencyName || '--'}</span>
          </aside>
          <aside>
            <Tooltip text={t("marginUse")}>
              <span>{t("AvailableBalance")}</span>
            </Tooltip>
            <section>{infoObj?.available}</section>
            <span>{contractItem.currencyName || '--'}</span>
          </aside>
        </AvailRow>
        <InfoList>
          <li>
            <Tooltip text={t("flashReal")}>
              <span className="label-text">{t("TodayPL")}</span>
            </Tooltip>
            <div className={`value-text ${currentRealizedProfitLoss() > 0 ? 'color-green' : 'color-red'}`}>
              {currentRealizedProfitLoss() > 0 ? '+' : ''}
              {currentRealizedProfitLoss()}
            </div>
          </li>
          <li>
            <Tooltip text={t("marginUnreal")}>
              <span className="label-text">{t("UnrealizedPL")}</span>
            </Tooltip>
            <div className={`value-text ${infoObj?.unrealizedProfitLoss > 0 ? 'color-green' : 'color-red'}`}>
              {infoObj?.unrealizedProfitLoss > 0 ? '+' : ''}
              {infoObj?.unrealizedProfitLoss}
            </div>
          </li>
          <li>
            <Tooltip text={t("MarginRationMsg")}>
              <span className="label-text">{t("marginPertectRate")}</span>
            </Tooltip>
            <div className="value-text">{riskRate}%</div>
          </li>
          <li>
            <Tooltip text={t("marginPosi")}>
              <span className="label-text">{t("PositionMargin")}</span>
            </Tooltip>
            <div className="value-text">{infoObj?.initMargin}</div>
          </li>
          <li>
            <Tooltip text={t("marginEntrust")}>
              <span className="label-text">{t("OrderMargin")}</span>
            </Tooltip>
            <div className="value-text">{infoObj?.frozenForTrade}</div>
          </li>
          <li>
            <Tooltip text={t("marginAll")}>
              <span className="label-text">{t("TotalLeverageLevel")}</span>
            </Tooltip>
            <div className="value-text">{infoObj?.leverLevel}x</div>
          </li>
        </InfoList>
        <BtnRow>
          <Button
            variant={'secondary'}
            isDark={true}
            scale={'sm'}
            onClick={() => window.location.href = `https://${hostReplace()}/user/assets/recharge`}
          >{t("RechargeCoin")}</Button>
          <Button
            variant={'secondary'}
            isDark={true}
            scale={'sm'}
            onClick={() => openTransfer()}
          >{t("TransferBtn")}</Button>
        </BtnRow>
      </ModalContent>
    </Modal>
  )
}

export default AssetModal