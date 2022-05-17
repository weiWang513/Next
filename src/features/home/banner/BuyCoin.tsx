import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import styled from "styled-components";
import { Button, InputGroup, Input, message, Select, useModal } from "@ccfoxweb/uikit";
import { queryAllOtcCurrencyList, buy } from "../../../services/api/c2c";
import { queryVersion } from "../../../services/api/user";
import { uuid } from "../../../utils/utils";
import { ReactComponent as Change } from "/public/images/SVG/change.svg";
import { ReactComponent as Wallet } from "/public/images/SVG/wallet-icon.svg";
import { ReactComponent as Exchange } from "/public/images/SVG/otc/exchange.svg";
import useInterval from "../../../hooks/useInterval";
import { useAppSelector } from "../../../store/hook";
import {
  getServiceProvider,
  evaluate,
  quote,
  payment,
  queryPrice
} from "../../../services/api/otc";
import OtcCardTop from "../../../components/OTC/OtcCardTop";
import OtcOperationsModal from "../../../components/OTC/OtcOperationsModal";
import { useDebounceFn } from "ahooks";
import { Big } from "big.js";
import { toFix6 } from "../../../utils/filters";
import dayjs from "dayjs";
import Loading from "../../../components/Loading";
import { useTranslation } from "next-i18next";

const BuyWarp = styled.div`
  padding: 0 32px;
  position: relative;
`;
const CoinWarp = styled.div`
  position: absolute;
  right: 16px;
  top: -48px;
  width: 118px;
  height: 99px;
`;

const ExchangeWrap = styled.div`
  width: 24px;
  height: 24px;
  background: #f5f3fb;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TitleRow = styled.section`
  margin-top: 24px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleRowL = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #220a60;
  display: flex;
  justify-content: center;
  align-items: center;
  .during-wrap {
    font-size: 14px;
    font-weight: bold;
    color: #aaa4bb;
    line-height: 18px;
    margin-left: 12px;
    margin-top: 3px;
  }
`;

const TitleRowR = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  span {
    font-size: 14px;
    color: rgba(96, 36, 253, 1);
    font-weight: bold;
  }
`;

const CoinRow = styled.section`
  margin-top: 24px;
  height: 40px;
  padding: 0 12px;
  background: #f5f3fb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  & > span {
    margin-left: 8px;
    font-size: 16px;
    font-weight: bold;
    color: #130f1d;
  }
`;
const TypeRow = styled.section`
  margin-top: 18px;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > span {
    font-size: 14px;
    font-weight: 500;
    color: #625488;
  }
  & > aside {
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      font-weight: 500;
      color: #6024fd;
    }
  }
`;
const ChangeImg = styled(Change)`
  width: 24px;
  height: 20px;
`;
const CnyWarp = styled.aside`
  height: 20px;
  padding-left: 16px;
  border-left: 1px solid #e6e6e6;
  font-size: 14px;
  font-weight: 500;
  color: #625488;
  display: flex;
  align-items: center;
`;
const InfoRow = styled.section`
  height: 20px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > aside {
    font-size: 14px;
    font-weight: 500;
    color: #aaa4bb;
  }
  & > div {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 900;
    color: #220a60;
    span {
      margin-left: 4px;
    }
  }
`;
const TipMsg = styled.div`
  font-size: 12px;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
`;

const CoinSelectWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const CurrencyIconContainer = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span {
    color: rgba(19, 15, 29, 1);
    font-size: 16px;
    font-weight: bold;
    margin-left: 8px;
  }
`;

const CurrencyIconImg = styled.img`
  display: block;
  width: 24px;
  height: 24px;
`;

const ServicesProviderContainer = styled.div`
  width: 100%;
  height: 64px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e6e3f0;
  margin-top: 10px;
`;

const BuyCoin = () => {
  const [btnAble, setBtnAble] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [usdtType, setUsdtType] = useState<boolean>(true); // true?按数量购买:按金额购买

  const [buyNum, setBuyNum] = useState<string>(""); // input
  const [getNum, setGetNum] = useState<string>("0"); // 预计获得 按数量购买
  const [payNum, setPayNum] = useState<string>("0"); // 预计支付 按金额购买

  const [serviceProviderList, setServiceProviderList] = useState<any>([]);
  const [serviceProviderItem, setServiceProviderItem] = useState<any>({});
  const [currencyId, setCurrencyId] = useState<number>(7);
  const [currencyIdItem, setCurrencyIdItem] = useState<any>({
    min: "--",
    max: "--",
    symbol: "--"
  });
  const [supportCurrencyList, setSupportCurrencyList] = useState<any>([]);
  const [faitCurrencyId, setFaitCurrencyId] = useState<number>(1);
  const [faitCurrencyIdItem, setFaitCurrencyIdItem] = useState<any>({
    min: "--",
    max: "--",
    symbol: "--"
  });
  const [supportFaitCurrencyList, setSupportFaitCurrencyList] = useState<any>([]);
  const [merchantsList, setMerchantsList] = useState<any>([]);
  const [ratiolist, setRatiolist] = useState<any>([]);

  const timer = useRef(null); // 轮训汇率定时器
  const [during, setDuring] = useState(30); // 秒`
  const [loading, setLoading] = useState(true);

  const paymentUrl = useRef(null);
  const paymentId = useRef(null);

  const userInfo = useAppSelector((state) => state.app.userInfo);
  const certInfo = useAppSelector((state) => state.app.certInfo);
  const userHabit = useAppSelector((state) => state.app.userHabit);

  const { t } = useTranslation();

  const [onPresent1] = useModal(
    <OtcOperationsModal
      merchantsList={merchantsList}
      currencyIdItem={currencyIdItem}
      faitCurrencyIdItem={faitCurrencyIdItem}
      serviceProviderItem={serviceProviderItem}
      setServiceProviderItem={setServiceProviderItem}
      ratiolist={ratiolist}
      during={during}
      buyNum={buyNum}
    />,
    true,
    true,
    "otcOperationsModal"
  );

  const Panel = () => {
    return <TipMsg>{t("ReferenceTips")}</TipMsg>;
  };
  useEffect(() => {
    if (userHabit.currency === "") return;
    getBtnInfo();
    init();
    countDown();

    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, [userHabit.currency]);

  useEffect(() => {
    if (!supportCurrencyList.length) return;

    let item = supportCurrencyList.find((el) => el.currencyId === currencyId);
    item && setCurrencyIdItem(item);
  }, [currencyId, supportCurrencyList]);

  useEffect(() => {
    if (!supportFaitCurrencyList.length) return;

    let item = supportFaitCurrencyList.find((el) => el.currencyId === faitCurrencyId);
    item && setFaitCurrencyIdItem(item);
  }, [faitCurrencyId, supportFaitCurrencyList]);

  useEffect(() => {
    run();
    setLoading(true);
  }, [buyNum]);

  useEffect(() => {
    Enquiry();
    setBuyNum("");
  }, [currencyId, faitCurrencyId, usdtType]);

  useEffect(() => {
    _setRatiolist(buyNum, ratiolist);

    let currencyItem = serviceProviderItem?.supportCurrencyInfo?.find(
      (el) => el.currencyId === currencyId
    );
    let fiatCurrencyItem = serviceProviderItem?.supportFiatCurrencyInfo?.find(
      (el) => el.currencyId === faitCurrencyId
    );

    currencyItem && setCurrencyIdItem(currencyItem);

    fiatCurrencyItem && setFaitCurrencyIdItem(fiatCurrencyItem);
  }, [serviceProviderItem]);

  const countDown = () => {
    if (loading) return;

    if (during <= 0) {
      Enquiry();
    } else {
      setDuring(during - 1);
    }
  };

  useInterval(countDown, 1000);

  /**
   * @name 过滤法币和虚拟货币列表
   * @param {匹配标识： 0 以currency为基匹配faitList； 1 以fait为基匹配currencyList} f
   * @param {基值} v
   * @param {出入标识} s 0:buy;1:sell
   * @param {商户列表} serviceProviderList
   * @returns
   */
  const filterCurrencyAndFait = (f, v, s = 0, serviceProviderList, isInit?) => {
    let _l = [];
    let _merchantsL = [];
    let exMerchantList = [];
    let _id;
    if (f) {
      _merchantsL = serviceProviderList.filter((e) =>
        e.supportFiatCurrencyInfo.some((el) => el.currencyId === v)
      );
      _merchantsL.forEach((e) => {
        e.supportCurrencyInfo.forEach((el) => {
          if (
            !_l.some((ele) => ele.currencyId === el.currencyId) &&
            ((s === 0 && el.purchaseEnabled) || (s === 1 && el.saleEnabled))
          ) {
            _l.push(el);
          }
        });
      });
      if (_l.length && !_l.some((e) => e.currencyId === currencyId)) {
        _id = _l[0]?.currencyId;
      }
      exMerchantList = _merchantsL.filter((e) =>
        e.supportCurrencyInfo.some((el) => el.currencyId === (_id || currencyId))
      );
      setMerchantsList(exMerchantList);
      _setSupportCurrencyList(_l);

      if (_id) {
        setCurrencyId(_id);
      }
    } else {
      _merchantsL = serviceProviderList.filter((e) =>
        e.supportCurrencyInfo.find((el) => el.currencyId === v)
      );
      _merchantsL.forEach((e) => {
        e.supportFiatCurrencyInfo.forEach((el) => {
          if (
            !_l.some((ele) => ele.currencyId === el.currencyId) &&
            ((s === 0 && el.purchaseEnabled) || (s === 1 && el.saleEnabled))
          ) {
            _l.push(el);
          }
        });
      });
      if (isInit) {
        let _faitItem = _l.find((e) => e.symbol === userHabit?.currency);
        _id = _faitItem?.currencyId;
        if (!_id) {
          _id = _l[0].currencyId;
        }
      } else {
        if (_l.length && !_l.some((e) => e.currencyId === faitCurrencyId)) {
          _id = _l[0]?.currencyId;
        }
      }

      exMerchantList = _merchantsL.filter((e) =>
        e.supportFiatCurrencyInfo.some((el) => el.currencyId === (_id || faitCurrencyId))
      );
      setMerchantsList(exMerchantList);
      console.log("exMerchantList", exMerchantList);
      _setSupportFaitCurrencyList(_l);

      if (_id) {
        setFaitCurrencyId(_id);
      }
    }

    let _serviceProviderTag = serviceProviderItem?.serviceProviderTag;
    let _serviceProviderItem = _merchantsL.find(
      (el) => el.serviceProviderTag === _serviceProviderTag
    );
    setServiceProviderItem(_serviceProviderItem ? _serviceProviderItem : exMerchantList[0]);
  };

  /**
   * @name 询价
   * @param item
   * @returns
   */

  const Enquiry = async () => {
    setLoading(true);

    let length = merchantsList.length;
    if (!length) return;

    let _list = await Promise.all(
      Array.apply(null, { length }).map(async (item, index) => {
        item = merchantsList[index];

        // item = {
        //   serviceProviderTag: merchantsList[index]?.serviceProviderTag
        // };

        let _EnquiryItem = await EnquiryItem(item);
        item = { ...item, ..._EnquiryItem };
        return item;
      })
    );

    console.log("_list", _list);
    _setRatiolist(buyNum, _list);

    let _during: any = _list.find(
      (el: any) => el.serviceProviderTag === serviceProviderItem?.serviceProviderTag
    );

    setDuring(_during?.validUntil || 30);

    setLoading(false);
  };

  const EnquiryItem = async (item) => {
    let ratio = 0;
    let validUntil = 0;
    let quoteId = null;

    // OTC365
    if (item?.tradeType === 1) {
      let queryPriceParams = {
        otcName: item?.serviceProviderTag,
        side: 1,
        type: usdtType ? 1 : 2,
        num: buyNum || 0,
        currencyId: currencyId
      };
      let _queryAllOtcCurrencyList = await queryPrice(queryPriceParams);
      ratio = _queryAllOtcCurrencyList?.data?.data?.price;
      let number = _queryAllOtcCurrencyList?.data?.data?.number;
      let amount = _queryAllOtcCurrencyList?.data?.data?.amount;
      validUntil = 30;

      return { ratio, validUntil, number, amount };
    }

    // 非OTC365
    if (item?.tradeType === 2) {
      let isEvaluate = usdtType
        ? Number(buyNum) < currencyIdItem.min || Number(buyNum) > currencyIdItem.max
        : Number(buyNum) < faitCurrencyIdItem.min || Number(buyNum) > faitCurrencyIdItem.max; //是否默认询价（无输入）
      if (isEvaluate) {
        // 固定询价
        let evaluateParams = {
          serviceProviderId: item?.serviceProviderId,
          currencyId: currencyId,
          fiatCurrencyId: faitCurrencyId,
          quoteType: usdtType ? "AMOUNT" : "PRICE"
        };

        let _evaluate = await evaluate(evaluateParams);

        let data = _evaluate.data;
        if (data.code === 0) {
          ratio = data.data.price;
          validUntil = 30;
        }
      } else {
        // 有输入询价
        let quoteParams = {
          headers: { unique: uuid() },
          params: {
            serviceProviderId: item?.serviceProviderId,
            currencyId: currencyId,
            fiatCurrencyId: faitCurrencyId,
            price: usdtType ? null : buyNum,
            amount: usdtType ? buyNum : null,
            quoteType: usdtType ? "AMOUNT" : "PRICE"
          }
        };
        let _quote = await quote(quoteParams);
        let data = _quote.data;
        if (data.code === 0) {
          try {
            ratio = new Big(data.data.price).div(data.data.amount).toString();

            let _validUntil = data.data.validUntil;
            let now = dayjs().valueOf();
            let _during = Math.floor((Number(_validUntil) - Number(now)) / 1000);
            validUntil = _during;

            quoteId = data.data.quoteId;
          } catch (error) {}
        } else if (
          data.code === 202220007 ||
          data.code === 202220008 ||
          data.code === 202220011 ||
          data.code === 202220012 ||
          data.code === 202220013
        ) {
          init();
        }
      }

      return { ratio, validUntil, quoteId };
    }
  };

  const { run } = useDebounceFn(Enquiry, { wait: 2000 });

  const handleChangeFaitCurrency = (item) => {
    let _id = item?.currencyId;
    if (!_id) return;
    setFaitCurrencyId(_id);
    filterCurrencyAndFait(1, _id, 0, serviceProviderList);
  };

  const handleChangeCurrency = (item) => {
    console.log("handleChangeCurrency", item);
    let _id = item?.currencyId;
    if (!_id) return;
    setCurrencyId(_id);
    filterCurrencyAndFait(0, _id, 0, serviceProviderList);
  };

  const _setSupportFaitCurrencyList = (l) => {
    if (!l.length) return false;
    l.forEach((e) => {
      e.label = FiatCurrencyIcon(e, true);
      e.value = e.currencyId;
    });

    console.log("_setSupportFaitCurrencyList", l);

    setSupportFaitCurrencyList(l);
  };

  const _setSupportCurrencyList = (l) => {
    if (!l.length) return false;
    l.forEach((e) => {
      e.label = CurrencyIcon(e, true);
      e.value = e.currencyId;
    });

    console.log("_setSupportCurrencyList", l);

    setSupportCurrencyList(l);
  };

  const getBtnInfo = () => {
    queryVersion({ name: "otc_switch" }).then((res) => {
      // console.log('queryVersion', res)
      if (res?.data?.code === 0) {
        const otcObj = JSON.parse(res.data.data.description);
        setBtnAble(otcObj.otcDeposit);
      }
    });
  };

  const init = () => {
    let indexTab = 0; // 0:buy;1:sell

    getServiceProvider().then((res) => {
      let data = res.data;
      if (data.code === 0) {
        console.log("getServiceProvider", data);

        let _l = [];
        let _id;
        let _serviceProviderList = [...data.data.filter((el) => el.status === 1)];
        _serviceProviderList.forEach((e) => {
          e.supportCurrencyInfo?.forEach((el) => {
            if (
              !_l.some((ele) => ele.currencyId === el.currencyId) &&
              ((indexTab === 0 && el.purchaseEnabled) || (indexTab === 1 && el.saleEnabled))
            ) {
              _l.push(el);
            }
          });
        });

        if (!_l?.some((e) => e.currencyId === currencyId)) {
          _id = _l[0].currencyId;
        }

        setServiceProviderList(_serviceProviderList);
        _setSupportCurrencyList(_l);

        if (_id) {
          setCurrencyId(_id);
        }
        filterCurrencyAndFait(0, _id ? _id : currencyId, indexTab, _serviceProviderList, 1);
      }
    });
  };
  // useInterval(getOtcList, 10000);

  const getReg = (decimals) => {
    switch (decimals) {
      case 0:
        return /^(\d{0,10})$/;
      case 1:
        return /^(\d{0,10})(.\d{0,1})?$/;
      case 2:
        return /^(\d{0,10})(.\d{0,2})?$/;
      case 3:
        return /^(\d{0,10})(.\d{0,3})?$/;
      case 4:
        return /^(\d{0,10})(.\d{0,4})?$/;
      case 5:
        return /^(\d{0,10})(.\d{0,5})?$/;
      default:
        return /^(\d{0,10})(.\d{0,2})?$/;
    }
  };

  const handleNumChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    // value = value.replace(/[^0-9]/g, "");
    // if (value.length > 10) {
    //   value = value.slice(0, 10);
    // }
    // setBuyNum(value);

    let reg = null;

    if (usdtType) {
      //按数量购买
      reg = getReg(currencyIdItem?.decimals);
    } else {
      //按金额购买
      reg = getReg(faitCurrencyIdItem?.decimals);
    }

    if (reg.test(value) || value === "") {
      setBuyNum(value);
    }
  };

  const _setRatiolist = (value, _ratiolist) => {
    if (Number(value) <= 0) {
      setPayNum("0");
      setGetNum("0");
      // return;
    }

    let ratioItem = _ratiolist?.find(
      (r) => r?.serviceProviderTag === serviceProviderItem?.serviceProviderTag
    );
    if (ratioItem) {
      if (usdtType) {
        let numTemp;
        if (serviceProviderItem?.tradeType === 1) {
          numTemp = String(ratioItem?.amount || "") || "";
          // numTemp = new Big(Number(value) || 0)
          //   .times(ratioItem?.ratio || 0)
          //   .round(0, 3)
          //   .toString();
        } else if (serviceProviderItem?.tradeType === 2) {
          numTemp = toFix6(Number(value) * Number(ratioItem?.ratio));
        }

        setPayNum(numTemp);
        setGetNum(value);
      } else {
        let numTemp;
        if (serviceProviderItem?.tradeType === 1) {
          numTemp = String(ratioItem?.number || "") || "";
          // numTemp = new Big(Number(value) || 0)
          //   .div(ratioItem?.ratio || 1)
          //   .round(2, 0)
          //   .toString();
        } else if (serviceProviderItem?.tradeType === 2) {
          numTemp = toFix6(Number(value) / Number(ratioItem?.ratio));
        }
        setPayNum(value);
        setGetNum(numTemp);
      }
    }

    let _r = _ratiolist?.map((item) => {
      let _getNum = "0";
      let _payNum = "0";

      if (usdtType) {
        //按数量
        let numTemp;
        if (serviceProviderItem?.tradeType === 1) {
          numTemp = numTemp = String(item?.amount) || "";
          // numTemp = new Big(Number(value) || 0)
          //   .times(item?.ratio || 0)
          //   .round(0, 3)
          //   .toString();
        } else if (serviceProviderItem?.tradeType === 2) {
          numTemp = toFix6(Number(value) * Number(item?.ratio));
        }

        _payNum = numTemp;
        _getNum = value;
      } else {
        //按金额
        let numTemp;
        if (serviceProviderItem?.tradeType === 1) {
          numTemp = numTemp = String(item?.number) || "";
          // numTemp = new Big(Number(value) || 0)
          //   .div(item?.ratio || 1)
          //   .round(2, 0)
          //   .toString();
        } else if (serviceProviderItem?.tradeType === 2) {
          numTemp = toFix6(Number(value) / Number(item?.ratio));
        }

        _payNum = value;
        _getNum = numTemp;
      }
      console.log("_getNum", _getNum, _payNum);

      return { ...item, _getNum, _payNum };
    });

    setRatiolist(_r);
  };

  const changeBuyType = () => {
    setUsdtType(!usdtType);
    setBuyNum("");
    setGetNum("0");
    setPayNum("0");
  };

  const getValidInfo = () => {
    return userInfo && userInfo?.phone && certInfo && certInfo?.certificationGrade >= 1;
  };

  const onBuy = () => {
    if (!getValidInfo()) {
      message.error(t("RachargeCnyTips"));
      return false;
    }
    // if (usdtType && Number(buyNum) < currencyIdItem.min) {
    //   message.error(
    //     `${t('MinRecharge')}${currencyIdItem.min}${currencyIdItem.symbol}`
    //   )
    //   return false
    // }
    // if (!usdtType && Number(payNum) < faitCurrencyIdItem.min) {
    //   message.error(
    //     `${t('MinRecharge')}${faitCurrencyIdItem.min}${
    //       faitCurrencyIdItem.symbol
    //     }`
    //   )
    //   return false
    // }

    // if (getNum > currencyIdItem.max) {
    //   message.error(
    //     `${t('MaxRecharge')}${currencyIdItem.max}${currencyIdItem.symbol}`
    //   )
    //   return false
    // }

    let isEvaluate = usdtType
      ? Number(buyNum) < currencyIdItem.min || Number(buyNum) > currencyIdItem.max
      : Number(buyNum) < faitCurrencyIdItem.min || Number(buyNum) > faitCurrencyIdItem.max;
    if (isEvaluate) {
      message.error(
        usdtType
          ? `${t("Limit")}${currencyIdItem.min}~${currencyIdItem.max}`
          : `${t("Limit")}${faitCurrencyIdItem.min}～${faitCurrencyIdItem.max}`
      );
      setSubmiting(false);
      return false;
    }
    if (submiting) return false;
    setSubmiting(true);
    setTimeout(() => {
      setSubmiting(false);
    }, 10000);

    if (serviceProviderItem?.tradeType === 2) {
      let paymentParams = {
        headers: { unique: uuid() },
        params: {
          serviceProviderId: serviceProviderItem?.serviceProviderId,
          quoteId: ratiolist?.find(
            (el) => el.serviceProviderTag === serviceProviderItem?.serviceProviderTag
          )?.quoteId
        }
      };
      payment(paymentParams).then((res) => {
        let data = res.data;
        setSubmiting(false);

        if (data.code === 0 && data?.data?.paymentSuccess) {
          console.log("paymentParams", data);

          paymentUrl.current = data.data?.paymentUrl;
          paymentId.current = data.data?.paymentId;
          // setTimeout(() => {
          //   window.document.forms["payment_form"].submit();
          // }, 1000);
          let checkoutParams = {
            version: "1",
            partner: "ccfox",
            payment_flow_type: "wallet",
            return_url_success: "https://www.ccfox.com",
            return_url_fail: "https://www.ccfox.com",
            payment_id: data.data?.paymentId
          };
          httpPost(data.data?.paymentUrl, checkoutParams);
        } else if (data.code === 202220009 || data.code === 202220010) {
          setBuyNum("");
          init();
        }
      });
    } else if (serviceProviderItem?.tradeType === 1) {
      if (new Big(payNum || 0).lte(0) || new Big(getNum || 0).lte(0)) {
        message.error(t("noOffer"));
        setSubmiting(false);
        return false;
      }
      buy({
        params: {
          buyType: 1,
          currencyId: currencyId,
          quantity: getNum,
          syncUrl: `${window.location.origin}/otcBack`,
          otcName: serviceProviderItem?.serviceProviderTag,
          payCoinSign: faitCurrencyIdItem?.symbol || "CNY"
        },
        headers: { unique: uuid() }
      }).then((res) => {
        setSubmiting(false);
        if (res.data.code === 0) {
          // window.location.href = res.data.data.link
          let myWindow = window.open(res.data.data.link);
          myWindow.opener = null;
        } else if (res.data.code === 6071) {
          message.error(t("OTCMsg", { code: res.data.data }));
          return;
        }
      });
    }
  };

  const CurrencyIcon = (item, showLabel = false) => {
    return (
      <CurrencyIconContainer>
        {showLabel && (
          <CurrencyIconImg
            src={`https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/currency/${item.symbol}@3x.png`}
          />
        )}
        <span>{item.symbol}</span>
      </CurrencyIconContainer>
    );
  };

  const FiatCurrencyIcon = (item, showLabel = false) => {
    return (
      <CurrencyIconContainer>
        {showLabel && (
          <CurrencyIconImg
            src={`https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/fiat_currency_icon/${item.symbol}@3x.png`}
          />
        )}
        <span>{item.symbol}</span>
      </CurrencyIconContainer>
    );
  };

  const httpPost = (URL, PARAMS) => {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    temp.target = "_blank";

    for (var x in PARAMS) {
      var opt = document.createElement("textarea");
      opt.name = x;
      opt.value = PARAMS[x];
      temp.appendChild(opt);
    }

    document.body.appendChild(temp);
    temp.submit();
    temp.remove();

    // return temp;
  };

  return (
    <BuyWarp>
      {/* <CoinWarp>
        <img src={"/images/home/coin.png"} alt="" />
      </CoinWarp> */}
      <TitleRow>
        <TitleRowL>
          <Wallet />
          <span>{t("FastOtc")}</span>

          <div className="during-wrap">
            {Number(during) ? (
              `${during}s`
            ) : (
              <Loading width={16} color={"rgba(170, 164, 187, 1)"} />
            )}
          </div>
        </TitleRowL>

        <TitleRowR onClick={() => changeBuyType()}>
          <ChangeImg />
          <span>{usdtType ? t("BuyByAmount") : t("BuyByQty")}</span>
        </TitleRowR>
      </TitleRow>
      {/* <CoinRow>
        <img src={"/images/home/usdt.png"} alt="" />
        <span>USDT</span>
      </CoinRow> */}
      <CoinSelectWrap>
        <Select
          width={148}
          value={faitCurrencyId}
          options={supportFaitCurrencyList}
          onChange={handleChangeFaitCurrency}
          maxHeight={200}
          scale={"md"}
        />
        <ExchangeWrap>
          <Exchange />
        </ExchangeWrap>
        <Select
          width={148}
          value={currencyId}
          options={supportCurrencyList}
          onChange={handleChangeCurrency}
          maxHeight={200}
          scale={"md"}
        />
      </CoinSelectWrap>
      {/* <TypeRow>
        <span>{usdtType ? t("BuyByQty") : t("BuyByAmount")}</span>
        <aside onClick={() => changeBuyType()}>
          <ChangeImg />
          <span>{usdtType ? t("BuyByAmount") : t("BuyByQty")}</span>
        </aside>
      </TypeRow> */}
      <InputGroup
        mt={"10px"}
        hasClear={!!buyNum}
        clearClick={() => setBuyNum("")}
        endIcon={
          <CnyWarp>
            <span>{usdtType ? currencyIdItem.symbol : faitCurrencyIdItem.symbol}</span>
          </CnyWarp>
        }
      >
        <Input
          type="text"
          scale={"md"}
          placeholder={
            usdtType
              ? `${t("Limit")}${currencyIdItem.min}~${currencyIdItem.max}`
              : `${t("Limit")}${faitCurrencyIdItem.min}～${faitCurrencyIdItem.max}`
          }
          // placeholder={
          //   usdtType
          //     ? `${t("MinRecharge")}${currencyIdItem.min}${
          //         currencyIdItem.symbol
          //       }`
          //     : `${t("MinRecharge")}${faitCurrencyIdItem.min}${
          //         faitCurrencyIdItem.symbol
          //       }`
          // }
          value={buyNum}
          onChange={handleNumChange}
        />
      </InputGroup>
      {!usdtType ? (
        <InfoRow>
          <aside>
            {t("preGet")}({currencyIdItem.symbol}):
          </aside>
          <div>{Number(getNum) || "--"}</div>
        </InfoRow>
      ) : (
        <InfoRow>
          <aside>
            {t("preSend")}({faitCurrencyIdItem.symbol}):
          </aside>
          <div>{Number(payNum) || "--"}</div>
        </InfoRow>
      )}
      <ServicesProviderContainer onClick={onPresent1}>
        <OtcCardTop
          serviceProviderItem={serviceProviderItem}
          currencyIdItem={currencyIdItem}
          faitCurrencyIdItem={faitCurrencyIdItem}
          ratiolist={ratiolist}
          showArrow
        />
      </ServicesProviderContainer>

      <form id="payment_form" action={paymentUrl.current} method="post" target="_blank">
        <input type="hidden" name="version" value="1" />
        <input type="hidden" name="partner" value="ccfox" />
        <input type="hidden" name="payment_flow_type" value="wallet" />
        <input type="hidden" name="return_url_success" value="https://www.ccfox.com" />
        <input type="hidden" name="return_url_fail" value="https://www.ccfox.com" />
        <input type="hidden" name="payment_id" value={paymentId.current} />
      </form>

      {btnAble ? (
        <Button
          variant={"primary"}
          mt={"24px"}
          width="100%"
          onClick={onBuy}
          disabled={!buyNum || Number(buyNum) <= 0 || loading}
          isLoading={submiting}
        >
          {loading ? t("getPrice") : t("Confirm")}
        </Button>
      ) : (
        <Button variant={"primary"} mt={"24px"} width="100%" onClick={onBuy} disabled={true}>
          {t("Updating")}
        </Button>
      )}
    </BuyWarp>
  );
};

export default BuyCoin;
