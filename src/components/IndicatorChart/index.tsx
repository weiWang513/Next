import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import useUpDownColor from "../../hooks/useUpDownColor";
import { useAppSelector } from "../../store/hook";
import { selectUserHabit } from "../../store/modules/appSlice";
import { selectIndictorList } from "../../store/modules/contractSlice";

export const IndicatorChart = ({ candlesticksItem, pcr }) => {
  // const [timeList, setTimeList] = useState([]);
  // const [priceList, setPriceList] = useState([]);
  const [option, setOption] = useState({});

  const { colorUp, colorDown, colorUpArea, colorDownArea } = useUpDownColor();
  // const indictorList = useAppSelector(selectIndictorList);

  const onClickChart = (e) => {
    console.log("打印", e);
  };

  const onEvents = {
    click: onClickChart,
  };

  const updateOption = (_timeList, _priceList) => {
    // const indictorListItem: { result } = indictorList?.find(
    //   (el: any) => el.contractId === candlesticksItem?.contractId
    // );
    // const priceChangeRadio = indictorListItem?.result?.priceChangeRadio;
    const priceChangeRadio = pcr;

    setOption({
      animation: false,
      grid: {
        top: 2,
        bottom: 2,
        left: 0,
        right: 0,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        show: false,
        axisLine: {
          // show: false,
        },
        data: _timeList,
      },
      yAxis: {
        type: "value",
        show: false,
        scale: true,
      },
      series: [
        {
          data: _priceList,
          type: "line",
          symbol: "none",
          axisLine: {
            show: false,
          },
          itemStyle: {
            color:
              priceChangeRadio === 0
                ? "#fff"
                : priceChangeRadio > 0
                ? colorUp
                : colorDown,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color:
                  priceChangeRadio === 0
                    ? "#fff"
                    : priceChangeRadio > 0
                    ? colorUp
                    : colorDown,
              },
              {
                offset: 0.6,
                color:
                  priceChangeRadio === 0
                    ? "#fff"
                    : priceChangeRadio > 0
                    ? colorUpArea
                    : colorDownArea,
              },
              {
                offset: 1,
                color: "rgba(255,255,255,0)",
              },
            ]),
          },
        },
      ],
    });
  };

  useEffect(() => {
    if (!candlesticksItem?.candlestick) return;
    let isActive = true;
    if (isActive) {
      const candlestick = candlesticksItem?.candlestick || [];
      const _timeList = candlestick.map((el) => el[0]);
      // setTimeList(_timeList);
      const _priceList = candlestick.map((el) => Number(el[4]));
      // setPriceList(_priceList);
      updateOption(_timeList, _priceList);
    }

    return () => {
      isActive = false;
    };
    // }, [candlesticksItem, indictorList]);
  }, [candlesticksItem]);

  return (
    <div>
      <ReactEcharts
        option={option}
        onEvents={onEvents}
        lazyUpdate={true}
        notMerge={true}
        style={{
          height: "48px",
          width: "88px",
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default IndicatorChart;
