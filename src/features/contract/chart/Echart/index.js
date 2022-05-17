import React, { useState, useEffect, useRef } from "react";
import { addProperty, repalceProperty } from "../../../../utils/calcFun";
import { useAppSelector } from "../../../../store/hook";
import { useTranslation } from "next-i18next";
import { EchartsContainer, EchartsWrap } from "./style";
import _ from "lodash";

const Big = require("big.js");
const echarts = require("echarts/lib/echarts");
// 引入饼状图组件
require("echarts/lib/chart/line");
// 引入提示框和title组件，图例
require("echarts/lib/component/tooltip");

function Depth() {
  const [lastPrice, setLastPrice] = useState(0);
  const [priceTick, setPriceTick] = useState(0);

  const { t } = useTranslation();

  const userHabit = useAppSelector((state) => state.app.userHabit);
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const futureQuot = useAppSelector((state) => state.contract.snapshot);
  const bidAskData = useAppSelector(
    (state) => state.orderBooks.bidsAsksForDepth
  );

  const options = useRef({
    animation: false,
    grid: { left: 45, top: 15, right: 25, bottom: 25 },
    textStyle: {
      color: "#90969D",
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      showContent: false,
      axisPointer: {
        lineStyle: {
          color: "rgba(0, 0, 0, 0)",
        },
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        formatter: function (val) {
          return val;
        },
      },
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        splitNumber: 4,
        axisTick: {
          inside: true,
        },
        axisLabel: {
          inside: false,
          showMinLabel: false,
          formatter: function (value) {
            value = value >= 1000 ? value / 1000 + "k" : value;
            return value;
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        data: [],
        name: t("BuyOrders"), // "买单"
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: false,
        symbolSize: 10,
        itemStyle: {
          color: "blue",
          borderColor: "yellow",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 10,
        },
        label: {
          show: true,
          position: "right",
          distance: 10,
          padding: 10,
          fontSize: 12,
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, .6)",
          formatter: (params) => {
            return [
              `${t("Buy")}${t("Price")} ：{a|${params.data[0]}}`,
              `${t("cumulant")} ：{a|${params.data[1]}}`,
            ].join("\n");
          },
          rich: {
            a: {
              color: "#fff",
              fontSize: "12",
              fontWeight: "bold",
              lineHeight: "20",
            },
          },
        },
        lineStyle: {
          color: "",
        },
        areaStyle: {
          color: "",
          opacity: 1,
        },
      },
      {
        data: [],
        name: t("SellOrders"),
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: false,
        symbolSize: 10,
        itemStyle: {
          color: "blue",
          borderColor: "yellow",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 10,
        },
        label: {
          show: true,
          position: "left",
          distance: 10,
          padding: 10,
          fontSize: 12,
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, .6)",
          formatter: (params) => {
            return [
              `${t("Sell")}${t("Price")} ：{a|${params.data[0]}}`,
              `${t("Accumulative")} ：{a|${params.data[1]}}`,
            ].join("\n");
          },
          rich: {
            a: {
              color: "#fff",
              fontSize: "12",
              fontWeight: "bold",
              lineHeight: "20",
            },
          },
        },
        lineStyle: {
          color: "",
        },
        areaStyle: {
          color: "",
          opacity: 1,
        },
      },
    ],
  });
  const depthChart = useRef(null);

  const _color = (upDownColor) => {
    if (!depthChart.current) return;

    let color1 = ["#16C666", "#294340"]; // 线-面  green
    let color2 = ["#E7462A", "#502E34"]; // red
    let buyColor = [];
    let sellColor = [];
    if (upDownColor === "0") {
      buyColor = color1;
      sellColor = color2;
    } else {
      buyColor = color2;
      sellColor = color1;
    }
    // this.options.series[0].itemStyle.normal.color = buyColor[0]
    options.current.series[0].lineStyle.color = buyColor[0];
    options.current.series[0].areaStyle.color = buyColor[1];
    // this.options.series[1].itemStyle.normal.color = sellColor[0]
    options.current.series[1].lineStyle.color = sellColor[0];
    options.current.series[1].areaStyle.color = sellColor[1];
    depthChart.current.setOption(options.current);
  };

  const draw = (bidAskData, lastPrice, priceTick) => {
    if (
      !depthChart.current ||
      !bidAskData?.bids?.length ||
      !bidAskData?.asks?.length
    )
      return;

    let { bids } = JSON.parse(JSON.stringify(bidAskData));
    let { asks } = JSON.parse(JSON.stringify(bidAskData));

    if (!lastPrice || !priceTick) return false;
   
    addProperty(bids);
    addProperty(asks);
    let bidsArr = bids.reverse();
    let asksArr = asks;
    repalceProperty(bidsArr);
    repalceProperty(asksArr);

    // draw
    options.current.series[0].data = bidsArr;
    options.current.series[1].data = asksArr;
    depthChart.current.setOption(options.current);
  };
  // const draw = (bidAskData, lastPrice, priceTick) => {
  //   if (
  //     !depthChart.current ||
  //     !bidAskData?.bids?.length ||
  //     !bidAskData?.asks?.length
  //   )
  //     return;

  //   let { bids } = JSON.parse(JSON.stringify(bidAskData));
  //   let { asks } = JSON.parse(JSON.stringify(bidAskData));

  //   if (!lastPrice || !priceTick) return false;
  //   let max = Math.floor(Number(new Big(lastPrice).times(1.005).toString()));
  //   let min = Math.floor(Number(new Big(lastPrice).times(0.995).toString()));
  //   max = Math.max(max, Number(new Big(lastPrice).plus(2).toString()));
  //   min = Math.min(min, Number(new Big(lastPrice).minus(2).toString()));
  //   addProperty(bids);
  //   addProperty(asks);
  //   let bidsArr = bids.reverse();
  //   let asksArr = asks;
  //   repalceProperty(bidsArr);
  //   repalceProperty(asksArr);
  //   // finalBidsv
  //   let finalBids = [];
  //   if (bidsArr.length > 2) {
  //     let bidsLen = bidsArr.findIndex((el) => Number(el[0]) > Number(min));
  //     finalBids = bidsArr.slice(bidsLen);
  //     if (finalBids.length < 2) return false;
  //     let numBids = Number(
  //       new Big(finalBids[1][0]).minus(min).div(priceTick).toString()
  //     );
  //     for (let i = 1; i < numBids; i++) {
  //       let temp = new Big(finalBids[0][0]).minus(priceTick).toString();
  //       finalBids.unshift([Number(temp), finalBids[0][1]]);
  //     }
  //     finalBids.unshift([Number(min), finalBids[0][1]]);
  //   }
  //   // finalAsks
  //   let finalAsks = [];
  //   if (asksArr.length > 2) {
  //     let asksLen = asksArr.findIndex((el) => Number(el[0]) > Number(max));
  //     finalAsks = asksArr.slice(0, asksLen);
  //     if (finalAsks.length < 2) return false;
  //     let numAsks = Number(
  //       new Big(max)
  //         .minus(finalAsks[finalAsks.length - 1][0])
  //         .div(priceTick)
  //         .toString()
  //     );
  //     for (let i = 1; i < numAsks; i++) {
  //       let temp = new Big(finalAsks[finalAsks.length - 1][0])
  //         .plus(priceTick)
  //         .toString();
  //       finalAsks.push([Number(temp), finalAsks[finalAsks.length - 1][1]]);
  //     }
  //     finalAsks.push([Number(max), finalAsks[finalAsks.length - 1][1]]);
  //   }
  //   // draw
  //   options.current.series[0].data = finalBids;
  //   options.current.series[1].data = finalAsks;
  //   depthChart.current.setOption(options.current);
  // };

  const listener = (element) => {
    // var width = element.offsetWidth;
    // var height = element.offsetHeight;
    // console.log("Size: " + width + "x" + height);
    depthChart.current && depthChart.current.resize();
  };

  useEffect(() => {
    depthChart.current = echarts.init(document.getElementById("myChart"));

    window.addEventListener("resize", _.throttle(listener, 200));

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  // useEffect(() => {
  //   depthChart.current = echarts.init(document.getElementById("myChart"));

  //   var erd = elementResizeDetectorMaker();
  //   erd.listenTo(
  //     document.getElementsByClassName("chart-container")[0],
  //     listener
  //   );

  //   return () => {
  //     erd.uninstall(document.getElementsByClassName("chart-container")[0]);
  //   };
  // }, []);

  useEffect(() => {
    draw(bidAskData, lastPrice, priceTick);
  }, [bidAskData, lastPrice, priceTick]);

  useEffect(() => {
    setLastPrice(futureQuot.lastPrice);
  }, [futureQuot]);

  useEffect(() => {
    setPriceTick(contractItem.priceTick);
  }, [contractId]);

  useEffect(() => {
    _color(userHabit.upDownColor);
  }, [userHabit]);

  return (
    <EchartsWrap calssName="depth-container">
      <EchartsContainer id="myChart" />
    </EchartsWrap>
  );
}

export default Depth;
