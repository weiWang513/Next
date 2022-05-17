import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { ReactComponent as FavoriteClose } from "/public/images/SVG/favoriteClose.svg";
import { ReactComponent as FavoriteL } from "/public/images/SVG/favoriteL.svg";
import { ReactComponent as FavoriteR } from "/public/images/SVG/favoriteR.svg";
import { ReactComponent as Star } from "/public/images/SVG/star.svg";
import useUpDownColor from "../../../hooks/useUpDownColor";
import { getInjectInfo, setInjectInfo } from "../../../functions/info";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { toFix6 } from "../../../utils/filters";
import { useRouter } from "next/router";
import { selectSpotList, updateFavoritesList } from "../../../store/modules/spotSlice";
import { setShowFavor } from "../../../store/modules/appSlice";
import { getFavorite } from "../../../services/api/spot";
import { useSelector } from "react-redux";
const Big = require("big.js");

const Favorites = styled(Flex)`
  height: 40px;
  padding: 0 12px;
  background: rgba(19, 15, 29, 1);
`;

const Options = styled(Flex)`
  flex: 0 0 100px;
  height: 40px;
  justify-content: flex-end;
`;

const List = styled(Flex)`
  flex: 1;
  height: 40px;
  overflow: overlay;
`;
const ListInner = styled.div<{ left? }>`
  display: flex;
  flex-direction: row;
  height: 40px;
  margin-left: ${({ left }) => `${left}px`};
`;
const StarIcon = styled(Flex)`
  width: 32px;
  height: 32px;
  justify-content: center;
  cursor: pointer;
`;
const OptionsIcon = styled(StarIcon)`
  &:hover {
    background: rgba(8, 6, 15, 1);
    border-radius: 4px;
    overflow: hidden;
  }
`;

const FavoriteItem = styled(Flex)`
  flex: 0 0 161px;
  justify-content: space-between;
  height: 40px;
  padding: 0 16px;
  cursor: pointer;
  &:hover {
    background: rgba(31, 24, 48, 1);
  }
  span {
    font-size: 14px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: #615976;
  }
  span.price-change-radio {
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: ${({ c }) => c};
  }
`;

const favorites = () => {
  const favoritesList = useAppSelector((state) => state.spot?.favoritesList);
  const spotList = useSelector(selectSpotList);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  let { locale, locales, pathname, asPath, push, replace } = useRouter();

  const listRef = useRef(null);
  const listInnerRef = useRef(null);

  const [left, setLeft] = useState<number>(0);
  const [marginLeft, setMarginLeft] = useState<number>(0);
  const favoritesListLength = useRef(0);
  const dispatch = useAppDispatch();

  const { colorUp, colorDown } = useUpDownColor();

  useEffect(() => {
    let _favorites = [];
    if (isLogin) {
      getFavorite().then((res) => {
        if (res?.data?.code === 0) {
          if (getInjectInfo("spotFavorites")) {
            _favorites = JSON.parse(getInjectInfo("spotFavorites"));
          }
          // console.log('spotFavorites', _favorites,getInjectInfo('spotFavorites'), res.data)
          dispatch(updateFavoritesList([...new Set([...res.data.data, ...(_favorites || [])])]));
        }
      });
    } else {
      if (getInjectInfo("spotFavorites")) {
        _favorites = JSON.parse(getInjectInfo("spotFavorites"));
      }
      dispatch(updateFavoritesList([...new Set([...(_favorites || [])])]));
    }
  }, [isLogin]);

  const listData = () => {
    let _spotList = favoritesList.map(e => {
      return spotList.find(el => el.id === e)
    })
    favoritesListLength.current = _spotList?.length || 0;
    return _spotList;
  };

  const closeFavorite = (): void => {
    dispatch(setShowFavor(false));
    setInjectInfo("_showStarRow", "0");
  };
  const showLR = (): boolean => {
    const listWidth = listRef.current?.offsetWidth;
    const listInnerWidth = favoritesListLength.current * 161;
    return listInnerWidth >= listWidth;
  };
  const move = (v: number): void => {
    const listWidth = listRef.current.offsetWidth;
    const listInnerWidth = favoritesListLength.current * 161; // listInnerRef.current.offsetWidth

    let _count = new Big(Number(listInnerWidth) || 0).minus(Number(listWidth) || 0).div(161).toFixed(0, 3).toString();
    if (v > 0) {
      if (left < 0) {
        let _left: number = left + 1;
        setLeft(_left);
        setMarginLeft(_left * 161);
      }
    } else {
      if (_count < 0) {
        return;
      }
      if (Math.abs(left) < Number(_count) - 1) {
        let _left: number = left - 1;
        setLeft(_left);
        setMarginLeft(_left * 161);
      } else {
        setLeft(-_count);
        setMarginLeft(listWidth - listInnerWidth);
      }
    }
  };

  const changeContract = (v): void => {
    push(`/spot/${v?.symbol.replace("/", "_")}`);
  };

  return (
    <Favorites>
      <StarIcon>
        <Star></Star>
      </StarIcon>
      <List ref={listRef}>
        <ListInner left={marginLeft} ref={listInnerRef}>
          {listData()?.map((e, i) => {
            return (
              <FavoriteItem
                key={i}
                c={Number(e?.priceChangeRadio) > 0 ? colorUp : colorDown}
                onClick={() => changeContract(e)}
              >
                <span>{e?.symbol}</span>
                <span className="price-change-radio">
                  {toFix6(new Big(Number(e?.priceChangeRadio) || 0).times(100).toString())}%
                </span>
              </FavoriteItem>
            );
          })}
        </ListInner>
      </List>
      <Options>
        {showLR() && (
          <>
            <OptionsIcon onClick={() => move(-1)}>
              <FavoriteL />
            </OptionsIcon>
            <OptionsIcon onClick={() => move(1)}>
              <FavoriteR />
            </OptionsIcon>
          </>
        )}
        <OptionsIcon onClick={() => closeFavorite()}>
          <FavoriteClose ml="4px" />
        </OptionsIcon>
      </Options>
    </Favorites>
  );
};

export default favorites;
