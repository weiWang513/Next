import React from "react";
import styled from "styled-components";

import PlaceMode from "./placeMode";
import PrderType from "./orderType";
import PriceInput from "./priceInput";
import CountInput from "./countInput";
import Percentage from "./percentage";
import Avali from "./avali";
import Options from "./options";
import PlaceBtn from "./placeBtn";
import Balance from "./balance";
import StopPPrice from "./stopPPrice";
import StopLPrice from "./stopLPrice";
import Login from "../../../../components/Place/login";
import ConditionPriceInput from "./conditionPriceInput";
import { useAppSelector } from "../../../../store/hook";
const PlaceD = styled.div`
  padding: 16px;
`;

const PlaceWarp = (props) => {
  const isLogin = useAppSelector((state) => state.app.isLogin);

  return (
    <PlaceD>
      <PlaceMode />
      <PrderType />
      <ConditionPriceInput />
      <PriceInput />
      <CountInput />
      <Percentage />
      {isLogin ? (
        <>
          <Avali />
          <Options />
          <StopPPrice />
          <StopLPrice />
          <PlaceBtn />
          <Balance />
        </>
      ) : (
        <Login />
      )}
    </PlaceD>
  );
};

export default PlaceWarp;
