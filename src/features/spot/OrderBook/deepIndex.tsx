import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { ReactComponent as Arrow } from "/public/images/SVG/arrow5.svg";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { selectCurrentSpot, selectSpotId, selectSpotList, updateBidsAsks, updateDeepthIndex } from "../../../store/modules/spotSlice";
import { useSelector } from "react-redux";
import { handleSnapshotDepth } from "../../../utils/calcFun";
const Big = require("big.js");

const DeepIndex = styled.div`
  position: relative;
  margin-left: 12px;
`;
const Target = styled(Flex)`
  // margin-right: 8px;
  height: 24px;
  span {
    min-width: 25px;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    line-height: 15px;
  }
  cursor: pointer;
`;
const DeepthList = styled(Flex)`
  height: 62px;
  flex-direction: column;
  position: absolute;
  top: 24px;
  right: 0;
  z-index: 3;
  width: 64px;
  height: 248px;
  background: #130f1d;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border: 1px solid #3f3755;
  padding: 4px 1px;
`;
const DeepthItem = styled.div<{ c? }>`
  cursor: pointer;
  width: 62px;
  flex: 0 0 24px;
  text-align: right;
  font-size: 12px;
  font-family: DINPro-Medium, DINPro;
  padding-right: 8px;
  font-weight: 500;
  color: ${({ c }) => c || "#615976"};
  line-height: 24px;
  &:hover {
    background: #08060f;
    color: #fff;
  }
`;
const Rotate = styled.div<{ deg? }>`
  transform: ${({ deg }) => `rotate(${deg || 0}deg)`};
  transition: all 0.3s ease-in-out;
`;

const deepIndex = () => {
  const deepthBase: Number[] = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
  const [deepthArr, setDeepthArr] = useState<Number[]>([1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]);
  const spotId = useSelector(selectSpotId);
  const spotList = useSelector(selectSpotList);
  const deepthIndex = useAppSelector((state) => state.spot.orderBook.deepthIndex);
  const [listShow, setListShow] = useState<boolean>(false);
  const currentSpot = useSelector(selectCurrentSpot);

  const bidsAsksOrigin = useAppSelector((state) => state.spot.orderBook.bidsAsksOrigin);

  const dispatch = useAppDispatch();
  useEffect(() => {
    let _contractItem = spotList.find((e) => e.id === spotId);
    dispatch(updateDeepthIndex(Number(_contractItem?.priceTick)));
    if (_contractItem?.priceTick) {
      const _deepA = deepthBase.map((el) =>
        Number(new Big(Number(el) || 0).times(Number(_contractItem?.priceTick) || 0.5).toString())
      );
      setDeepthArr(_deepA);
    }
  }, [spotId]);

  useEffect(() => {
    if (!bidsAsksOrigin?.bids) {
      return
    }
    const params = {
      bids: bidsAsksOrigin.bids,
      asks: bidsAsksOrigin.asks
    }
    dispatch(updateBidsAsks(handleSnapshotDepth(params, deepthIndex, currentSpot?.priceTick)));
  }, [deepthIndex])

  useEffect(() => {
    document.addEventListener("click", (e) => {
      setListShow(false);
    });
    return () => {
      document.removeEventListener("click", (e) => {
        setListShow(false);
      });
    };
  }, []);
  const setDeepthIndex = (e, v) => {
    console.log("updateDeepthIndex", v);
    if (!listShow) {
      e.stopPropagation();
    }
    dispatch(updateDeepthIndex(Number(v)));
    setListShow(false);
  };
  return (
    <DeepIndex>
      <Target
        onClick={(e) => {
          setListShow(!listShow);
          e.stopPropagation();
        }}
      >
        <span>{String(deepthIndex)}</span>
        <Rotate deg={!listShow ? 0 : 180}>
          <Arrow />
        </Rotate>
      </Target>
      {listShow && (
        <DeepthList>
          {deepthArr.map((e, i) => {
            return (
              <DeepthItem
                key={i}
                c={deepthIndex === e ? "rgba(111, 90, 255, 1)" : ""}
                onClick={(ev) => setDeepthIndex(ev, e)}
              >
                {e}
              </DeepthItem>
            );
          })}
        </DeepthList>
      )}
    </DeepIndex>
  );
};

export default deepIndex;
