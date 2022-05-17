import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useModal, Button, Tooltip } from "@ccfoxweb/uikit";
import { ReactComponent as MoreIcon } from "/public/images/SVG/asset-more.svg";
import { ReactComponent as DropArr } from "/public/images/SVG/dropArr.svg";
import AssetModal from "./assetModal";
import TransferModal from "./transferModal";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../../store/hook";
import { toFix6 } from '../../../../utils/filters'
import { calcRiskRate, getDecimal } from '../../../../utils/common'
import { hostReplace } from "../../../../utils/utils";

const AssetWarp = styled.div`
  margin: 16px;
  border-top: 1px solid #1F1830;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
`
const AssetHeader = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > span {
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
  }
  & > svg {
    cursor: pointer;
  }
`
const InfoList = styled.ul<{h?;ov?;}>`
  height: ${({h}) => `${h}px`};
  overflow: hidden;
  transition: height 0.3s ease-in-out;
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

const IconWarp = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

const Rotate = styled.div<{deg?}>`
  transform: ${({deg})=> `rotate(${deg || 0}deg)`};
  transition: all 0.3s ease-in-out;
`


const AssetInfo = () => {
  const [infoObj, setInfoObj] = useState({})
  const [riskRate, setRiskRate] = useState(0)
  
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const contractList = useAppSelector((state) => state.contract.contractList);
  const currencyList = useAppSelector((state) => state.contract.currencyList);
  const accountList = useAppSelector((state) => state.assets.accountList);
  const posListProps = useAppSelector((state) => state.assets.posListProps);
  const setSP = useAppSelector((state) => state.place.setSP);
  const setSL = useAppSelector((state) => state.place.setSL);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const [droped, setDroped] = useState(false)
  const { t } = useTranslation()
  const [openTransferModal] = useModal(
    <TransferModal
      contractItem={contractItem}
      currencyList={currencyList}
      isLogin={isLogin}
    />,
    true, 
    true, 
    'TransferModal'
  )
  const [openAssetModal] = useModal(
    <AssetModal
      contractItem={contractItem}
      accountList={accountList}
      infoObj={infoObj}
      riskRate={riskRate}
      openTransfer={() => openTransferModal()}
    />,
    true, 
    true, 
    'AssetModal'
  )

  useEffect(() => {
    let _riskRate = toFix6(
      calcRiskRate(contractItem, contractList, accountList, posListProps)
    )
    setRiskRate(_riskRate)
  }, [contractItem, contractList, accountList, posListProps])

  useEffect(() => {
    if (setSP && setSL) {
      setDroped(true)
    } else {
      setDroped(false)
    }
  }, [setSP, setSL])

  useEffect(() => {
    let obj = {
      totalBalance: 0,
      marginBalance: 0,
      available: 0,
      unrealizedProfitLoss: 0,
      initMargin: 0,
      frozenForTrade: 0,
      leverLevel: 0,
      accountRights: 0,
    }
    let currencyId = contractItem.currencyId
    let item = accountList.find(el => el.currencyId === currencyId)
    if (!item || !isLogin) {
      setInfoObj(obj)
    } else {
      const _d = getDecimal()
      obj = {
        totalBalance: toFix6(item.totalBalance) || 0,
        marginBalance: toFix6(item.marginBalance) || 0,
        available: item.available > 0 ? toFix6(item.available) : 0,
        unrealizedProfitLoss: toFix6(item.unrealizedProfitLoss, _d) || 0,
        initMargin: toFix6(item.initMargin) || 0,
        frozenForTrade: toFix6(item.frozenForTrade) || 0,
        leverLevel: toFix6(item.leverLevel) || 0,
        accountRights: toFix6(Number(item.totalBalance) + Number(item.unrealizedProfitLoss || 0), _d),
      }
      setInfoObj(obj)
    }
  }, [contractItem, accountList, isLogin])

  return (
    <AssetWarp>
      <AssetHeader>
        <span>{t("ContractAssetInfo")}</span>
        <IconWarp>
          <MoreIcon onClick={() => openAssetModal()} />
          <Rotate deg={droped ? 0 : 180}>
            <DropArr onClick={() => setDroped(!droped)}/>
          </Rotate>
        </IconWarp>
      </AssetHeader>
      <InfoList h={droped ? 0 : 56} ov={droped ? 'hidden' : 'visible'}>
        <li>
          <Tooltip text={t("marginBalance")}>
            <span className="label-text">{t("WalletBalance")}({contractItem.currencyName || '--'})</span>
          </Tooltip>
          <div className="value-text">{infoObj?.accountRights}</div>
        </li>
        <li>
          <Tooltip text={t("marginUnreal")}>
            <span className="label-text">{t("UnrealizedPL")}({contractItem.currencyName || '--'})</span>
          </Tooltip>
          <div className="value-text">{infoObj?.unrealizedProfitLoss > 0 ? '+' : ''}{infoObj?.unrealizedProfitLoss}</div>
        </li>
        <li>
          <Tooltip text={t("MarginRationMsg")}>
            <span className="label-text">{t("marginPertectRate")}({t("FullPosition")})</span>
          </Tooltip>
          <div className="value-text">
            {riskRate}%
          </div>
        </li>
      </InfoList>
      <BtnRow>
        <Button
          variant={'secondary'}
          isDark={true}
          scale={'xs'}
          onClick={() => window.location.href = `https://${hostReplace()}/user/assets/recharge`}
        >{t("RechargeCoin")}</Button>
        <Button
          variant={'secondary'}
          isDark={true}
          scale={'xs'}
          onClick={() => openTransferModal()}
        >{t("TransferBtn")}</Button>
      </BtnRow>
    </AssetWarp>
  )
}

export default AssetInfo;