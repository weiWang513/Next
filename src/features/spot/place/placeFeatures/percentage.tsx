import React from "react";
import styled from "styled-components";
import { Flex, Slider } from "@ccfoxweb/uikit";

const Percentage = styled(Flex)`
  width: 288px;
  height: 36px;
  margin-top: 12px;
`;

const percentage = ({
  percent,
  changePercent,
}) => {

  const handleSliderChange = (newValue: number) => {
    changePercent(newValue);
  };
  
  return (
    <Percentage>
      <Slider
        name="slider"
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleSliderChange}
        step={1}
      />
    </Percentage>
  );
};

export default percentage;
