import React, { FC, MouseEvent } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { addFavorite, deleteFavorite, getFavorite } from "../../../services/api/spot";

import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { toggleSpotListVisible, updateFavoritesList } from "../../../store/modules/spotSlice";

import { ossCoin } from "../../../utils/oss";

import { ReactComponent as StarG } from "/public/images/SVG/star-g.svg";
import { ReactComponent as Star } from "/public/images/SVG/star.svg";
import { Flex, message } from "@ccfoxweb/uikit";
import { getInjectInfo, setInjectInfo } from "../../../functions/info";
import useUpDownColor from "../../../hooks/useUpDownColor";
import { getCurrencyPrecisionById, toFix6, formatSpotPriceByTick } from "../../../utils/filters";

const Big = require("big.js");

const Container = styled(Flex)`
  width: 288px;
  height: 40px;
  background: #08060f;
  padding: 0 16px;
  cursor: pointer;
  &:hover {
    background: #181226;
  }
  img.icon {
    margin-right: 8px;
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3F3755;
  }
`;
const Symbol = styled(Flex)`
  flex: 1;
  align-items: baseline;
  span.symbol-l {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
  }
  span.symbol-r {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    margin-right: 8px;
  }
`;
const LastPrice = styled.div<{ c? }>`
  margin-right: 24px;
  text-align: right;
  font-size: 12px;
  font-weight: bold;
  color: ${({ c }) => c};
  line-height: 15px;
`;

const PriceChange = styled.div<{ c? }>`
  font-size: 12px;
  font-weight: 500;
  color: #ec516d;
  line-height: 15px;
  color: ${({ c }) => c};
`;

const StarIcon = styled(Flex)`
  width: 40px;
  height: 40px;
  justify-content: center;
`;

const spotItem: FC<{ tradePair: SpotTradePair }> = ({ tradePair }) => {
  const favoritesList = useAppSelector((state) => state.spot.favoritesList);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colorUp, colorDown } = useUpDownColor();
  const { push } = useRouter();

  const changeContract = (v: SpotTradePair): void => {
    push(`/spot/${v?.symbol.replace("/", "_")}`);
    dispatch(toggleSpotListVisible(false));
  };

  const changeFavorite = (e: MouseEvent, v: number, spotId: number): void => {
    e.stopPropagation();
    if (isLogin) {
      if (v > 0) {
        let _favorites = [...new Set([...favoritesList, spotId])];
        setInjectInfo("spotFavorites", JSON.stringify(_favorites));
        addFavorite({ contractId: spotId }).then((res) => {
          if (res?.data?.code === 0) {
            message.success(t("SuccessfulCollection"));
          }
          getFavoriteL();
        });
      } else {
        let _favorites = [...favoritesList];
        let idx = favoritesList.indexOf(spotId);
        _favorites.splice(idx, 1);
        setInjectInfo("spotFavorites", JSON.stringify(_favorites));
        deleteFavorite({ contractId: spotId }).then((res) => {
          if (res?.data?.code === 0) {
            message.success(t("CollectionCancelled"));
          }
          getFavoriteL();
        });
      }
    } else {
      if (v > 0) {
        let _favorites = [...new Set([...favoritesList, spotId])];
        setInjectInfo("spotFavorites", JSON.stringify(_favorites));
        dispatch(updateFavoritesList(_favorites));
        message.success(t("SuccessfulCollection"));
      } else {
        let _favorites = [...favoritesList];
        let idx = favoritesList.indexOf(spotId);
        _favorites.splice(idx, 1);
        message.success(t("CollectionCancelled"));
        setInjectInfo("spotFavorites", JSON.stringify(_favorites));
        dispatch(updateFavoritesList(_favorites));
      }
    }
    e.stopPropagation();
  };

  const getFavoriteL = () => {
    getFavorite().then((res) => {
      if (res?.data?.code === 0) {
        console.log(res.data);
        const _favorites = JSON.parse(getInjectInfo("spotFavorites" || "[]"));
        dispatch(updateFavoritesList([...new Set([...res.data.data?.reverse(), ...(_favorites || [])])]));
      }
    });
  };

  const renderStar = (v: SpotTradePair) => {
    const flag = favoritesList.find((e) => v.id === e);
    return flag ? (
      <StarIcon onClick={(e: MouseEvent) => changeFavorite(e, -1, v.id)}>
        <Star />
      </StarIcon>
    ) : (
      <StarIcon onClick={(e: MouseEvent) => changeFavorite(e, 1, v.id)}>
        <StarG />
      </StarIcon>
    );
  };

  return (
    <Container onClick={() => changeContract(tradePair)}>
      <img
        className="icon"
        src={ossCoin(tradePair.symbol.split("/" || "-")[0])}
        alt={tradePair.symbol.split("/" || "-")[0]}
      />
      <Symbol>
        <span className="symbol-l">{tradePair.symbol.split("/" || "-")[0]}</span>
        <span className="symbol-r">/{tradePair.symbol.split("/" || "-")[1]}</span>
        {renderStar(tradePair)}
      </Symbol>
      <LastPrice c={Number(tradePair?.priceChangeRadio) > 0 ? colorUp : colorDown}>
        {formatSpotPriceByTick(tradePair?.lastPrice, tradePair?.id)}
      </LastPrice>
      <PriceChange c={Number(tradePair?.priceChangeRadio) > 0 ? colorUp : colorDown}>
        {Number(tradePair?.priceChangeRadio) > 0 ? "+" : ""}
        {new Big(tradePair?.priceChangeRadio || 0).times(100).toFixed(2, 0).toString()}%
      </PriceChange>
    </Container>
  );
};

export default spotItem;
