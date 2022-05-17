import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { dateFormatForTick, formatSpotPriceByTick, toFix6 } from "../../../utils/filters";
import useUpDownColor from "../../../hooks/useUpDownColor";
import { queryTickTrade } from "../../../services/api/spot";
import {
  selectCurrentSpot,
  selectSpotId,
  updateFutureTick
} from "../../../store/modules/spotSlice";
import { useSelector } from "react-redux";

const Tiks = styled.div`
  width: 320px;
  height: 653px;
  flex-direction: column;
  overflow: hidden;
`;
const Labels = styled(Flex)`
  height: 32px;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #3f3755;
    line-height: 32px;
  }
  span.price {
    flex: 0 0 100px;
    text-align: left;
    padding-left: 16px;
  }
  span.qty {
    flex: 0 0 100px;
    text-align: right;
    padding-right: 10px;
  }
  span.time {
    flex: 0 0 120px;
    text-align: right;
    padding-right: 16px;
  }
`;

const TikItem = styled(Labels)`
  height: 20px !important;
  cursor: pointer;
  z-index: 2;
  background: ${({ bgColorM }) => bgColorM};
  &:hover {
    background: rgba(8, 6, 15, 1);
  }
  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    color: #fff !important;
  }
  span.price {
    color: ${({ c }) => `${c} !important`};
  }
`;

const tiks = () => {
  const futureTick = useAppSelector((state) => state.spot.futureTick);
  const currentSpot = useSelector(selectCurrentSpot);
  const spotId = useSelector(selectSpotId);
  const { colorUp, colorDown } = useUpDownColor();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!spotId) return;
    queryTickTrade({ contractId: spotId }).then((res) => {
      if (res?.data?.data?.trades?.length > 0) {
        dispatch(updateFutureTick(res.data.data.trades.reverse().slice(0, 50)));
      }
    });
  }, [spotId]);

  const getLotSizeL = () => {
    return String(currentSpot?.lotSize).split('.')?.[1]?.length || 0
  }

  return (
    <Tiks>
      <Labels>
        <span className="price">
          {t("Price")}({currentSpot?.currencyName})
        </span>
        <span className="qty">
          {t("Quantity")}({currentSpot?.commodityName})
        </span>
        <span className="time">{t("Time")}</span>
      </Labels>
      {futureTick.map((e, i) => {
        return (
          <TikItem
            key={i}
            c={e[3] === 1 ? colorUp : colorDown}
            bgColorM={i % 2 ? "rgba(19, 15, 29, 1)" : "rgba(24, 18, 38, 1)"}
          >
            <span className="price">{formatSpotPriceByTick(e[1])}</span>
            <span className="qty">{toFix6(e[2], getLotSizeL())}</span>
            <span className="time">{dateFormatForTick(e[0] / 1000)}</span>
          </TikItem>
        );
      })}
    </Tiks>
  );
};

export default tiks;
