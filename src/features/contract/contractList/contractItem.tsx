import React from "react";
import styled from "styled-components";
import { Flex, message } from "@ccfoxweb/uikit";
import { ReactComponent as StarG } from "/public/images/SVG/star-g.svg";
import { ReactComponent as Star } from "/public/images/SVG/star.svg";
import { useTranslation } from "next-i18next";
import { formatByPriceTick } from "../../../utils/filters";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { addFavorite, deleteFavorite, getFavorite } from "../../../services/api/contract";
import { updateContractListShow, updateFavoritesList } from "../../../store/modules/contractSlice";
import { getInjectInfo, setInjectInfo } from "../../../functions/info";
import useUpDownColor from "../../../hooks/useUpDownColor";
import { useRouter } from "next/router";
const Big = require("big.js");

const ContractItem = styled(Flex)`
  width: 266px;
  height: 40px;
  background: #08060f;
  padding: 0 16px;
  cursor: pointer;
  &:hover {
    background: #181226;
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
  font-size: 12px;
  font-weight: bold;
  color: ${({ c }) => c};
  text-align: right;
  margin-right: 24px;
`;

const PriceChange = styled.div<{ c? }>`
  min-weight: 50px;
  font-size: 12px;
  font-weight: bold;
  color: ${({ c }) => c};
  text-align: right;
`;

const StarIcon = styled(Flex)`
  width: 40px;
  height: 40px;
  justify-content: center;
`;

const contractItem = (props) => {
  const favoritesList = useAppSelector((state) => state.contract.favoritesList);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colorUp, colorDown } = useUpDownColor();

  const { push } = useRouter();

  const changeContract = (v): void => {
    push(`/contract/${v?.symbol.replace(/\/|\-/, "_")}`);
    // replace(pathname, asPath, {props: {id: v?.symbol.replace('/', '_')}})
    // replace(`/contract/${v?.symbol.replace('/', '_')}`)
    dispatch(updateContractListShow(false));
  };
  const changeFavorite = (e, v, c): void => {
    e.stopPropagation();
    console.log('changeFavorite', v)
    if (isLogin) {
      if (v > 0) {
        let _favorites = [...new Set([...favoritesList, c.contractId])];
        setInjectInfo("favorites", JSON.stringify(_favorites));
        addFavorite({ contractId: c.contractId }).then((res) => {
          if (res?.data?.code === 0) {
            message.success(t("SuccessfulCollection"));
          }
          getFavoriteL();
        });
      } else {
        let _favorites = [...favoritesList];
        let idx = favoritesList.indexOf(c.contractId);
        _favorites.splice(idx, 1);
        setInjectInfo("favorites", JSON.stringify(_favorites));
        deleteFavorite({ contractId: c.contractId }).then((res) => {
          if (res?.data?.code === 0) {
            message.success(t("CollectionCancelled"));
          }
          getFavoriteL();
        });
      }
    } else {
      if (v > 0) {
        let _favorites = [...new Set([...favoritesList, c.contractId])];
        setInjectInfo("favorites", JSON.stringify(_favorites));
        dispatch(updateFavoritesList(_favorites));
        message.success(t("SuccessfulCollection"));
      } else {
        let _favorites = [...favoritesList];
        let idx = favoritesList.indexOf(c.contractId);
        _favorites.splice(idx, 1);
        message.success(t("CollectionCancelled"));
        setInjectInfo("favorites", JSON.stringify(_favorites));
        dispatch(updateFavoritesList(_favorites));
      }
    }
    e.stopPropagation();
  };
  const getFavoriteL = () => {
    getFavorite().then((res) => {
      if (res?.data?.code === 0) {
        console.log(res.data);
        const _favorites = JSON.parse(getInjectInfo("favorites" || "[]"));

        dispatch(updateFavoritesList([...new Set([...res.data.data.reverse(), ...(_favorites || [])])]));
      }
    });
  };
  const renderStar = (v) => {
    const flag = favoritesList.find((e) => v.contractId === e);
    return flag ? (
      <StarIcon onClick={(e) => changeFavorite(e, -1, v)}>
        <Star />
      </StarIcon>
    ) : (
      <StarIcon onClick={(e) => changeFavorite(e, 1, v)}>
        <StarG />
      </StarIcon>
    );
  };
  return (
    <ContractItem onClick={() => changeContract(props.indictor)}>
      <Symbol>
        <span className="symbol-l">{props.indictor?.symbol?.split(/\/|\-/)[0]}</span>
        <span className="symbol-r">
          /{props.indictor?.symbol?.replace(/\/|\-/, "_").split(/\_/)[1]}
        </span>
        {renderStar(props.indictor)}
      </Symbol>
      <LastPrice c={props.indictor.priceChangeRadio > 0 ? colorUp : colorDown}>
        {formatByPriceTick(props.indictor?.lastPrice, props.indictor?.contractId)}
      </LastPrice>
      <PriceChange c={props.indictor.priceChangeRadio > 0 ? colorUp : colorDown}>
        {props.indictor?.priceChangeRadio > 0 ? "+" : ""}
        {new Big(props.indictor?.priceChangeRadio || 0).times(100).toFixed(2, 0).toString()}%
      </PriceChange>
    </ContractItem>
  );
};

export default contractItem;
