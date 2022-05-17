let a = {
  layout: "s",
  charts: [
    {
      panes: [
        {
          sources: [
            {
              type: "MainSeries",
              id: "eBYrXi",
              state: {
                style: 1,
                esdShowDividends: true,
                esdShowSplits: true,
                esdShowEarnings: true,
                esdShowBreaks: false,
                esdBreaksStyle: {
                  color: "rgba( 235, 77, 92, 1)",
                  style: 2,
                  width: 1
                },
                esdFlagSize: 2,
                showCountdown: false,
                showInDataWindow: true,
                visible: true,
                silentIntervalChange: false,
                showPriceLine: true,
                priceLineWidth: 1,
                priceLineColor: "",
                showPrevClosePriceLine: false,
                prevClosePriceLineWidth: 1,
                prevClosePriceLineColor: "rgba( 85, 85, 85, 1)",
                minTick: "default",
                extendedHours: false,
                sessVis: false,
                statusViewStyle: {
                  fontSize: 17,
                  showExchange: true,
                  showInterval: true,
                  showSymbolAsDescription: false
                },
                candleStyle: {
                  upColor: "#14AF81",
                  downColor: "#EC516D",
                  drawWick: true,
                  drawBorder: false,
                  borderColor: "#378658",
                  borderUpColor: "#14AF81",
                  borderDownColor: "#EC516D",
                  wickColor: "#B5B5B8",
                  wickUpColor: "#14AF81",
                  wickDownColor: "#EC516D",
                  barColorsOnPrevClose: false
                },
                hollowCandleStyle: {
                  upColor: "#53b987",
                  downColor: "#eb4d5c",
                  drawWick: true,
                  drawBorder: true,
                  borderColor: "#378658",
                  borderUpColor: "#53b987",
                  borderDownColor: "#eb4d5c",
                  wickColor: "#B5B5B8",
                  wickUpColor: "#336854",
                  wickDownColor: "#7f323f"
                },
                haStyle: {
                  upColor: "#53b987",
                  downColor: "#eb4d5c",
                  drawWick: true,
                  drawBorder: true,
                  borderColor: "#378658",
                  borderUpColor: "#53b987",
                  borderDownColor: "#eb4d5c",
                  wickColor: "#B5B5B8",
                  wickUpColor: "#53b987",
                  wickDownColor: "#eb4d5c",
                  showRealLastPrice: false,
                  barColorsOnPrevClose: false,
                  inputs: {},
                  inputInfo: {}
                },
                barStyle: {
                  upColor: "#53b987",
                  downColor: "#eb4d5c",
                  barColorsOnPrevClose: false,
                  dontDrawOpen: false
                },
                lineStyle: {
                  color: "#6FB8F7",
                  linestyle: 0,
                  linewidth: 1,
                  priceSource: "close",
                  styleType: 2
                },
                areaStyle: {
                  color1: "#606090",
                  color2: "#01F6F5",
                  linecolor: "#0094FF",
                  linestyle: 0,
                  linewidth: 1,
                  priceSource: "close",
                  transparency: 50
                },
                priceAxisProperties: {
                  autoScale: true,
                  autoScaleDisabled: false,
                  lockScale: false,
                  percentage: false,
                  percentageDisabled: false,
                  log: false,
                  logDisabled: false,
                  alignLabels: true
                },
                renkoStyle: {
                  upColor: "#53b987",
                  downColor: "#eb4d5c",
                  borderUpColor: "#53b987",
                  borderDownColor: "#eb4d5c",
                  upColorProjection: "#336854",
                  downColorProjection: "#7f323f",
                  borderUpColorProjection: "#336854",
                  borderDownColorProjection: "#7f323f",
                  wickUpColor: "#336854",
                  wickDownColor: "#7f323f",
                  inputs: {
                    source: "close",
                    boxSize: 3,
                    style: "ATR",
                    atrLength: 14,
                    wicks: true
                  },
                  inputInfo: {
                    source: {
                      name: "Source"
                    },
                    boxSize: {
                      name: "Box size"
                    },
                    style: {
                      name: "Style"
                    },
                    atrLength: {
                      name: "ATR Length"
                    },
                    wicks: {
                      name: "Wicks"
                    }
                  }
                },
                pbStyle: {
                  upColor: "#53b987",
                  downColor: "#eb4d5c",
                  borderUpColor: "#53b987",
                  borderDownColor: "#eb4d5c",
                  upColorProjection: "#336854",
                  downColorProjection: "#7f323f",
                  borderUpColorProjection: "#336854",
                  borderDownColorProjection: "#7f323f",
                  inputs: {
                    source: "close",
                    lb: 3
                  },
                  inputInfo: {
                    source: {
                      name: "Source"
                    },
                    lb: {
                      name: "Number of line"
                    }
                  }
                },
                kagiStyle: {
                  upColor: "#53b987",
                  downColor: "#eb4d5c",
                  upColorProjection: "#336854",
                  downColorProjection: "#7f323f",
                  inputs: {
                    source: "close",
                    style: "ATR",
                    atrLength: 14,
                    reversalAmount: 1
                  },
                  inputInfo: {
                    source: {
                      name: "Source"
                    },
                    style: {
                      name: "Style"
                    },
                    atrLength: {
                      name: "ATR Length"
                    },
                    reversalAmount: {
                      name: "Reversal amount"
                    }
                  }
                },
                pnfStyle: {
                  upColor: "#53b987",
                  downColor: "#eb4d5c",
                  upColorProjection: "#336854",
                  downColorProjection: "#7f323f",
                  inputs: {
                    sources: "Close",
                    reversalAmount: 3,
                    boxSize: 1,
                    style: "ATR",
                    atrLength: 14
                  },
                  inputInfo: {
                    sources: {
                      name: "Source"
                    },
                    boxSize: {
                      name: "Box size"
                    },
                    reversalAmount: {
                      name: "Reversal amount"
                    },
                    style: {
                      name: "Style"
                    },
                    atrLength: {
                      name: "ATR Length"
                    }
                  }
                },
                baselineStyle: {
                  baselineColor: "rgba( 117, 134, 150, 1)",
                  topFillColor1: "rgba( 83, 185, 135, 0.1)",
                  topFillColor2: "rgba( 83, 185, 135, 0.1)",
                  bottomFillColor1: "rgba( 235, 77, 92, 0.1)",
                  bottomFillColor2: "rgba( 235, 77, 92, 0.1)",
                  topLineColor: "rgba( 83, 185, 135, 1)",
                  bottomLineColor: "rgba( 235, 77, 92, 1)",
                  topLineWidth: 1,
                  bottomLineWidth: 1,
                  priceSource: "close",
                  transparency: 50,
                  baseLevelPercentage: 50
                },
                symbol: "BTC/USDT",
                shortName: "BTC/USDT",
                timeframe: "",
                onWidget: false,
                interval: "15",
                showSessions: false
              },
              zorder: 1,
              haStyle: {
                studyId: "BarSetHeikenAshi@tv-basicstudies-60"
              },
              renkoStyle: {
                studyId: "BarSetRenko@tv-prostudies-15"
              },
              pbStyle: {
                studyId: "BarSetPriceBreak@tv-prostudies-15"
              },
              kagiStyle: {
                studyId: "BarSetKagi@tv-prostudies-15"
              },
              pnfStyle: {
                studyId: "BarSetPnF@tv-prostudies-15"
              }
            },
            {
              type: "LineToolTrendLine",
              id: "r3ewWj",
              state: {
                clonable: true,
                linecolor: "rgba(0, 255, 0, 1)",
                linewidth: 1,
                linestyle: 0,
                extendLeft: false,
                extendRight: false,
                leftEnd: 0,
                rightEnd: 0,
                font: "Verdana",
                textcolor: "rgba( 21, 119, 96, 1)",
                fontsize: 12,
                bold: false,
                italic: false,
                snapTo45Degrees: true,
                alwaysShowStats: false,
                showMiddlePoint: false,
                showPriceRange: false,
                showBarsRange: false,
                showDateTimeRange: false,
                showDistance: false,
                showAngle: false,
                frozen: false,
                intervalsVisibilities: {
                  seconds: true,
                  secondsFrom: 1,
                  secondsTo: 59,
                  minutes: true,
                  minutesFrom: 1,
                  minutesTo: 59,
                  hours: true,
                  hoursFrom: 1,
                  hoursTo: 24,
                  days: true,
                  daysFrom: 1,
                  daysTo: 366,
                  weeks: true,
                  months: true
                },
                visible: true,
                symbol: "BTC/USDT",
                interval: "1D",
                lastUpdateTime: 0,
                _isActualInterval: true,
                fixedSize: true
              },
              points: [
                {
                  time_t: 1646409600,
                  offset: 0,
                  price: 42267.234509057096
                }
              ],
              zorder: -1,
              linkKey: "1t5pbvCoD9Fj",
              ownerSource: "eBYrXi"
            },
            {
              type: "LineToolTrendLine",
              id: "Bcybaj",
              state: {
                clonable: true,
                linecolor: "rgba(0, 255, 0, 1)",
                linewidth: 1,
                linestyle: 0,
                extendLeft: false,
                extendRight: false,
                leftEnd: 0,
                rightEnd: 0,
                font: "Verdana",
                textcolor: "rgba( 21, 119, 96, 1)",
                fontsize: 12,
                bold: false,
                italic: false,
                snapTo45Degrees: true,
                alwaysShowStats: false,
                showMiddlePoint: false,
                showPriceRange: false,
                showBarsRange: false,
                showDateTimeRange: false,
                showDistance: false,
                showAngle: false,
                frozen: true,
                intervalsVisibilities: {
                  seconds: true,
                  secondsFrom: 1,
                  secondsTo: 59,
                  minutes: true,
                  minutesFrom: 1,
                  minutesTo: 59,
                  hours: true,
                  hoursFrom: 1,
                  hoursTo: 24,
                  days: true,
                  daysFrom: 1,
                  daysTo: 366,
                  weeks: true,
                  months: true
                },
                visible: true,
                symbol: "BTC/USDT",
                interval: "240",
                lastUpdateTime: 0,
                _isActualInterval: true,
                fixedSize: true
              },
              points: [
                {
                  time_t: 1646049600,
                  offset: 0,
                  price: 40965.37549878569
                },
                {
                  time_t: 1646553600,
                  offset: 0,
                  price: 42479.25691330311
                }
              ],
              zorder: 0,
              linkKey: "vyLm8JBM2IXT",
              ownerSource: "eBYrXi"
            }
          ],
          leftAxisState: {
            m_priceRange: null,
            m_isAutoScale: true,
            m_isPercentage: false,
            m_isLog: false,
            m_isLockScale: false,
            m_height: 419,
            m_topMargin: 0.09,
            m_bottomMargin: 0.01
          },
          leftAxisSources: [],
          rightAxisState: {
            m_priceRange: {
              m_maxValue: 39675,
              m_minValue: 37548.09
            },
            m_isAutoScale: true,
            m_isPercentage: false,
            m_isLog: false,
            m_isLockScale: false,
            m_height: 419,
            m_topMargin: 0.09,
            m_bottomMargin: 0.01
          },
          rightAxisSources: ["eBYrXi", "r3ewWj", "Bcybaj"],
          overlayPriceScales: {},
          stretchFactor: 2000,
          mainSourceId: "eBYrXi"
        },
        {
          sources: [
            {
              type: "study_Volume",
              id: "SeT8og",
              state: {
                styles: {
                  vol: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 5,
                    trackPrice: false,
                    transparency: 65,
                    visible: true,
                    color: "#EC516D",
                    histogramBase: 0,
                    joinPoints: false,
                    title: "Volume"
                  },
                  vol_ma: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 4,
                    trackPrice: false,
                    transparency: 65,
                    visible: true,
                    color: "#0496FF",
                    histogramBase: 0,
                    joinPoints: false,
                    title: "Volume MA"
                  }
                },
                precision: "default",
                palettes: {
                  volumePalette: {
                    colors: {
                      0: {
                        color: "#EC516D",
                        width: 1,
                        style: 0,
                        name: "Color 0"
                      },
                      1: {
                        color: "#14AF81",
                        width: 1,
                        style: 0,
                        name: "Color 1"
                      }
                    }
                  }
                },
                inputs: {
                  showMA: false,
                  maLength: 20
                },
                bands: {},
                area: {},
                graphics: {},
                showInDataWindow: true,
                visible: true,
                showStudyArguments: true,
                paneSize: "large",
                plots: {
                  0: {
                    id: "vol",
                    type: "line"
                  },
                  1: {
                    id: "volumePalette",
                    palette: "volumePalette",
                    target: "vol",
                    type: "colorer"
                  },
                  2: {
                    id: "vol_ma",
                    type: "line"
                  }
                },
                _metainfoVersion: 15,
                isTVScript: false,
                isTVScriptStub: false,
                is_hidden_study: false,
                transparency: 65,
                description: "Volume",
                shortDescription: "Volume",
                is_price_study: false,
                id: "Volume@tv-basicstudies",
                description_localized: "成交量(Volume)",
                shortId: "Volume",
                packageId: "tv-basicstudies",
                version: "1",
                fullId: "Volume@tv-basicstudies-1",
                productId: "tv-basicstudies",
                name: "Volume@tv-basicstudies"
              },
              zorder: -1,
              metaInfo: {
                palettes: {
                  volumePalette: {
                    colors: {
                      0: {
                        name: "Color 0"
                      },
                      1: {
                        name: "Color 1"
                      }
                    }
                  }
                },
                inputs: [
                  {
                    id: "showMA",
                    name: "show MA",
                    defval: false,
                    type: "bool"
                  },
                  {
                    id: "maLength",
                    name: "MA Length",
                    defval: 20,
                    type: "integer",
                    min: 1,
                    max: 2000
                  }
                ],
                plots: [
                  {
                    id: "vol",
                    type: "line"
                  },
                  {
                    id: "volumePalette",
                    palette: "volumePalette",
                    target: "vol",
                    type: "colorer"
                  },
                  {
                    id: "vol_ma",
                    type: "line"
                  }
                ],
                graphics: {},
                defaults: {
                  styles: {
                    vol: {
                      linestyle: 0,
                      linewidth: 1,
                      plottype: 5,
                      trackPrice: false,
                      transparency: 65,
                      visible: true,
                      color: "#000080"
                    },
                    vol_ma: {
                      linestyle: 0,
                      linewidth: 1,
                      plottype: 4,
                      trackPrice: false,
                      transparency: 65,
                      visible: true,
                      color: "#0496FF"
                    }
                  },
                  precision: 0,
                  palettes: {
                    volumePalette: {
                      colors: {
                        0: {
                          color: "#eb4d5c",
                          width: 1,
                          style: 0
                        },
                        1: {
                          color: "#53b987",
                          width: 1,
                          style: 0
                        }
                      }
                    }
                  },
                  inputs: {
                    showMA: false,
                    maLength: 20
                  }
                },
                _metainfoVersion: 15,
                isTVScript: false,
                isTVScriptStub: false,
                is_hidden_study: false,
                transparency: 65,
                styles: {
                  vol: {
                    title: "Volume",
                    histogramBase: 0
                  },
                  vol_ma: {
                    title: "Volume MA",
                    histogramBase: 0
                  }
                },
                description: "Volume",
                shortDescription: "Volume",
                is_price_study: false,
                id: "Volume@tv-basicstudies-1",
                description_localized: "成交量(Volume)",
                shortId: "Volume",
                packageId: "tv-basicstudies",
                version: "1",
                fullId: "Volume@tv-basicstudies-1",
                productId: "tv-basicstudies",
                name: "Volume@tv-basicstudies"
              }
            }
          ],
          leftAxisState: {
            m_priceRange: null,
            m_isAutoScale: true,
            m_isPercentage: false,
            m_isLog: false,
            m_isLockScale: false,
            m_height: 210,
            m_topMargin: 0.09,
            m_bottomMargin: 0.01
          },
          leftAxisSources: [],
          rightAxisState: {
            m_priceRange: {
              m_maxValue: 132.02259,
              m_minValue: 0
            },
            m_isAutoScale: true,
            m_isPercentage: false,
            m_isLog: false,
            m_isLockScale: false,
            m_height: 210,
            m_topMargin: 0.09,
            m_bottomMargin: 0.01
          },
          rightAxisSources: ["SeT8og"],
          overlayPriceScales: {},
          stretchFactor: 1000,
          mainSourceId: "SeT8og"
        }
      ],
      timeScale: {
        m_barSpacing: 5.3999999999999995,
        m_rightOffset: 5
      },
      chartProperties: {
        paneProperties: {
          background: "#130F1D",
          gridProperties: {
            color: "#363c4e",
            style: 0
          },
          vertGridProperties: {
            color: "#08060F",
            style: 0
          },
          horzGridProperties: {
            color: "#08060F",
            style: 0
          },
          crossHairProperties: {
            color: "rgba( 152, 152, 152, 1)",
            style: 2,
            transparency: 0,
            width: 1
          },
          topMargin: "9",
          bottomMargin: "1",
          leftAxisProperties: {
            autoScale: true,
            autoScaleDisabled: false,
            lockScale: false,
            percentage: false,
            percentageDisabled: false,
            log: false,
            logDisabled: false,
            alignLabels: true
          },
          rightAxisProperties: {
            autoScale: true,
            autoScaleDisabled: false,
            lockScale: false,
            percentage: false,
            percentageDisabled: false,
            log: false,
            logDisabled: false,
            alignLabels: true
          },
          legendProperties: {
            showStudyArguments: true,
            showStudyTitles: true,
            showStudyValues: true,
            showSeriesTitle: true,
            showSeriesOHLC: true,
            showLegend: false
          }
        },
        scalesProperties: {
          showLeftScale: false,
          showRightScale: true,
          backgroundColor: "#ffffff",
          lineColor: "#787878",
          textColor: "#AAA",
          fontSize: 11,
          scaleSeriesOnly: false,
          showSeriesLastValue: true,
          showSeriesPrevCloseValue: false,
          showStudyLastValue: false,
          showSymbolLabels: false,
          showStudyPlotLabels: false
        },
        chartEventsSourceProperties: {
          visible: true,
          futureOnly: true,
          breaks: {
            color: "rgba(85, 85, 85, 1)",
            visible: false,
            style: 2,
            width: 1
          }
        }
      },
      version: 2,
      timezone: "Asia/Shanghai"
    }
  ]
};
