import React from "react";
import styled from "styled-components";
import PlaceWarp from "./placeFeatures/placeWarp";
import AssetInfo from "./assetInfo";
import { useAppSelector } from "../../../store/hook";
const PlaceD = styled.div`
  height: 100%;
  background: #130f1d;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;
const Place = () => {
  const isLogin = useAppSelector((state) => state.app.isLogin);
  return (
    <PlaceD>
      <PlaceWarp></PlaceWarp>
      {isLogin && <AssetInfo />}
    </PlaceD>
  );
};

export default Place;
