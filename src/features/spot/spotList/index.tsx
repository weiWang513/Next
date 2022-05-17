import React, { MouseEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { selectSpotList, updateFavoritesList } from "../../../store/modules/spotSlice";
import { getFavorite } from "../../../services/api/spot";

import { getInjectInfo } from "../../../functions/info";

import styled from "styled-components";

import { Flex } from "@ccfoxweb/uikit";
import Header from "./header";
import SpotItem from "./spotItem";
import NoData from "../../../components/NoData";

const Container = styled(Flex)`
  flex-direction: column;
  width: ${({ visible }) => (visible ? "274px" : 0)};
  height: ${({ visible }) => (visible ? "calc(100vh - 198px)" : 0)};
  background: #08060f;
  box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.6);
  z-index: 1003;
  position: absolute;
  left: 0;
  top: 53px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => `translate(${visible ? 0 : -274}px, 0px)`};
  transition: all 0.3s ease-in-out;
`;

const ListContent = styled.div`
  flex: 1;
  overflow: overlay;
`;

const spotList = ({ visible }: { visible: boolean }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const spotList = useAppSelector(selectSpotList);
  const favoritesList = useAppSelector((state) => state.spot.favoritesList);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLogin) {
      getFavorite().then((res) => {
        if (res?.data?.code === 0) {
          console.log(res.data);
          const _favorites = JSON.parse(getInjectInfo("spotFavorites") || "[]");
          dispatch(updateFavoritesList([...new Set([...res.data.data?.reverse(), ...(_favorites || [])])]));
          // dispatch(updateFavoritesList(res.data.data))
        }
      });
    } else {
      const _favorites = JSON.parse(getInjectInfo("spotFavorites") || "[]");
      dispatch(updateFavoritesList([...new Set([...(_favorites || [])])]));
    }
  }, []);

  useEffect(() => {
    setTabIndex(isLogin ? 0 : 1);
  }, [isLogin]);

  const listData = () => {
    switch (tabIndex) {
      case 0:
        return spotList.filter((e: SpotTradePair) =>
          favoritesList.find((i) => e.id === i && e.id !== 999999)
        );
      case 1:
      default:
        return spotList;
    }
  };

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Container onClick={stopPropagation} visible={visible}>
      <Header tabIndex={tabIndex} setTabIndex={setTabIndex}></Header>
      <ListContent>
        {listData().length === 0 ? (
          <>
            <NoData />
          </>
        ) : (
          <>
            {listData()?.map((i: SpotTradePair) => {
              return <SpotItem key={i.id} tradePair={i} />;
            })}
          </>
        )}
      </ListContent>
    </Container>
  );
};

export default spotList;
