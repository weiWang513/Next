import styled, { css } from "styled-components";
import { space } from "styled-system";
import { ReactComponent as Indictor } from "/public/images/chart/indictor.svg";
import { ReactComponent as Full } from "/public/images/chart/full.svg";
import { ReactComponent as MoreArrow } from "/public/images/chart/more_arrow.svg";

export const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 1px;
  overflow: hidden;
  .chart-tool-bar {
    background-color: rgba(19, 15, 29, 1);
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #000;
    position: relative;
    .left {
      height: 100%;
      display: flex;
      align-items: center;
      .resolution-panel {
        margin-left: 10px;
        span {
          float: left;
          padding: 3px 8px;
          font-size: 12px;
          color: #615976;
          line-height: 17px;
          cursor: pointer;
          &:hover {
            color: rgba(255, 255, 255, 1);
          }
        }
        .active {
          color: #6f5aff;
          border-radius: 12px;
          background: #08060f;
          &:hover {
            color: #6f5aff;
          }
        }
      }
      .line {
        width: 1px;
        height: 15px;
        background-color: #666;
        margin: 0 10px;
      }
      .tab {
        position: relative;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        // width: 68px;
        padding: 0 10px;
        cursor: pointer;
        span {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 32px;
        }
        .trigle {
          margin-left: 5px;
          width: 0;
          height: 0;
          border: 3px solid transparent;
          border-bottom: 3px solid #666;
          border-right: 3px solid #666;
          transform: rotate(45deg);
          margin-top: -3px;
        }
        .trigle.active {
          transform: rotate(225deg);
          margin-top: 3px;
        }
      }
      .tab.active {
        background-color: #1f1830;
      }
      .tab.common-active {
        span {
          color: #fff;
        }
      }
      .text.relution-active {
        color: #fff;
      }
      .tool-panel {
        height: 100%;
        display: flex;
        align-items: center;
        img {
          float: left;
          width: 12px;
          // height: 12px;
          margin-right: 15px;
          cursor: pointer;
        }
        .hqchart-indictor-panel {
          // width: 100%;
          height: 32px;
          display: flex;
          justify-content: flex-start;
          position: relative;
          background-color: rgba(19, 15, 29, 1);

          .tab {
            position: relative;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            // width: 68px;
            padding: 0 10px;
            cursor: pointer;
            span {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.7);
              line-height: 32px;
            }
            .trigle {
              margin-left: 5px;
              width: 0;
              height: 0;
              border: 3px solid transparent;
              border-bottom: 3px solid #666;
              border-right: 3px solid #666;
              transform: rotate(45deg);
              margin-top: -3px;
            }
            .trigle.active {
              transform: rotate(225deg);
              margin-top: 3px;
            }
          }
          .tab.active {
            background-color: #1f1830;
          }
          .tab.common-active {
            span {
              color: #fff;
            }
          }
          .text.relution-active {
            color: #fff;
          }
        }
      }
    }
    // /////////////////////////下拉panel////////////////////////
    .panel {
      position: absolute;
      width: 100%;
      left: 0;
      background-color: #1f1830;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      font-size: 12px;
      z-index: 10;
      span {
        width: 71px;
        height: 32px;
        float: left;
        text-align: center;
        line-height: 32px;
        color: #fff;
        cursor: pointer;
      }
    }
    .openPanel {
      display: block;
    }
    .closePanel {
      display: none;
    }
    #more {
      top: 34px;
    }
    #indictorSub {
      top: 34px;
    }
    #indictorMas {
      top: 34px;
    }
    .openPanel-indictor {
      display: block;
    }
    .closePanel-indictor {
      display: none;
    }
    .openPanel-sub-indictor {
      display: block;
    }
    .closePanel-sub-indictor {
      display: none;
    }
    .text.tab-item-active {
      color: #fff;
      border-radius: 4px;
      // border: 1px solid #fff;
      position: relative;
      box-sizing: border-box;
      // &:before {
      //   position: absolute;
      //   content: '';
      //   width: 5px;
      //   height: 8px;
      //   border-color: #fff;
      //   border-style: solid;
      //   border-width: 0 2px 2px 0;
      //   transform: rotate(45deg);
      //   bottom: 5px;
      //   right: 5px;
      // }
    }
    // /////////////////////////下拉panel-END////////////////////////
    .right {
      display: flex;
      align-items: center;
      .chart-type-panel {
        float: right;
        border-radius: 2px;
        overflow: hidden;
        box-sizing: border-box;
        margin-right: 10px;
        span {
          color: rgba(255, 255, 255, 0.6);
          float: left;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 8px;
          &:nth-of-type(3) {
            border-right: 0;
          }
        }
        .active {
          color: #fff;
          background-color: #131313;
        }
      }
      img {
        display: block;
        width: 20px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    //   .chart-type-panel {
    //     float: right;
    //     border: 1px solid #fff;
    //     border-radius: 3px;
    //     overflow: hidden;
    //     box-sizing: border-box;
    //     margin-right: 10px;
    //     span {
    //       color: #fff;
    //       float: left;
    //       cursor: pointer;
    //       font-size: 12px;
    //       padding: 2px 8px;
    //       border-right: 1px solid #fff;
    //       &:nth-of-type(3) {
    //         border-right: 0;
    //       }
    //     }
    //     .active {
    //       color: rgba(255, 255, 255, 0.9);
    //       background-color: #fff;
    //     }
    //   }
    //   img {
    //     display: block;
    //     width: 20px;
    //     margin-right: 10px;
    //     cursor: pointer;
    //   }
    // }
  }
  .chart-panel {
    flex: 1;
    min-height: 1px;
    color: #fff;
    background-color: #130f1d;
    overflow: hidden;
    display: flex;
  }
`;
export const FullChartContainer = styled(ChartContainer)`
  position: fixed !important;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999999;
`;

export const IndictorIcon = styled(Indictor)`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

export const IndictorIconActive = styled(Indictor)`
  width: 32px;
  height: 32px;
  cursor: pointer;
  path {
    fill: #6f5aff;
  }
`;

export const IndictorIconHover = `
  path {
    fill: #6f5aff;
  }
`;

export const IndictorPanel = styled.div`
  background: #1f1830;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
  border-radius: 0px 0px 8px 8px;
  padding: 16px;
  position: absolute;
  z-index: 5;
  // 下拉效果
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
`;

export const IndictorWrap = styled.div`
  position: relative;

  ${({ showIndictorPanel }) =>
    showIndictorPanel &&
    css`
      ${IndictorPanel} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
      }
    `}
`;

export const PanelTitle = styled.div`
  color: #605875;
  font-size: 12px;
  line-height: 17px;
  text-align: left;
  ${space}
`;

export const PanelItemWrap = styled.div`
  width: calc((64px + 8px) * 4);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

export const PanelItem = styled.div`
  width: 64px;
  height: 32px;
  background: #181226;
  border-radius: 4px;
  color: #615976;
  font-weight: 500;
  font-size: 12px;
  line-height: 32px;
  text-align: center;
  box-sizing: border-box;
  margin-top: 8px;
  margin-right: 8px;
  cursor: pointer;
  ${space}
  &:hover {
    color: #fff;
  }
  &.active {
    background: #08060f;
    border-radius: 4px;
    border: 1px solid #6f5aff;
    color: #6f5aff;
  }
`;

export const FullIcon = styled(Full)`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

export const Right = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  height: 100%;
`;

export const ChartTypePanel = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  background: #08060f;
  overflow: hidden;
  border-radius: 12px;
`;

export const ChartTypeItem = styled.div`
  padding: 0 16px;
  height: 100%;
  cursor: pointer;
  color: #615976;
  font-size: 12px;
  line-height: 24px;
  &.active {
    color: #fff;
    background: #1f1830;
    border-radius: 12px;
  }
`;

export const ResolutePanel = styled.div`
  background: #1f1830;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
  border-radius: 0px 0px 8px 8px;
  padding: 16px;
  position: absolute;
  z-index: 5;
  position: relative;
`;

export const MoreTarget = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  height: 40px;
  margin-left: 8px;
  span {
    color: rgba(97, 89, 118, 1);
    font-size: 12px;
    line-height: 12px;
  }
`;

export const MoreTargetHover = `
    span {
      color: rgba(255, 255, 255, 1) !important;
    }
    svg {
      transform: rotate(0deg);
      path {
        fill: #fff;
      }
    }
`;

export const MoreArrowIcon = styled(MoreArrow)`
  width: 16px;
  height: 16px;
  transform: rotate(180deg);
  transition: 300ms all;
  path {
    fill: #615976;
  }
`;
