import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import Datafeed from "./api";
import { useTranslation } from "react-i18next";
import useInterval from "../hook";
import { TVChartContainerStyle } from "./style";
import Spin from "../../../../components/Spin";
import { getKline } from "../../../../services/api/spot";
import { btnListFixed } from "../list";
import { resovleTVData } from "../../../../hooks/useSocketIO";
import {
  resolveSavedWidgetContent,
  getSavedWidgetContentItem,
  setSavedWidgetContentItem
} from "../../../../utils/utils";

// function getLanguageFromURL() {
//   const regex = new RegExp('[\\?&]lang=([^&#]*)')
//   const results = regex.exec(window.location.search)
//   return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
// }

const TVChartContainer = (props, ref) => {
  const containerId = "tv_chart_container";
  const libraryPath = "/charting_library/";
  const chartsStorageUrl = "https://saveload.tradingview.com";
  const clientId = "tradingview.com";
  const userId = "public_user_id";
  const fullscreen = false;
  const autosize = true;
  const chart = useRef();
  const widget = useRef();
  const [spinning, setSpinning] = useState(true);
  const positionLineLong = useRef();
  const positionLineShort = useRef();
  const [positionLineCountLong, setPositionLineCountLong] = useState(0);
  const [positionLineCountShort, setPositionLineCountShort] = useState(0);

  const pollCount = useRef(0);
  const savedWidgetContent = useRef(null);

  const { t } = useTranslation();

  const symbol = () => {
    return props.contractItem && props.contractId ? props.contractItem.symbol : "ccfox";
  };

  const interval = () => {
    return props.resolution ? props.resolution : "15";
  };

  const getLanguageFromURL = () => {
    if (props.userHabit.locale === "zh_CN" || props.userHabit.locale === "zh_TW") {
      return "zh";
    } else {
      return "en";
    }
  };

  const initTV = () => {
    if (!window?.TradingView) {
      setTimeout(() => {
        if (pollCount.current <= 5) {
          initTV();
          pollCount.current += 1;
        }
      }, 2000);
      return;
    } else {
      pollCount.current = 0;
    }

    setSpinning(true);
    let color = ["#14AF81", "#EC516D"]; // green-red
    let buyColor = "";
    let sellColor = "";

    if (props.userHabit.upDownColor === "0") {
      buyColor = color[0];
      sellColor = color[1];
    } else {
      buyColor = color[1];
      sellColor = color[0];
    }
    const widgetOptions = {
      debug: false,
      symbol: symbol(),
      supported_resolutions: [
        "1",
        "3",
        "5",
        "15",
        "30",
        "60",
        "120",
        "240",
        "360",
        "720",
        "1D",
        "1W"
      ],
      datafeed: Datafeed,
      timezone: "Asia/Shanghai",
      interval: interval(),
      session: "24x7",
      container_id: containerId,
      library_path: libraryPath,
      locale: getLanguageFromURL() || "zh",
      charts_storage_url: chartsStorageUrl,
      client_id: clientId,
      user_id: userId,
      fullscreen: fullscreen,
      autosize: autosize,
      overrides: {
        // "mainSeriesProperties.showCountdown": false,
        // "paneProperties.legendProperties.showLegend": false,
        "paneProperties.background": "#130F1D",
        "paneProperties.vertGridProperties.color": "#08060F",
        "paneProperties.horzGridProperties.color": "#08060F",
        "paneProperties.topMargin": "9",
        "paneProperties.bottomMargin": "1",
        "paneProperties.axisProperties.percentage": false,
        // "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#AAA",
        "mainSeriesProperties.candleStyle.drawBorder": false,
        "mainSeriesProperties.candleStyle.upColor": buyColor,
        "mainSeriesProperties.candleStyle.downColor": sellColor,
        "mainSeriesProperties.candleStyle.borderUpColor": buyColor,
        "mainSeriesProperties.candleStyle.borderDownColor": sellColor,
        "mainSeriesProperties.candleStyle.wickUpColor": buyColor,
        "mainSeriesProperties.candleStyle.wickDownColor": sellColor,
        "paneProperties.legendProperties.showLegend": false,
        "symbolWatermarkProperties.color": "rgba(119, 140, 162, .3)"
      },
      // overrides:bg,
      toolbar_bg: "#130F1D",
      loading_screen: {
        backgroundColor: "#130F1D"
        // foregroundColor: "#191919"
      },
      theme: "Dark",
      // custom_css_url: process.env.PUBLIC_URL + 'charting_library/chart.css',
      disabled_features: [
        "header_widget", //隐藏头部组件
        "header_symbol_search", // 头部搜索
        "header_indicators", // 图标指标
        "adaptive_logo", // 移动端可以隐藏logo
        "constraint_dialogs_movement",
        "header_interval_dialog_button",
        "show_interval_dialog_on_key_press",
        "symbol_search_hot_key",
        "display_market_status",
        "header_chart_type", // k线样式
        "header_compare", // 图表对比
        "header_undo_redo", // 撤销返回
        "header_screenshot", // 截图
        "volume_force_overlay", // 防止他们重叠
        "header_settings", // 设置
        "header_fullscreen_button", // 全屏
        "timeframes_toolbar", // 下面的时间
        "symbol_info",
        "border_around_the_chart",
        "main_series_scale_menu",
        "header_resolutions", // todo: przetestowac// 头部的时间
        "control_bar", //todo: przetestowac
        "pane_context_menu",
        "legend_context_menu",
        "show_hide_button_in_legend",
        "snapshot_trading_drawings"
      ],
      enabled_features: [
        "hide_last_na_study_output",
        "move_logo_to_main_pane",
        "side_toolbar_in_fullscreen_mode"
      ],
      studies_overrides: {
        "volume.volume.color.0": sellColor, // 第一根的颜色
        "volume.volume.color.1": buyColor, // 第二根的颜色
        "volume.volume.transparency": 100 // 透明度
      },
      saved_data: savedWidgetContent.current || null,
      auto_save_delay: 2
    };

    const _widget = (window.tvWidget = new window.TradingView.widget(widgetOptions));

    const _eid = [];

    _widget.onChartReady(() => {
      chart.current = _widget.chart();
      widget.current = _widget;

      // try {
      //   // let _savedWidgetContent =
      //   //   savedWidgetContent?.current ||
      //   //   JSON.parse(window.localStorage.getItem("tv_chart_save")) ||
      //   //   null;
      //   let _savedWidgetContent = savedWidgetContent?.current || null;

      //   if (_savedWidgetContent) {
      //     // _savedWidgetContent = resolveSavedWidgetContent(
      //     //   _savedWidgetContent,
      //     //   symbol(),
      //     //   interval(),
      //     //   buyColor,
      //     //   sellColor
      //     // );

      //     // savedWidgetContent.current = _savedWidgetContent;
      //     // _widget.load(_savedWidgetContent);

      //     setSpinning(false);
      //   } else {
      //     setSpinning(false);
      //   }
      // } catch (error) {
      //   console.log("tv_chart_save error", error);
      //   setSpinning(false);
      // }

      // chart.current.setResolution(interval());

      _widget.subscribe("onAutoSaveNeeded", function (e) {
        _widget.save((data) => {
          console.log("savedWidgetContent", data);
          savedWidgetContent.current = data;

          setSavedWidgetContentItem(props.contractId, savedWidgetContent?.current);
          // window.localStorage.setItem(
          //   "tv_chart_save",
          //   JSON.stringify(savedWidgetContent?.current || {})
          // );
        });
      });

      // chart.current.createStudy('MACD', false, false, [12, 26, 'close', 9], e => {})

      chart.current.onIntervalChanged().subscribe(null, function (interval, obj) {
        _widget.changingInterval = false;
      });

      chart.current.setChartType(props.chartType ? 3 : 1);

      // widget.current.chart().createStudy(
      //   "Moving Average",
      //   false,
      //   false,
      //   [5],
      //   function (entityId) {
      //     _eid.push(entityId);
      //   },
      //   {
      //     "Plot.linewidth": 1,
      //     "Plot.color": "#EAC9F7"
      //   }
      // );
      // widget.current.chart().createStudy(
      //   "Moving Average",
      //   false,
      //   false,
      //   [10],
      //   function (entityId) {
      //     _eid.push(entityId);
      //   },
      //   {
      //     "Plot.linewidth": 1,
      //     "Plot.color": "#FFD787"
      //   }
      // );
      // widget.current.chart().createStudy(
      //   "Moving Average",
      //   false,
      //   false,
      //   [30],
      //   function (entityId) {
      //     _eid.push(entityId);
      //   },
      //   {
      //     "Plot.linewidth": 1,
      //     "Plot.color": "#B8D4FF"
      //   }
      // );
      // console.log("Chart has loaded!");
      setSpinning(false);
    });
  };

  const _indictor = () => {
    chart.current.executeActionById("insertIndicator");
  };

  const _camera = () => {
    widget.current.takeScreenshot();
  };

  const _setting = () => {
    chart.current.executeActionById("chartProperties");
  };

  const drawPositionLine = (newer) => {
    let color = ["rgba(236, 81, 109, 1)", "rgba(20, 175, 129, 1)"]; // red-green
    let buyColor = "";
    let sellColor = "";
    if (props.userHabit.upDownColor === "0") {
      buyColor = color[1];
      sellColor = color[0];
    } else {
      buyColor = color[0];
      sellColor = color[1];
    }

    if (chart.current && chart.current.createPositionLine) {
      if (!newer.length) {
        positionLineLong.current.remove();
        setPositionLineCountLong(0);
        positionLineShort.current.remove();
        setPositionLineCountShort(0);
        return;
      }

      let longItem = newer.find((el) => el.side === 1);
      let shortItem = newer.find((el) => el.side === -1);

      if (!longItem) {
        positionLineLong.current && positionLineLong.current.remove();
        setPositionLineCountLong(0);
      }
      if (!shortItem) {
        positionLineShort.current && positionLineShort.current.remove();
        setPositionLineCountShort(0);
      }

      newer.forEach((el) => {
        let posiQty = el.posiQty;
        let openPrice = el.openPrice;
        let lineColor = posiQty > 0 ? buyColor : sellColor;

        if (el.side === 1) {
          // long
          if (positionLineCountLong === 0) {
            positionLineLong.current = chart.current
              .createPositionLine()
              .onClose("onClose called", function (text) {
                this.remove();
                setPositionLineCountLong(2);
              })
              .setExtendLeft(true)
              .setLineStyle(0)
              .setBodyTextColor("#fff")
              .setLineLength(25)
              .setBodyFont("normal 9pt Verdana")
              .setQuantityFont("normal 9pt Verdana");

            console.log(props.posListProps, "props.posListProps");

            setPositionLineCountLong(positionLineCountLong + 1);
          }
          if (positionLineCountLong !== 2) {
            positionLineLong.current
              .setLineColor(lineColor)
              .setBodyBorderColor(lineColor)
              .setBodyBackgroundColor(lineColor)
              .setQuantityBorderColor(lineColor)
              .setQuantityBackgroundColor(lineColor)
              .setCloseButtonBorderColor(lineColor)
              .setCloseButtonIconColor(lineColor)
              .setQuantity(posiQty)
              .setPrice(Number(openPrice))
              .setText(Number(posiQty) > 0 ? t("tvLong") : t("tvShort"));
          }
        } else if (el.side === -1) {
          // short
          if (positionLineCountShort === 0) {
            positionLineShort.current = chart.current
              .createPositionLine()
              .onClose("onClose called", function (text) {
                this.remove();
                setPositionLineCountShort(2);
              })
              .setExtendLeft(true)
              .setLineStyle(0)
              .setBodyTextColor("#fff")
              .setLineLength(25)
              .setBodyFont("normal 9pt Verdana")
              .setQuantityFont("normal 9pt Verdana");
            setPositionLineCountShort(positionLineCountShort + 1);
          }
          if (positionLineCountShort !== 2) {
            positionLineShort.current
              .setLineColor(lineColor)
              .setBodyBorderColor(lineColor)
              .setBodyBackgroundColor(lineColor)
              .setQuantityBorderColor(lineColor)
              .setQuantityBackgroundColor(lineColor)
              .setCloseButtonBorderColor(lineColor)
              .setCloseButtonIconColor(lineColor)
              .setQuantity(posiQty)
              .setPrice(Number(openPrice))
              .setText(Number(posiQty) > 0 ? t("tvLong") : t("tvShort"));
          }
        }
      });
    }
  };

  const intervalPoll = () => {
    // setPositionLineCountLong(0);
    // setPositionLineCountShort(0);
    // initTV();

    // if (!spinning) {
    //   try {
    //     let list = props.posListProps.filter(
    //       (el) => el.contractId === props.contractItem.contractId
    //     );
    //     if (list.length > 0) {
    //       drawPositionLine(list);
    //     }
    //   } catch (err) {}
    // }

    let range = btnListFixed.find((el) => el.resolution === props.resolution)?.Range || 0;

    if (range) {
      const qs = {
        symbol: props.contractId,
        range,
        point: 5
      };

      getKline(qs).then((response) => {
        let res = response.data;
        let data = res.data;

        resovleTVData(data);
      });
    }
  };

  useImperativeHandle(ref, () => ({
    _indictor,
    _camera,
    _setting
  }));

  useEffect(() => {
    if (props.contractId && props.resolution && props.userHabit.locale !== "") {
      setPositionLineCountLong(0);
      setPositionLineCountShort(0);

      let _savedWidgetContent = getSavedWidgetContentItem(props.contractId);
      let color = ["#14AF81", "#EC516D"]; // green-red
      let buyColor = props.userHabit.upDownColor === "0" ? color[0] : color[1];
      let sellColor = props.userHabit.upDownColor === "0" ? color[1] : color[0];

      if (_savedWidgetContent) {
        _savedWidgetContent = resolveSavedWidgetContent(
          _savedWidgetContent,
          symbol(),
          interval(),
          buyColor,
          sellColor
        );

        savedWidgetContent.current = _savedWidgetContent;
      }

      initTV();
    }
  }, [props.contractId, props.resolution, props.chartType, props.userHabit]);

  // useInterval(intervalPoll, 1000 * 5 * 60, false);

  useEffect(() => {
    if (!spinning) {
      try {
        let list = props.posListProps.filter(
          (el) => el.contractId === props.contractItem.contractId
        );
        if (list.length > 0) {
          drawPositionLine(list);
        }
      } catch (err) {}
    }
  }, [props.posListProps]);

  return (
    <Spin loading={spinning}>
      <TVChartContainerStyle id={containerId} className={"TVChartContainer"} />
    </Spin>
  );
};

export default forwardRef(TVChartContainer);
