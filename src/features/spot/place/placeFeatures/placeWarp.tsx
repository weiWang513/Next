import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PlaceMode from "./placeMode";
import OrderType from "./orderType";
import PriceInput from "./priceInput";
import CountInput from "./countInput";
import Percentage from "./percentage";
import VolumeInput from "./volumeInput";
import Avali from "./avali";
import PlaceBtn from "./placeBtn";
import Login from "../../../../components/Place/login";
import { useAppSelector } from "../../../../store/hook";
import { useSelector } from "react-redux";
import { selectCurrentSpot } from "../../../../store/modules/spotSlice";
import {
  toFix6,
  getCurrencyPrecisionById,
  formatSpotPriceByTick,
  scientificNotationToString
} from "../../../../utils/filters";
import { getLastPrice } from "./getter";

const Big = require("big.js");

const PlaceD = styled.div`
  padding: 16px;
`;

const PlaceWarp = () => {
  const [side, setSide] = useState(1);
  const [priceTypeTab, setPriceTypeTab] = useState(1);
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [volume, setVolume] = useState("");
  const [percent, setPercent] = useState(0);

  const isLogin = useAppSelector((state) => state.app.isLogin);
  const contractItem = useSelector(selectCurrentSpot);
  const accountList = useAppSelector((state) => state.spot?.accountList);
  const orderPrice = useAppSelector((state) => state.spot?.orderPrice);
  const orderQty = useAppSelector((state) => state.spot?.orderQty);

  useEffect(() => {
    resetParams();
    // 之前是 切换买入/卖出 or 市价/限价，则重置表单（清空价格、数量、总额、百分比）
    // 改为：只有切换交易对，才重置。
  }, [side, priceTypeTab, contractItem?.contractId]);
  // }, [contractItem?.contractId]);

  useEffect(() => {
    // if (priceTypeTab === 1) {
    setPrice(formatSpotPriceByTick(orderPrice, contractItem?.contractId));
    // }
  }, [orderPrice]);
  useEffect(() => {
    setQty(formatQty(orderQty));
  }, [orderQty]);

  useEffect(() => {
    // 清空任何一个输入框，slider归0
    if (!(Number(price) * Number(qty) * Number(volume))) {
      setPercent(0);
    }
  }, [price, qty, volume]);

  const resetParams = () => {
    setPrice(priceTypeTab === 1 ? "" : getLastPrice());
    setQty("");
    setVolume("");
    setPercent(0);
  };

  const formatQty = (_v) => {
    let v = scientificNotationToString(_v);
    if (!contractItem?.lotSize || _v === "") {
      return "";
    }
    let ls = Number(contractItem?.lotSize).toString();

    let reg = /^\d+\.?\d*$/;
    // let regNumber = /^\d+\.?\d+$/;
    let regNumber = /^(([1-9]\d*)(\.?\d*)?|0\.\d*|0)$/;
    if (reg.test(v)) {
      if (ls && regNumber.test(v)) {
        if (new Big(_v || 0).lt(contractItem?.lotSize || 0)) {
          return _v;
        }
        let quantity = Number.isInteger(Number(new Big(v).div(ls)))
          ? v
          : new Big(Math.floor(new Big(v).div(ls))).times(ls).toString();
        return scientificNotationToString(quantity.length > 18 ? quantity.slice(0, 19) : quantity);
      } else {
        return scientificNotationToString(qty);
      }
    } else {
      return scientificNotationToString(qty);
    }
  };

  const onSetPrice = (v) => {
    setPrice(v);
    if (side > 0) {
      // if (volume) {
      //   if (v) {
      //     const quantity = new Big(volume).div(new Big(Number(v) || 1)).toString();
      //     setQty(formatQty(quantity));
      //   } else {
      //     setQty("");
      //     setPercent(0);
      //   }
      // } else {
      if (qty && v) {
        const vol = new Big(qty).times(new Big(v)).toString();
        setVolume(toFix6(vol, getCurrencyPrecisionById(contractItem.currencyId)));
      } else {
        setVolume("");
        setPercent(0);
      }
      // }
    } else {
      if (qty) {
        if (v) {
          const vol = new Big(qty).times(new Big(v)).toString();
          setVolume(toFix6(vol, getCurrencyPrecisionById(contractItem.currencyId)));
        } else {
          setVolume("");
          setPercent(0);
        }
      } else {
        if (volume && v) {
          const quantity = new Big(volume).div(new Big(Number(v) || 1)).toString();
          setQty(formatQty(quantity));
        } else {
          setQty("");
          setPercent(0);
        }
      }
    }
  };
  const onSetQty = (v) => {
    let _v = formatQty(v);
    setQty(_v);
    // if (price && _v) {
    const _getCurrencyPrecisionById = getCurrencyPrecisionById(contractItem.currencyId);
    const vol = new Big(_v || 0)
      .times(new Big(priceTypeTab === 1 ? price || 1 : getLastPrice()))
      .toString();

    let res = toFix6(vol, _getCurrencyPrecisionById);

    setVolume(res === "0" ? "" : res);
    // }

    if (!Number(v)) {
      setPercent(0);
    }
  };
  const onSetVolume = (v) => {
    setVolume(v);
    // if (price && v) {
    const quantity = new Big(v || 0)
      .div(new Big(priceTypeTab === 1 ? price || 1 : getLastPrice()))
      .toString();
    let res = formatQty(quantity);
    setQty(res === "0" ? "" : res);
    // }

    if (!Number(v)) {
      setPercent(0);
    }
  };
  const onSetPercent = (v) => {
    // 如果已经退出登录，那么退出后滑动条不应该影响成交额或者数量
    if (!isLogin) {
      return;
    }
    if (side > 0) {
      if (getCurrencyQty() > 0 && v > 0 && (priceTypeTab === 1 ? Number(price) : true)) {
        setPercent(v);

        let vol = new Big(v / 100).times(new Big(getCurrencyQty()));

        let takerFeeRatio = new Big(contractItem?.takerFeeRatio || 0).times(1.5);

        // maxCount * （1 + feeRate）* price = amount  最大杠杆扣除taker fee

        let amount = new Big(qty || 0)
          .times(new Big(1).plus(takerFeeRatio))
          .times(priceTypeTab === 1 ? price || 1 : getLastPrice());

        // 可用余额 大于 最大可开金额 ；可用余额需要减去手续费
        if (new Big(getCurrencyQty()).gt(amount)) {
          vol = new Big(vol || 0).div(new Big(1).plus(takerFeeRatio));
          let _qty = vol.div(priceTypeTab === 1 ? price || 1 : getLastPrice());
          onSetQty(_qty);
        } else {
          let _qty = vol.div(priceTypeTab === 1 ? price || 1 : getLastPrice());
          onSetQty(_qty);
        }
      } else {
        setVolume("");
        setQty("");
      }
    } else {
      if (getCommodityQty() > 0 && v > 0 && (priceTypeTab === 1 ? Number(price) : true)) {
        setPercent(v);

        const quantity = new Big(v / 100).times(new Big(getCommodityQty())).toString();
        onSetQty(toFix6(quantity, getCurrencyPrecisionById(contractItem.commodityId)));
      } else {
        setVolume("");
        setQty("");
      }
    }
  };

  const getCommodityQty = () => {
    if (!accountList.length || !contractItem || !contractItem.commodityId) {
      return "0";
    }
    const qtyItem = accountList.find((item) => item.currencyId === contractItem.commodityId);
    return qtyItem
      ? toFix6(qtyItem.available, getCurrencyPrecisionById(contractItem.commodityId))
      : "0";
  };

  const getCurrencyQty = () => {
    if (!accountList.length || !contractItem || !contractItem.currencyId) {
      return "0";
    }
    const qtyItem = accountList.find((item) => item.currencyId === contractItem.currencyId);
    return qtyItem
      ? toFix6(
          Number(qtyItem.available) || 0,
          Number(getCurrencyPrecisionById(contractItem.currencyId)) || 2
        )
      : "0";
  };

  // 如果退出登录，那么需要清除已经输入的价格、数量、成交额
  useEffect(() => {
    if (!isLogin) {
      setPrice("");
      setQty("");
      setVolume("");
      setPercent(0);
    }
  }, [isLogin]);

  return (
    <PlaceD>
      <PlaceMode side={side} changeSide={(v) => setSide(v)} />
      <OrderType priceTypeTab={priceTypeTab} changePriceType={(v) => setPriceTypeTab(v)} />
      <PriceInput priceTypeTab={priceTypeTab} price={price} changePrice={(v) => onSetPrice(v)} />
      <CountInput
        priceTypeTab={priceTypeTab}
        qty={qty}
        changeQty={(v) => {
          onSetQty(v);
          setPercent(0);
        }}
        volume={volume}
        changeVolume={(v) => {
          onSetVolume(v);
          setPercent(0);
        }}
      />
      <Percentage percent={percent} changePercent={(v) => onSetPercent(v)} />
      {priceTypeTab === 1 && (
        <VolumeInput
          volume={volume}
          changeVolume={(v) => {
            onSetVolume(v);
            setPercent(0);
          }}
          changeQty={(v) => {
            onSetQty(v);
            setPercent(0);
          }}
        />
      )}
      {isLogin ? (
        <>
          <Avali
            side={side}
            changePrice={(v) => onSetPrice(v)}
            changeQty={(v) => onSetQty(v)}
            changeVolume={(v) => onSetVolume(v)}
            commodityQty={getCommodityQty()}
            currencyQty={getCurrencyQty()}
          />
          <PlaceBtn
            side={side}
            price={price}
            qty={qty}
            priceTypeTab={priceTypeTab}
            resetParams={resetParams}
          />
        </>
      ) : (
        <Login />
      )}
    </PlaceD>
  );
};

export default PlaceWarp;
