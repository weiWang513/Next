import React, { useState, useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";
// import useInterval from "../hook";
import Spin from "../../../../components/Spin";

import { getKline } from "../../../../services/api/contract";
import { BasicKLine } from "./style";
import _ from "lodash";
import { dateFormat, scientificNotationToString } from "../../../../utils/filters";
import { formatBigNumber } from "../../../../utils/format";

// TODO: 这个函数没有引用到，应该删除，而且Tooltip已经改为 TOHLC 的顺序
function getChartLanguage(language) {
  return {
    floatLayer: {
      prompt: {
        candleStick: {
          labels:
            language === "zh_CN"
              ? ["时间", "开", "收", "高", "低", "成交量"]
              : language === "zh_TW"
              ? ["時間", "開", "收", "高", "低", "成交量"]
              : ["T", "O", "C", "H", "L", "V"]
        }
      }
    }
  };
}

// TODO: 这个函数没有引用到，应该删除
function getChartBarColor(upDownColor) {
  return {
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
    }
  };
}

export default function BasicKLineChart(props) {
  const kline = useRef(null);
  const [indicator, setIndicator] = useState("");
  const [restfulReady, setRestfulReady] = useState(false);
  const [spinning, setSpinning] = useState(true);

  const resize = () => {
    // var klineDom = document.getElementById("basic-k-line");
    // var chart = document.getElementsByClassName("chart-container")[0];
    // var height = chart.offsetHeight;
    // var width = chart.offsetWidth;
    // //获取屏幕大小 动态设置K线的div大小
    // klineDom.style.width = width - 6 + "px";
    // klineDom.style.height = height - 38 + "px";
    kline.current && kline.current.resize();
  };

  const listener = (element) => {
    // var width = element.offsetWidth;
    // var height = element.offsetHeight;
    // console.log("Size: " + width + "x" + height);
    resize();
  };

  useEffect(() => {
    window.addEventListener("resize", _.throttle(listener, 200));

    const kLineChart = init("basic-k-line");
    kline.current = kLineChart;

    kLineChart.setCandleStickTechnicalIndicatorType(localStorage.getItem("KLINE_MAIN_INDICTOR"));
    kLineChart.createTechnicalIndicator("VOL");
    // setIndicator(
    //   kLineChart.createTechnicalIndicator(
    //     localStorage.getItem("KLINE_SUB_INDICTOR")
    //   )
    // );

    kLineChart.setOffsetRightSpace(80);
    kLineChart.setDataSpace(8);

    return () => {
      window.removeEventListener("resize", listener);
      dispose("basic-k-line");
    };
  }, []);

  // useEffect(() => {
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
    kline.current && kline.current.setCandleStickTechnicalIndicatorType(props.indictorMaster);
  }, [props.indictorMaster]);

  useEffect(() => {
    indicator && kline.current && kline.current.removeTechnicalIndicator(indicator);
    var tag = kline.current && kline.current.createTechnicalIndicator(props.indictorSub);
    setIndicator(tag);
  }, [props.indictorSub]);

  useEffect(() => {
    if (!kline.current || props.userHabit.locale === "") return;

    // kline.current.setStyleOptions(getChartLanguage(props.userHabit.locale));
    // kline.current.setStyleOptions(
    //   getChartBarColor(props.userHabit.upDownColor)
    // );

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
    if (!Number(props.contractItem?.priceTick)) return;

    let precision = 1;
    let item = scientificNotationToString(Number(props.contractItem.priceTick) || "0").split(".");

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

  useEffect(() => {
    setPrecision();
  }, [props.contractItem]);

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
        volume: Number(lastData.volume) + Number(el[2]),
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

    // getKline({ symbol: props.contractId, range: props.range, point: 300 }).then(res => {
    //   let arr = res.data.data.lines.map(el => ({
    //     open: Number(el[1]),
    //     low: Number(el[3]),
    //     high: Number(el[2]),
    //     close: Number(el[4]),
    //     volume: Number(el[5]),
    //     timestamp: el[0],
    //   }))
    //   props.Type !== 0 && kLineChart.setCandleStickChartType('real_time')
    //   kLineChart.applyNewData(arr)
    //   setRestfulReady(true)
    // })

    setPrecision();
    // setSpinning(false);
  }, [props.contractId, props.range, props.Type]);

  // var styleText = {
  //   width: "100%",
  //   height: "100%",
  //   background: "rgba(19, 15, 29, 1)",
  // };

  return (
    <Spin loading={spinning}>
      <BasicKLine
        id="basic-k-line"
        // style={styleText}
        className="k-line-chart"
      />
    </Spin>
  );
}
