import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dropdown } from "@ccfoxweb/uikit";

import TVChartContainer from "./TVChartContainer/index";
import KLineChart from "./KLineChart/BasicKLineChart";
import DepthChart from "./Echart";
import { useTranslation } from "react-i18next";
import { btnList, indictorMasterList, indictorSubList, btnListFixed } from "./list";
import { changeResolution, changeChartFull } from "../../../store/modules/spotSlice";
import { useAppSelector, useAppDispatch } from "../../../store/hook";
import {
  ChartContainer,
  FullChartContainer,
  IndictorIcon,
  IndictorIconActive,
  IndictorPanel,
  IndictorWrap,
  IndictorIconHover,
  PanelTitle,
  PanelItemWrap,
  PanelItem,
  FullIcon,
  Right,
  ChartTypePanel,
  ChartTypeItem,
  MoreTarget,
  MoreTargetHover,
  ResolutePanel,
  MoreArrowIcon
} from "./style";
import { useSelector } from "react-redux";
import { selectCurrentSpot, selectSpotId } from "../../../store/modules/spotSlice";

function Chart() {
  const [fullScreen, setFullScreen] = useState(false);
  const [showIndictorPanel, setShowIndictorPanel] = useState(false);

  const [Type, setType] = useState(Number(localStorage.getItem("KLINE_TYPE")) || 0); //图表类型
  const [chartType, setChartType] = useState(Number(localStorage.getItem("KLINE_CHARTTYPE")) || 0); //kline类型
  const [indictorMaster, setIndictorMaster] = useState(
    localStorage.getItem("KLINE_MAIN_INDICTOR") || ""
  ); //当前选中副指标
  const [indictorSub, setIndictorSub] = useState(localStorage.getItem("KLINE_SUB_INDICTOR") || ""); //当前选中副指标

  const tvRef = useRef(null);
  const dropRef = useRef(null);

  const dispatch = useAppDispatch();
  const spotId = useSelector(selectSpotId);
  const currentSpot = useSelector(selectCurrentSpot);
  const futureKline = useAppSelector((state) => state?.spot?.futureKline);
  const futureLastestTickPrice = useAppSelector(
    (state) => state.spot.futureLastestTickPrice
  );
  const resolution = useAppSelector((state) => state.spot.resolution);
  const userHabit = useAppSelector((state) => state.app.userHabit);

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(changeResolution(localStorage.getItem("KLINE_RESOLUTION") || "15"));

    document.addEventListener("click", (e) => {
      setShowIndictorPanel(false);
    });

    return () => {
      document.removeEventListener("click", (e) => {
        setShowIndictorPanel(false);
      });
    };
  }, []);

  const _change = (l) => {
    l.resolution !== resolution && dispatch(changeResolution(l.resolution));
    localStorage.setItem("KLINE_RESOLUTION", l.resolution);
    localStorage.setItem("KLINE_CHARTTYPE", l.chartType);
    setChartType(l.chartType);
  };

  const _indictor = (l, type) => {
    if (Type === 0) {
      if (l.type === 0) {
        l.label === indictorMaster ? setIndictorMaster("Close") : setIndictorMaster(l.label);
        localStorage.setItem("KLINE_MAIN_INDICTOR", l.label === indictorMaster ? "Close" : l.label);
      } else {
        l.label === indictorSub ? setIndictorSub("Close") : setIndictorSub(l.label);
        localStorage.setItem("KLINE_SUB_INDICTOR", l.label === indictorSub ? "Close" : l.label);
      }
    } else if (Type === 1) {
      tvRef.current._indictor();
    }
  };

  const _camera = () => {
    if (Type === 0) {
      // this.$refs.Hqchart.camera()
    } else if (Type === 1) {
      // this.$refs.TvContainer.camera()
      tvRef.current._camera();
    }
  };

  const _setting = () => {
    if (Type === 0) {
      // this.$refs.Hqchart.setting()
    } else if (Type === 1) {
      tvRef.current._setting();
    }
  };

  const _full = () => {
    setFullScreen(!fullScreen);
    dispatch(changeChartFull(!fullScreen));
  };

  const changeChart = (v) => {
    setType(v);
    // setLoading(true)
    localStorage.setItem("KLINE_TYPE", v);
  };

  const openIndictor = (event, show) => {
    setShowIndictorPanel(show ? show : !showIndictorPanel);
    event.nativeEvent.stopImmediatePropagation();
  };

  const renderMoreResolution = useCallback(() => {
    let _resolution = btnListFixed.find(
      (el) => el.resolution === resolution && el.chartType === chartType
    );
    let _allResolution = btnList.find(
      (el) => el.resolution === resolution && el.chartType === chartType
    );
    return _resolution ? (
      t("More")
    ) : (
      <span style={{ color: "#6F5AFF" }}>{_allResolution?.label}</span>
    );
  }, [resolution, chartType]);

  const renderMoreTarget = () => {
    return (
      <MoreTarget>
        <span>{renderMoreResolution()}</span>
        <MoreArrowIcon />
      </MoreTarget>
    );
  };

  const renderToolBar = () => {
    return (
      <div className="chart-tool-bar layout-header">
        <div className="left">
          {/* resolution */}
          {Type !== 2 && (
            <div className="resolution-panel">
              {btnListFixed.map((l, index) => {
                return (
                  <span
                    key={index}
                    className={
                      l.chartType === chartType && l.resolution === resolution ? "active " : ""
                    }
                    onClick={() => _change(l)}
                  >
                    {l.label === "Line" ? t("Line") : l.label}
                  </span>
                );
              })}
            </div>
          )}

          <div className="tool-panel">
            {Type !== 2 && (
              <Dropdown
                position="bottom-left"
                target={renderMoreTarget()}
                targetHoverStyle={MoreTargetHover}
                ref={dropRef}
              >
                <ResolutePanel>
                  <PanelItemWrap>
                    {btnList.map((l, index) => {
                      return (
                        <PanelItem
                          key={index}
                          className={
                            l.chartType === chartType && l.resolution === resolution ? "active" : ""
                          }
                          onClick={() => {
                            _change(l);
                            dropRef.current.close();
                          }}
                        >
                          {l.label === "Line" ? t("Line") : l.label}
                        </PanelItem>
                      );
                    })}
                  </PanelItemWrap>
                </ResolutePanel>
              </Dropdown>
            )}

            <div className="line"></div>

            {Type === 0 && (
              <IndictorWrap showIndictorPanel={showIndictorPanel}>
                {showIndictorPanel ? (
                  <IndictorIconActive onClick={(e) => openIndictor(e)} />
                ) : (
                  <IndictorIcon onClick={(e) => openIndictor(e)} />
                )}

                <IndictorPanel onClick={(e) => openIndictor(e, true)}>
                  <PanelTitle>{t("MainIndictor")}:</PanelTitle>
                  <PanelItemWrap>
                    {indictorMasterList.map((l, index) => {
                      return (
                        <PanelItem
                          key={index}
                          className={indictorMaster === l.label ? "active" : ""}
                          onClick={() => _indictor(l, 0)}
                        >
                          {l.label}
                        </PanelItem>
                      );
                    })}
                  </PanelItemWrap>

                  <PanelTitle mt={"16px"}>{t("SubIndictor")}:</PanelTitle>
                  <PanelItemWrap>
                    {indictorSubList.map((l, index) => {
                      return (
                        <PanelItem
                          key={index}
                          className={indictorSub === l.label ? "active" : ""}
                          onClick={() => _indictor(l, 2)}
                        >
                          {l.label}
                        </PanelItem>
                      );
                    })}
                  </PanelItemWrap>
                </IndictorPanel>
              </IndictorWrap>
            )}

            {Type === 1 && <img src={"/images/chart/indictor.png"} onClick={() => _indictor()} />}
            {Type === 1 && <img src={"/images/chart/camera.png"} onClick={() => _camera()} />}
            {Type === 1 && <img src={"/images/chart/setting.png"} onClick={() => _setting()} />}
          </div>
        </div>

        <Right>
          <ChartTypePanel>
            <ChartTypeItem className={Type === 0 ? "active" : ""} onClick={() => changeChart(0)}>
              Original
            </ChartTypeItem>
            <ChartTypeItem className={Type === 1 ? "active" : ""} onClick={() => changeChart(1)}>
              TradingView
            </ChartTypeItem>
            <ChartTypeItem className={Type === 2 ? "active" : ""} onClick={() => changeChart(2)}>
              Depth
            </ChartTypeItem>
          </ChartTypePanel>

          <FullIcon onClick={() => _full()} />
        </Right>
      </div>
    );
  };

  const renderChart = () => {
    return (
      <div className="chart-panel">
        {Type === 0 && (
          <KLineChart
            contractId={spotId}
            range={btnList.find((el) => el.resolution === resolution)?.Range}
            futureKline={futureKline}
            currentSpot={currentSpot}
            futureTick={futureLastestTickPrice}
            userHabit={userHabit}
            indictorSub={indictorSub}
            indictorMaster={indictorMaster}
            Type={chartType}
          />
        )}
        {Type === 1 && (
          <TVChartContainer
            chartType={chartType}
            ref={tvRef}
            contractId={spotId}
            contractItem={currentSpot}
            resolution={resolution}
            userHabit={userHabit}
            // posListProps={posListProps}
          />
        )}

        {Type === 2 && <DepthChart />}
      </div>
    );
  };

  return !fullScreen ? (
    <ChartContainer
      className={fullScreen ? "chart-container full-chart-container" : "chart-container"}
    >
      {renderToolBar()}
      {renderChart()}
    </ChartContainer>
  ) : (
    <FullChartContainer
      className={fullScreen ? "chart-container full-chart-container" : "chart-container"}
    >
      {renderToolBar()}
      {renderChart()}
    </FullChartContainer>
  );
}

export default Chart;
