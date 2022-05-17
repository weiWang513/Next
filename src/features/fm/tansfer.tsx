import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  InputGroup,
  Input,
  Modal,
  ModalProps,
  Select,
  Button,
  message,
  Flex
} from "@ccfoxweb/uikit";
import { ReactComponent as Transfer } from "/public/images/SVG/transfer-icon.svg";
import { ReactComponent as Close } from "/public/images/SVG/fm-close.svg";

import { useTranslation } from "react-i18next";
import { slice6, getCurrencySymbolById } from "../../utils/filters";
import { uuid } from "../../utils/utils";
import {
  futureQueryAvail,
  futureAssetTransfer,
  futureAssetCheck,
  lendingForbidWithdraw,
} from "../../services/api/common";
import { useAppSelector } from "../../store/hook";
import CModal from '../../components/Modal'
const Big = require("big.js");

const ModalContent = styled.div`
  width: 100%;
  padding: 0 24px;
  padding-bottom: 24px;
`;
const AccountRow = styled.section`
  display: flex;
  align-items: center;
  & > aside {
    flex: 1;
  }
  & > svg {
    margin: 0 8px;
    cursor: pointer;
  }
`;
const CurrencyRow = styled.section`
  padding-top: 12px;
  position: relative;
  & > .availText {
    position: absolute;
    bottom: 0;
    right: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    span {
      margin-right: 4px;
      color: #3f3755;
    }
    div {
      color: #615976;
    }
  }
`;
const InputStart = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
`;
const InputEnd = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  padding-left: 12px;
  border-left: 1px solid #3f3755;
  & > span {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
  }
  & > div {
    margin-left: 12px;
    height: 20px;
    padding: 0 8px;
    background: #eee;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 20px;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
`;
const BtnWarp = styled.section`
  padding-top: 24px;
`;
const OptionLabel = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > .left {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
`;

const Header = styled(Flex)`
  // width: 288px;
  height: 64px;
  // padding: 0 24px;
  justify-content: space-between;
  span{
    font-size: 16px;
    font-weight: 600;
    color: #220A60;
    line-height: 64px;
  }
`
const CoinIcon = styled.img`
  display: block;
  width: 32px;
  margin-right: 8px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 12px;
  }
`;

const CurrencyItem = styled(Flex)`
  justify-content: space-between;
`
const CurrencyItemL = styled(Flex)`
  span{
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #130F1D;
    line-height: 15px;
  }
`
const CurrencyItemR = styled(Flex)`
  span{
    font-size: 12px;
    font-weight: 500;
    color: #AAA4BB;
    line-height: 17px;
  }
  span.value{
    color: rgba(34, 10, 96, 1);
  }
` 
const CloseI = styled(Close)`
  cursor: pointer;
`

const transfer = props => {
  const { t } = useTranslation();

  const options = [
    { label: t("MyWallet"), value: 5 },
    { label: t("SpotAccount"), value: 1 },
    { label: t("FuturesAccount"), value: 2 },
    { label: t("ActivityAccount"), value: 10 },
  ]
  const [accountOptions, setAccountOptions] = useState(options)
  const [accountToOptions, setAccountToOptions] = useState(options)
  const [submiting, setSubmiting] = useState(false);
  const [fromId, setFromId] = useState(1);
  const [toId, setToId] = useState(5);
  const [currencyId, setCurrencyId] = useState(7);
  const [currencySymbol, setCurrencySymbol] = useState("USDT");
  const [coinOptions, setCoinOptions] = useState([]);
  const [showCurrencyList, setShowCurrencyList] = useState([]);
  const [transNum, setTransNum] = useState("");
  const [available, setAvailable] = useState(null);
  const [assetsList, setAssetsList] = useState([]);
  const [_uuid, setUuid] = useState(uuid());
  const [intervalTime, setIntervalTime] = useState(10);
  const interval = useRef(null);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const numForbidWithdraw = useRef(0)
  const currencyList = useAppSelector((state) => state.contract.currencyList);
  const isLogin = useAppSelector((state) => state.app.isLogin);

  const [currencyOption, setCurrencyOption] = useState([])
  // useEffect(() => {
  //   setAccountOptions([
  //     { label: t("MyWallet"), value: 5 },
  //     { label: t("SpotAccount"), value: 1 },
  //     { label: t("FuturesAccount"), value: 2 },
  //     { label: t("ActivityAccount"), value: 10 },
  //   ])
  // }, [userHabit.locale])

  useEffect(() => {
    setTransNum("");
  }, [toId, fromId, currencyId]);

  useEffect(() => {
    if (toId === 1) {
      setAccountOptions([{ label: t("MyWallet"), value: 5 }])
    } else {
      setAccountOptions(options.filter(e => e.value !== toId));
    }
    setAccountToOptions(options.filter(e => e.value !== fromId));
    initAvailable(currencyId, fromId);
  }, [toId, fromId])

  useEffect(() => {
    getLendingForbidWithdraw(() => {
      initAvailable(currencyId, fromId)
    })
  }, [currencyId])

  useEffect(() => {
    setCurrencyId(props.currencyId)
    setCoinOptions(currencyList || []);
    console.log('first', currencyList)
  }, [])
  

  useEffect(() => {
    if (!currencyList.length) return;
    setUuid(uuid());
    setCoinOptions(currencyList || []);
    setShowCurrencyList(
      currencyList ? checkCurrencyInList(currencyList, fromId, toId) : []
    );
    let ci = props.currencyId;
    setCurrencyId(ci);

    let item:{symbol:any;} = currencyList.find((el:{currencyId?: number}) => el?.currencyId === ci);
    if (item) {
      setCurrencySymbol(item?.symbol);
    }
    initAvailable(ci, fromId);
  }, [currencyList]);

  const getLendingForbidWithdraw = (f?) => {
    lendingForbidWithdraw({ currencyId: currencyId }).then(res=>{
      if (res.data.code === 0) {
        numForbidWithdraw.current = res.data.data
      }
      f && f(res.data.data)
    })
  }

  const checkCurrencyInList = (list, fromId, toId) => {
    let res = [];
    res = list.filter((el) => {
      let item = el.transferApplList;
      return (
        item.find((ele) => ele === fromId) && item.find((ele) => ele === toId)
      );
    });
    if (res.length > 0) {
      let item = res.find((el) => el.currencyId === currencyId);
      if (!item) {
        setCurrencyId(res[0].currencyId);
        setCurrencySymbol(res[0].symbol);
      }
    }
    return res;
  };
  const changeCurrencyId = (v) => {
    setCurrencyId(v);
    let item = coinOptions.find((el) => el.currencyId === v);
    if (item) {
      setCurrencySymbol(item.symbol);
    }
  };
  const transNumChanged = (text) => {
    console.log('coinOptions', coinOptions)
    let item = coinOptions.find((el) => el.currencyId === currencyId);
    if (!item) return;
    if (item.currencyType === 2) {
      // 通过正则过滤小数点后6位 非数字
      setTransNum(text === "" ? "" : text.match(/^\d{0,8}/g)[0] || transNum);
    } else {
      // 通过正则过滤小数点后6位 非数字
      setTransNum(
        text === "" ? "" : text.match(/^\d*(\.?\d{0,6}|\D)/g)[0] || transNum
      );
    }
  };
  const setAll = () => {
    let transNum = available;
    setTransNum(transNum > 0 ? transNum : "0");
  };
  const getAvail = (currencyId, assetsList) => {
    let avail = 0;
    if (assetsList.length > 0) {
      let item = assetsList.find((el) => el.currencyId === currencyId);
      avail = item ? new Big(item.available).toString() : "0";
    }
    if (toId === 1) {
      setAvailable(slice6(new Big(avail || 0).minus(numForbidWithdraw.current || 0).toString()));
    } else {
      setAvailable(slice6(avail));
    }
  };
  const initAvailable = (currencyId, fromId) => {
    console.log('currencyId', currencyId)
    const value = fromId;
    futureQueryAvail({
      applId: value,
    }).then((res) => {
      if (res.data.code === 0) {
        setAssetsList(res.data.data || []);
        let _option = res.data.data?.map(e=>{
          let _symbol = currencyList.find(el => el.currencyId === e.currencyId)?.symbol
          return {
            label: <CurrencyItem>
              <CurrencyItemL>
                <CoinIcon
                  src={`https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/currency/${_symbol}@3x.png`}
                />
                <span>{_symbol}</span>
              </CurrencyItemL>
              <CurrencyItemR>
                <span>{t('canTransfer')}:</span>
                <span className="value">{e?.available}</span>
              </CurrencyItemR>
            </CurrencyItem>,
            value: e.currencyId
          }
        })
        getAvail(currencyId, res.data.data || []);
      }
    });
  };
  const exchangeWallet = () => {
    let temp = fromId;
    setFromId(fromId === 1 ? 5 : toId);
    setToId(temp);
    setAvailable(0);
  };

  const validateWalletRules = (type, value) => {
    if (type === "from") {
      let temp = value;
      setFromId(toId);
      setToId(temp);
    } else if (type === "to") {
      if (fromId === 1) {
        setFromId(5);
        setToId(1);
      } else {
        let temp = value;
        setFromId(temp);
        setToId(fromId);
      }

    }
  };
  const doSelect = (value, type) => {
    if (!value) return;
    if (type === "from") {
      if (toId !== value) {
        setFromId(value);
      } else {
        validateWalletRules("from", fromId);
      }
    } else if (type === "to") {
      if (fromId !== value) {
        setToId(value);
        if (value === 1) {
          setFromId(5)
        }
      } else {
        validateWalletRules("to", toId);
      }
    }
    // if (coinOptions.length > 0) {
    //   setTimeout(() => setShowCurrencyList(coinOptions), 600);
    // }
  };
  const doTransfer = () => {
    if (!isLogin) return;
    if (Number(transNum) <= 0 || transNum === "") {
      message.error(t("TransferNumberillegal"));
      return;
    } else if ((fromId === 1 && toId === 2) || (fromId === 2 && toId === 1)) {
      message.error(t("NotTransfer"));
      return;
    }
    setSubmiting(true);
    let params = {
      amount: transNum,
      currencyId: currencyId,
      fromApplId: fromId,
      toApplId: toId,
    };
    futureAssetTransfer({
      params: params,
      headers: { unique: _uuid },
    })
      .then((res) => {
        setUuid(uuid());
        if (res.data.code === 0) {
          interval.current = setInterval(
            () => doFutureTransferCheck(res.data.data),
            2000
          );
        } else if (res.data.code === 2) {
          setSubmiting(false);
          message.error(t("TransferFailure"));
        } else {
          setSubmiting(false);
        }
      })
      .catch((err) => {
        setUuid(uuid());
      });
  };
  const doFutureTransferCheck = (transferId) => {
    setIntervalTime(intervalTime - 2);
    if (intervalTime < 0) {
      clearInterval(interval.current);
      setIntervalTime(10);
      setSubmiting(false);
      message.error(t("TryAgain"));
    }
    futureAssetCheck({
      transferId: transferId,
      fromApplId: fromId,
      toApplId: toId,
    }).then((res) => {
      if (res.data.code === 1) {
        initAvailable(currencyId, fromId);
        clearInterval(interval.current);
        setIntervalTime(10);
        setSubmiting(false);
        setTransNum("");
        // onDismiss();
        message.success(t("TransferSuccessfully"));
        props.close()
      } else if (res.data.code === 2) {
        clearInterval(interval.current);
        setIntervalTime(10);
        setSubmiting(false);
        message.error(t("TransferFailure"));
      }
    });
  };

  const getCurrencyOptions = () => {
    return showCurrencyList.map((item) => {
      return {
        ...item,
        key: item.currencyId,
        value: item.currencyId,
        label: (
          <OptionLabel>
            <aside className="left">
              <img
                src={`https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/currency/${getCurrencySymbolById(
                  item.currencyId
                )}@3x.png`}
                alt=""
              />
              <span>{item.symbol}</span>
            </aside>
          </OptionLabel>
        ),
      };
    });
  };

  const renderContent = () => {
    return <ModalContent>
      <Header>
        <span>{t('Transfer')}</span>
        <CloseI onClick={props.close} />
      </Header>
      <AccountRow>
        <aside>
          <Select
            width={"100%"}
            scale={"md"}
            options={accountOptions}
            onChange={(option) => doSelect(option.value, "from")}
            value={fromId}
          />
        </aside>
        <Transfer onClick={() => exchangeWallet()} />
        <aside>
          <Select
            width={"100%"}
            scale={"md"}
            options={accountToOptions}
            onChange={(option) => doSelect(option.value, "to")}
            value={toId}
          />
        </aside>
      </AccountRow>
      {showCurrencyList.length > 0 && (
        <CurrencyRow>
          <Select
            width={"100%"}
            scale={"md"}
            options={getCurrencyOptions()}
            onChange={(option) => changeCurrencyId(option.value)}
            value={currencyId}
            maxHeight={300}
          />
          <aside className="availText">
            <span>{t("canTransfer")}</span>
            <div>{available}</div>
          </aside>
        </CurrencyRow>
      )}
      <InputGroup
        startIcon={<InputStart>{t("TransferAmount")}</InputStart>}
        endIcon={
          <InputEnd>
            <span>{currencySymbol}</span>
            <div onClick={() => setAll()}>{t("All")}</div>
          </InputEnd>
        }
        mt={"12px"}
        scale={"md"}
        ta={"right"}
      >
        <Input
          type="text"
          value={transNum}
          onChange={(event) => transNumChanged(event.target.value)}
        />
      </InputGroup>
      <BtnWarp>
        <Button
          width="100%"
          variant={"primary"}
          scale={"md"}
          disabled={
            Number(transNum) <= 0 || Number(transNum) > Number(available)
          }
          isLoading={submiting}
          onClick={() => doTransfer()}
        >
          {t("ConfirmB")}
        </Button>
      </BtnWarp>
    </ModalContent>
  }

  return (
    <CModal h={137} show={props.show} renderContent={renderContent} close={props.close} />
  )
}

export default transfer