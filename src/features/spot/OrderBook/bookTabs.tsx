import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import useUpDownColor from "../../../hooks/useUpDownColor";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { setEntrustControlType } from "../../../store/modules/spotSlice";

const Icons = styled(Flex)`
  width: 72px;
  height: 24px;
`;

const IconItem = styled(Flex)`
  width: 24px;
  height: 24px;
  border-radius: 2px;
  padding: 5px 6px;
  flex-direction: column;
  justify-content: space-between;
  background: ${({ bgColor }) => `${bgColor} !important`};
`;
const DLine = styled.div<{ c? }>`
  width: 12px;
  height: 2px;
  background: ${({ c }) => c};
`;

const booksTabs = () => {
  const { colorUp, colorDown } = useUpDownColor();
  const dispatch = useAppDispatch();

  const entrustControlType = useAppSelector((state) => state?.spot?.orderBook?.entrustControlType);

  const changeTabs = (v: number): void => {
    dispatch(setEntrustControlType(v));
  };
  return (
    <Icons>
      {[1, 2, 3].map((_el, index) => {
        return (
          <IconItem
            bgColor={entrustControlType === index ? "rgba(8, 6, 15, 1)" : ""}
            key={index}
            onClick={() => changeTabs(index)}
          >
            {[1, 2, 3, 4].map((_e, i) => {
              return (
                <span key={i}>
                  {i < 2 && index < 2 && <DLine c={colorDown}></DLine>}
                  {i < 2 && index === 2 && <DLine c={colorUp}></DLine>}
                  {i > 1 && index !== 1 && <DLine c={colorUp}></DLine>}
                  {i > 1 && index === 1 && <DLine c={colorDown}></DLine>}
                </span>
              );
            })}
          </IconItem>
        );
      })}
    </Icons>
  );
};

export default booksTabs;
