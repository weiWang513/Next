import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import { getKline } from "../../services/api/contract";
import useUpDownColor from "../../hooks/useUpDownColor";
import { useAppSelector } from "../../store/hook";
import { selectUserHabit } from "../../store/modules/appSlice";
import { selectIndictorList } from "../../store/modules/contractSlice";
import useInterval from "../../hooks/useInterval";

export const IndicatorChart = ({ item, candlesticksItem }) => {
  const [timeList, setTimeList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [option, setOption] = useState({});

  const { colorUp, colorDown, colorUpArea, colorDownArea } = useUpDownColor();
  const userHabit = useAppSelector(selectUserHabit);
  const indictorList = useAppSelector(selectIndictorList);

  const onClickChart = (e) => {
    console.log("打印", e);
  };

  const onEvents = {
    click: onClickChart,
  };

  const _getKline = () => {
    if (!item.contractId) return;

    const params = {
      symbol: item.contractId,
      range: "60000",
      // range: "3600000",
      point: 50,
    };
    getKline(params).then((res) => {
      const lines = res?.data?.data?.lines || [];
      const _timeList = lines.map((el) => el[0]);
      setTimeList(_timeList);
      const _priceList = lines.map((el) => Number(el[4]));
      setPriceList(_priceList);
    });
  };

  const updateOption = () => {
    const indictorListItem: { result } = indictorList?.find(
      (el: any) => el.contractId === item.contractId
    );
    const priceChangeRadio = indictorListItem?.result?.priceChangeRadio;

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
        data: timeList,
      },
      yAxis: {
        type: "value",
        show: false,
        scale: true,
      },
      series: [
        {
          data: priceList,
          type: "line",
          symbol: "none",
          axisLine: {
            show: false,
          },
          itemStyle: {
            color: priceChangeRadio > 0 ? colorUp : colorDown,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: priceChangeRadio > 0 ? colorUp : colorDown,
              },
              {
                offset: 0.6,
                color: priceChangeRadio > 0 ? colorUpArea : colorDownArea,
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

  useInterval(_getKline, 1000 * 60 * 60, false);

  useEffect(() => {
    let isActive = true;
    isActive && updateOption();

    return () => {
      isActive = false;
    };
  }, [timeList, priceList, userHabit, indictorList]);

  useEffect(() => {
    let isActive = true;
    isActive && item.contractId && _getKline();

    return () => {
      isActive = false;
    };
  }, [item.contractId]);

  return (
    <div>
      <ReactEcharts
        option={option}
        onEvents={onEvents}
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
