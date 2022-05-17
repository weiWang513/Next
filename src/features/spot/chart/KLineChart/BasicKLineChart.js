import React, { useState, useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";
// import useInterval from "../hook";
import Spin from "../../../../components/Spin";

import { getKline } from "../../../../services/api/spot";
// var elementResizeDetectorMaker = require("element-resize-detector");
import { BasicKLine } from "./style";
import _ from "lodash";
import { dateFormat, scientificNotationToString } from "../../../../utils/filters";
import { formatBigNumber } from "../../../../utils/format";
import Big from "big.js";

export default function BasicKLineChart(props) {
  const kline = useRef(null);
  const [indicator, setIndicator] = useState("");
  const [restfulReady, setRestfulReady] = useState(false);
  const [spinning, setSpinning] = useState(true);

  const resize = () => {
    kline.current && kline.current.resize();
  };

  const listener = (element) => {
    resize();
  };

  useEffect(() => {
    window.addEventListener("resize", _.throttle(listener, 200));

    const kLineChart = init("basic-k-line");
    kline.current = kLineChart;

    kLineChart.setCandleStickTechnicalIndicatorType(localStorage.getItem("KLINE_MAIN_INDICTOR"));
    kLineChart.createTechnicalIndicator("VOL");

    kLineChart.setOffsetRightSpace(80);
    kLineChart.setDataSpace(8);

    return () => {
      window.removeEventListener("resize", listener);
      dispose("basic-k-line");
    };
  }, []);

  useEffect(() => {
    kline.current && kline.current.setCandleStickTechnicalIndicatorType(props.indictorMaster);
  }, [props.indictorMaster]);

  useEffect(() => {
    indicator && kline.current && kline.current.removeTechnicalIndicator(indicator);
    var tag = kline.current && kline.current.createTechnicalIndicator(props.indictorSub);
    setIndicator(tag);
  }, [props.indictorSub]);

  useEffect(() => {
    if (!kline.current || props.userHabit.locale === "") return;

    let upDownColor = props.userHabit.upDownColor;
    let language = props.userHabit.locale;

    kline.current.setStyleOptions({
      grid: {
        horizontal: {
          display: false
        }
      },
      candleStick: {
        bar: {
          style: "solid",
          upColor: upDownColor === "0" ? "rgba(20, 175, 129, 1)" : "rgba(236, 81, 109, 1)",
          downColor: upDownColor === "0" ? "rgba(236, 81, 109, 1)" : "rgba(20, 175, 129, 1)",
          noChangeColor: "#666666"
        },
        priceMark: {
          last: {
            display: true,
            upColor: upDownColor === "0" ? "rgba(20, 175, 129, 1)" : "rgba(236, 81, 109, 1)",
            downColor: upDownColor === "0" ? "rgba(236, 81, 109, 1)" : "rgba(20, 175, 129, 1)",
            noChangeColor: "#666666",
            line: {
              display: true,
              // 'solid'|'dash'
              style: "dash",
              dashValue: [4, 4],
              size: 1
            }
          }
        }
      },
      realTime: {
        timeLine: {
          color: "#1e88e5",
          size: 1,
          areaFillColor: "rgba(30, 136, 229, 0.08)"
        },
        averageLine: {
          display: false,
          color: "#F5A623",
          size: 1
        }
      },
      xAxis: {
        axisLine: {
          color: "rgba(255, 255, 255, 0.1)"
        }
      },
      yAxis: {
        axisLine: {
          color: "rgba(255, 255, 255, 0.1)"
        },
        tickText: {
          position: "inside"
        }
      },
      floatLayer: {
        displayRule: "follow_cross",
        prompt: {
          candleStick: {
            showType: "standard",
            labels:
              language === "zh_CN"
                ? ["时间", "开", "高", "低", "收", "成交量"]
                : language === "zh_TW"
                ? ["時間", "開", "高", "低", "收", "成交量"]
                : ["T", "O", "H", "L", "C", "V"],
            values: (kLineData) => {
              return [
                { value: dateFormat(kLineData.timestamp) },
                { value: kLineData.open },
                { value: kLineData.high },
                { value: kLineData.low },
                { value: kLineData.close },
                { value: formatBigNumber(kLineData.volume) }
              ];
            }
          }
        },
        rect: {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          left: 2,
          top: 2,
          right: 2,
          borderRadius: 4,
          borderSize: 1,
          borderColor: "#3f4254",
          fillColor: "rgba(17, 17, 17, .3)"
        },
        text: {
          size: 10,
          color: "#D9D9D9",
          family: "Arial",
          marginLeft: 0,
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0
        }
      }
    });
  }, [props.userHabit, kline.current]);

  const setPrecision = () => {
    if (!Number(props.currentSpot?.priceTick)) return;

    let precision = 1;
    let item = scientificNotationToString(Number(props.currentSpot?.priceTick) || "0")?.split(".");

    if (item[1]) {
      precision = item[1].length;
    }
    kline.current && kline.current.setPrecision(Number(precision), Number(precision));
  };

  const _getKline = () => {
    getKline({ symbol: props.contractId, range: props.range, point: 300 }).then((res) => {
      let arr = res.data.data.lines.map((el) => ({
        open: Number(el[1]),
        low: Number(el[3]),
        high: Number(el[2]),
        close: Number(el[4]),
        volume: Number(el[5]),
        timestamp: el[0]
      }));
      props.Type !== 0
        ? kline.current.setCandleStickChartType("real_time")
        : kline.current.setCandleStickChartType("candle_stick");
      kline.current.applyNewData(arr);
      setRestfulReady(true);
      setSpinning(false);
    });
  };

  // useInterval(_getKline, 1000 * 5 * 60, false);

  useEffect(() => {
    setPrecision();
  }, [props.currentSpot]);

  useEffect(() => {
    if (Number(props.contractId) !== Number(props.futureKline.contractId)) return;
    if (Number(props.range) !== Number(props.futureKline.range)) return;

    let el =
      props.futureKline &&
      props.futureKline.lines &&
      props.futureKline.lines[props.futureKline.lines.length - 1];
    if (kline.current && el && el.length > 4) {
      let newData = {
        open: Number(el[1]),
        low: Number(el[3]),
        high: Number(el[2]),
        close: Number(el[4]),
        volume: Number(el[5]),
        timestamp: el[0]
      };
      restfulReady && kline.current.updateData(newData);
    }
  }, [props.futureKline]);

  useEffect(() => {
    if (!kline.current) return;
    // console.log('futureTick',props.futureTick)
    const dataList = kline.current && kline.current.getDataList();
    if (!dataList.length) return;
    const lastData = dataList[dataList.length - 1];

    let el = props.futureTick && props.futureTick.trades;
    if (Number(props.contractId) !== Number(props.futureTick.contractId)) return;

    if (kline.current && el && el.length > 2) {
      let newData = {
        open: lastData.open,
        low: lastData.low,
        high: lastData.high,
        close: Number(el[1]),
        volume: Number(new Big(lastData.volume || 0).plus(el[2] || 0).toString()),
        timestamp: lastData.timestamp
      };
      restfulReady && kline.current.updateData(newData);
    }
  }, [props.futureTick]);

  useEffect(() => {
    if (!props.contractId || !kline.current || !props.range) return;

    setSpinning(true);
    setRestfulReady(false);

    _getKline();

    setPrecision();
  }, [props.contractId, props.range, props.Type]);

  return (
    <Spin loading={spinning}>
      <BasicKLine id="basic-k-line" className="k-line-chart" />
    </Spin>
  );
}
