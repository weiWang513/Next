import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useModal, Button } from "@ccfoxweb/uikit";
import TransferModal from "./transferModal";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store/hook";
import { toFix6, getCurrencyPrecisionById } from '../../../../utils/filters'
import { hostReplace } from "../../../../utils/utils";
import { selectCurrentSpot, selectSpotList } from "../../../../store/modules/spotSlice";
import { useSelector } from "react-redux";

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
  const contractItem = useSelector(selectCurrentSpot);
  const currencyList = useAppSelector((state) => state.spot?.currencyList);
  const accountList = useAppSelector((state) => state.spot?.accountList);
  const isLogin = useAppSelector((state) => state.app.isLogin);
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

  const getCommodityQty = () => {
    if (!accountList.length || !contractItem) {
      return '0'
    }
    const qtyItem = accountList.find(item => item.currencyId === contractItem.commodityId)
    return qtyItem ? toFix6(Number(qtyItem.available) || 0, getCurrencyPrecisionById(contractItem.commodityId)) : '0'
  }

  const getCurrencyQty = () => {
    if (!accountList.length || !contractItem) {
      return '0'
    }
    const qtyItem = accountList.find(item => item.currencyId === contractItem.currencyId)
    return qtyItem ? toFix6(Number(qtyItem.available) || 0, getCurrencyPrecisionById(contractItem.currencyId)) : '0'
  }

  return (
    <AssetWarp>
      <AssetHeader>
        <span>{t("Assets")}</span>
      </AssetHeader>
      <InfoList>
        <li>
          <span className="label-text">{contractItem?.commodityName || '--'} {t("Avali")}</span>
          <div className="value-text">{getCommodityQty()}</div>
        </li>
        <li>
          <span className="label-text">{contractItem?.currencyName || '--'} {t("Avali")}</span>
          <div className="value-text">{getCurrencyQty()}</div>
        </li>
      </InfoList>
      <BtnRow>
        <Button
          variant={'secondary'}
          isDark={true}
          scale={'xs'}
          onClick={() => window.location.href = `https://${hostReplace()}/user/assets/recharge?tabName=2`}
        >{t("DepositFiatOtc")}</Button>
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