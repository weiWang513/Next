import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, InputGroup, Tooltip, Toggle, useModal, CheckboxGroup, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { uuid } from '../../utils/utils';
import { statistics, subscribe } from '../../services/api/fm';
import { ReactComponent as Info } from "/public/images/SVG/fm-info.svg";
import { ReactComponent as Transfer } from "/public/images/SVG/transfer_i.svg";
import { slice6 } from '../../utils/filters';
import CModal from '../../components/Modal'
import Tansfer from './tansfer'
import ReNewModal from './reNewModal'
import { futureQueryAvail, lendingForbidWithdraw } from '../../services/api/common';
import ChangeSize from '../../hooks/useClientSize';

import Overview from './Overview'
import { useAppSelector } from '../../store/hook';
const Big = require('big.js')

const ContentL = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  // height: 494px;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 0 24px;
  margin: auto;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: scroll;
  padding-bottom: 146px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 360px;
    padding-bottom: 0;
    width: 360px;
  }
`

const CoinIcon = styled.img`
  display: block;
  width: 24px;
  height: 24px;
  margin-right: 12px;
`;

const FormTitle = styled(Flex)`
  height: 56px;
  line-height: 56px;
  span{
    font-size: 16px;
    font-weight: 500;
    color: #130F1D;
    line-height: 21px;
  }
`

const DateWarp = styled(Flex)<{indexed?;}>`
  height: 32px;
  background: #F5F3FB;
  border-radius: 4px;
  span{
    flex: 1;
    height: 32px;
    border-radius: 4px;
    font-size: 14px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    text-align: center;
    color: #AAA4BB;
    line-height: 32px;
    cursor: pointer;
  }
  span.indexed{
    color: rgba(106, 69, 255, 1);
    border: 1px solid #E6E3F0;
    background: #fff;
    line-height: 30px;
  }
`

const RInput = styled(Input)`
  height: 40px;
  font-size: 12px;
  font-family: DINPro-Bold, DINPro;
  font-weight: bold;
  color: #130F1D;
`;

const Avl = styled(Flex)`
  margin-top: 10px;
  justify-content: space-between;
`
const AvlL = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 400;
  color: #AAA4BB;
  line-height: 17px;
  span.avl{
    color: rgba(34, 10, 96, 1);
    margin-left: 5px;
    margin-right: 8px;
  }
`
const AvlR = styled.div`
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #6024FD;
  line-height: 17px;
`

const TransferIcon = styled(Transfer)`
cursor: pointer;
`

const Profit = styled(Flex)`
  justify-content: center;
  height: 40px;
  background: #F5F3FB;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #220A60;
  line-height: 40px;
  margin-top: 16px;
  span.profit{
    color: rgba(20, 175, 129, 1);
    font-weight: 600;
    margin: 0 4px;
  }
`

const Renew = styled(Flex)`
  justify-content: space-between;
  margin-top: 16px;
`

const RenewL = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  span{
    height: 26px;
    font-size: 12px;
    font-weight: 500;
    color: #220A60;
    line-height: 26px;
  }
`

const RenewR = styled.div`

`

const ContentLT = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;

  }
`

const ContentLB = styled.div`
  flex: 0 0 84px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #FFFFFF;
  padding: 24px;
  border-top: 1px solid #eee;
  ${({ theme }) => theme.mediaQueries.md} {
    position: relative;
    margin-bottom: 24px;
    padding: 0;
    width: 100%;
    border-top: none;
  }
`

const ServiceI = styled(Flex)`
  margin-bottom: 12px;
  span{
    font-size: 12px;
    font-weight: 500;
    color: #AAA4BB;
    line-height: 16px;
  }
  a{
    flex: 1;
    font-size: 12px;
    font-weight: 500;
    color: #AAA4BB;
    line-height: 16px;
    color: rgba(106, 69, 255, 1);
    margin-left: 4px;
  }
`

const CheckBoxW = styled.div``

const AddonBefore = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
  color: #AAA4BB;
  line-height: 17px;
  padding-left: 12px;
`;
const AddonAfter = styled(Flex)`
  // width: 130px;
  text-align: center;
  justify-content: center;
  span.symbol {
    font-size: 12px;
    font-weight: 500;
    color: #220A60;
    line-height: 15px;
  }
  height: 16px;
  padding: 0 12px;
  border-left: 1px solid #4a4062;
`;

const ConfirmModalC = styled.div`
  span.title{
    width: 336px;
    height: 64px;
    font-size: 20px;
    font-weight: 600;
    color: #220A60;
    line-height: 64px;
    text-align: center;
    display: block;
  }
  span.content{
    font-size: 14px;
    font-weight: 500;
    color: #807898;
    line-height: 24px;
    padding: 0 24px;
    text-align: center;
    display: block;
  }
`

const BtnWarp = styled(Flex)`
  height: 40px;
  width: 336px;
  padding: 0 24px;
  margin-top: 20px;
  margin-bottom: 24px;
`

const CheckText = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #AAA4BB;
  line-height: 16px;
`

const fmForm = props => {
  const { t } = useTranslation()
  const [reNew, setReNew] = useState(false)
  const [num, setNum] = useState('')
  const [check, setCheck] = useState(false)
  const [available, setAvailable] = useState('--');
  const [assetsList, setAssetsList] = useState([]);
  const numForbidWithdraw = useRef(0)
  const [UUID, setUuid] = useState(uuid())
  const [confirmModals, setConfirmModals] = useState(false)
  const [transferShow, setTransferShow] = useState(false)

  const [reNewShow, setReNewShow] = useState(false)
  const [userStatistics, setStatistics] = useState<{totalProductAccounts?;}>({})
  const [productAcc, setProductAcc] = useState<{amount?;}>({})
  const userHabit = useAppSelector((state) => state.app.userHabit);

  const [h, setH] = useState(0)

  const ConfirmModalCRef = useRef(null)
  let size = ChangeSize();
  const [openLeverModal] = useModal(
    <ReNewModal />,
    true,
    true,
    `ReNewModal${props.random}`
  );
  const handleChange = (v) =>{
    let n = v.target.value;
    if (n === "") {
      setNum(n);
    }
    let pt = 0.000001
    let reg = /^\d+\.?\d*$/;
    let regNumber = /^\d+\.?\d+$/;
    if (reg.test(n)) {
      if (pt && regNumber.test(n)) {
        let price = Number.isInteger(Number(new Big(n || 0).div(pt)))
          ? n
          : new Big(Math.floor(new Big(n || 0).div(pt)) || 0).times(pt).toString();
        setNum(price.length > 8 ? price.slice(0, 9) : price)
      } else {
        setNum(n);
      }
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (props.indexedProduct?.currencyId) {
      getLendingForbidWithdraw(() => {
        initAvailable(props.indexedProduct?.currencyId)
      })
    }
  }, [props.indexedProduct?.currencyId])

  useEffect(() => {
    getStat()
  }, [])

  const getStat = () => {
    statistics().then(res => {
      if (res.data.code === 0) {
        setStatistics(res.data.data)
        console.log('setStatistics', props.indexedProduct)
        let _item = res.data?.data?.totalProductAccounts?.find(e=>e.productId === props.indexedProduct?.id)
        setProductAcc(_item)
      }
    })
  }

  useEffect(() => {
    if (reNewShow) {
      setTimeout(() => {
        setH(ConfirmModalCRef.current?.offsetHeight/2 + 12)
      }, 0);
    }
  }, [reNewShow])
  

  useEffect(() => {
    let _item = userStatistics?.totalProductAccounts?.find(e=>e.productId === props.indexedProduct?.id)
    setProductAcc(_item)
  }, [props.indexedProduct?.id])
  
  

  const getLendingForbidWithdraw = (f?) => {
    lendingForbidWithdraw({ currencyId: props.indexedProduct?.currencyId }).then(res=>{
      if (res.data.code === 0) {
        numForbidWithdraw.current = res.data.data
      }
      f && f(res.data.data)
    })
  }

  const initAvailable = (currencyId) => {
    futureQueryAvail({
      applId: 5,
    }).then((res) => {
      if (res.data.code === 0) {
        setAssetsList(res.data.data || []);
        getAvail(currencyId, res.data.data || []);
      }
    });
  };

  const getAvail = (currencyId, assetsList) => {
    let avail = 0;
    if (assetsList.length > 0) {
      let item = assetsList.find((el) => el.currencyId === currencyId);
      avail = item ? new Big(item.available || 0).toString() : "0";
    }
    setAvailable(slice6(new Big(Number(avail) || 0).minus(numForbidWithdraw.current || 0).toString()));
  };

  const disabled= () => {
    return !check || !num || !props.indexedProduct?.purchaseEnabled || props.indexedProduct?.status !== 1
  }

  const renderPerfix = () => {
    // return <AddonBefore>{t('OrderPrice')}:</AddonBefore>;
    return <AddonBefore>{t('fm19')}:</AddonBefore>;
  };
  const renderAddonAfter = () => {
    return (
      <AddonAfter>
        <span className="symbol">
          {props.indexedProduct?.currencySymbol}
        </span>
      </AddonAfter>
    );
  };

  const toggleChange = v => {
    setReNew(!reNew)
  }

  const allin = () => {
    let _max = calcMax()
    const _avlMax = Number(available) > Number(_max) ? _max : available
    setNum(Number(_avlMax) ? String(_avlMax) : '')
  }

  const apply = () => {
    if (Number(num) > props.indexedProduct?.userPurchaseUpperLimit) {
      message.warning(`${t('fm3')} ${props.indexedProduct?.userPurchaseUpperLimit}${props.indexedProduct?.currencySymbol}`);
      return
    }
    if (Number(num) < props.indexedProduct?.purchaseLowerLimit) {
      message.warning(`${t('fm31')} ${props.indexedProduct?.purchaseLowerLimit}${props.indexedProduct?.currencySymbol}`);
      return
    }

    const p = {
      params: {
        amount: num,
        productId: props.indexedProduct?.id,
        renewedEnabled: reNew
      },
      headers: { unique: UUID }
    }
    subscribe(p).then((res) => {
      setUuid(uuid());
      if (res.data.code === 0) {
        props.setReloadR(Math.random())
        getStat()
        message.success(t('submitSuccess'))
        setConfirmModals(false)
        props.onDismiss()
      }
    }).catch(e=>{
      setUuid(uuid());
    })
  }

  const openRenewModal = () => {

  }


  const calcProfit = () => {
    return Number(slice6(new Big(Number(num) || 0).times(props.indexedProduct?.annualReturns || 0).div(365).times(props.indexedProduct?.period || 0).toString()))
  }

  const renderContent=()=>{
    return <ConfirmModalC>
      <span className="title">{t('fm20')}</span>
      <span className="content">{t('fm21')}</span>
      <BtnWarp>
        <Button variant={'secondary'} scale={'md'} width="100%" mr='8px' onClick={() => setConfirmModals(false)}>
          {t('Cancel')}
        </Button>
        <Button variant={'primary'} scale={'md'} width="100%" onClick={apply}>
          {t('ConfirmB')}
        </Button>
      </BtnWarp>
    </ConfirmModalC>
  }

  const renderRenewContent=()=>{
    return <ConfirmModalC ref={ConfirmModalCRef}>
      <span className="title">{t('fm')}</span>
      <span className="content">{t('fm1')}</span>
      <BtnWarp>
        <Button variant={'primary'} scale={'md'} width="100%" onClick={() => setReNewShow(false)}>
          {t('fm2')}
        </Button>
      </BtnWarp>
    </ConfirmModalC>
  }

  const calcMin = () => {
    return props.indexedProduct?.purchaseEnabled && props.indexedProduct?.status === 1 ? props.indexedProduct?.purchaseLowerLimit : 0
  }

  const calcMax = () => {
    return props.indexedProduct?.purchaseEnabled && props.indexedProduct?.status === 1 ? Number(new Big(props.indexedProduct?.userPurchaseUpperLimit || 0).minus(productAcc?.amount || 0).toFixed(6, 0).toString()) : 0; 
  }

  const renderText = () => {
    // purchaseEnabled  ：false 售罄，true 启用
    // status 0 额度已满，1 进行中

    return !props?.indexedProduct?.purchaseEnabled ? t("fm25") : props?.indexedProduct?.status === 0 ? t("fm26") : t("fm27");
  };

  const getLink = () => {
    switch (userHabit.locale) {
      case 'zh_CN':
        return 'https://1316109.s4.udesk.cn/hc/articles/29642'
      case 'zh_TW':
        return 'https://ccfox.zendesk.com/hc/zh-hk/articles/4859962396057'
      case 'en_US':
        return 'https://ccfox.zendesk.com/hc/en-us/articles/4859962396057'
      case 'ko_KR':
        return 'https://ccfox.zendesk.com/hc/ko-kr/articles/4859962396057'
    
      default:
        return 'https://ccfox.zendesk.com/hc/zh-cn/articles/4859962396057'
    }
  }

  return <>
    <ContentL>
      <ContentLT>

        <FormTitle>
          <CoinIcon
            src={`https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/currency/${props?.item?.currencySymbol}@3x.png`}
          />
          <span>{t('fm4', {symbol: props?.item?.currencySymbol})}</span>
        </FormTitle>
        <DateWarp>
          {
            props.item?.productData?.map((e, i)=>{
              return <span 
                key={i} 
                className={props.indexedProduct.period === e.period ? 'indexed' : ''}
                onClick={() => props.selectPro(e)}
              >{e.period}{t('list6')}</span>
            })
          }
        </DateWarp>
        <InputGroup
          ta={"right"}
          startIcon={renderPerfix()}
          endIcon={renderAddonAfter()}
          ep={1}
          sp={1}
          scale={'md'}
          mt={16}
        >
          <RInput placeholder={t('fm28', {min: calcMin(), max: calcMax()})} scale={'md'} type="text" fontSize={20} value={num} onChange={handleChange} isDark={true} />
        </InputGroup>
        <Avl>
          <AvlL>
            <span>{t('Avali')}:</span>
            <span className="avl">{`${available} ${props.indexedProduct?.currencySymbol}`}</span>
            <TransferIcon onClick={() => setTransferShow(true)} />
          </AvlL>
          <AvlR onClick={allin}>{t('fm18')}</AvlR>
        </Avl>
        <Profit>
          <span>{t('calcResPL')}:</span>
          <span className="profit">{calcProfit()}</span>
          <span>{props.indexedProduct?.currencySymbol}</span>
        </Profit>
        <Renew>
          <RenewL>
            <span>
              {t('fm')}
            </span>
            <Info onClick={() => setReNewShow(true)} />
          </RenewL>
          <Toggle checked={reNew} onChange={toggleChange} scale={'sm'} />
        </Renew>
      </ContentLT>

      {
        size.width < 1280 && <Overview infoArr={props.infoArr} />
      }
      <ContentLB>
        <ServiceI>
          <CheckBoxW>
            <CheckboxGroup
              text={<CheckText>{t('fm15')}</CheckText>}
              checked={check}
              onChange={() => setCheck(!check)}
              scale={'md'}
              bg={'rgba(106, 69, 255, 1)'}
            />
          </CheckBoxW>
          <a href={getLink()} target="_blank" rel="noopener noreferrer">{t('fm16')}</a>
        </ServiceI>
        <Button variant={'primary'} scale={'lg'} width='100%' disabled={disabled()} onClick={() => setConfirmModals(true)}>
          {renderText()}
        </Button>
      </ContentLB>
      <CModal h={100} show={confirmModals} renderContent={renderContent} close={() => setConfirmModals(false)} />
      <CModal h={h} show={reNewShow} renderContent={renderRenewContent} close={() => setReNewShow(false)} />
    </ContentL>
    <Tansfer show={transferShow} close={() => {
      setTransferShow(false)
      getLendingForbidWithdraw(() => {
        initAvailable(props.indexedProduct?.currencyId)
      })
    }} currencyId={props.indexedProduct?.currencyId} />
  </> 
}

export default fmForm