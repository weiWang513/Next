import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Input, InputGroup } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentSpot } from "../../../../store/modules/spotSlice";

const CountInput = styled(Flex)`
  width: 288px;
  height: 40px;
  background: #1f1830;
  border-radius: 4px;
  margin-top: 10px;
  // cursor: pointer;
`;

const AddonBefore = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  line-height: 17px;
`;
const AddonAfter = styled.div`
  min-width: 48px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  line-height: 15px;
  padding-left: 12px;
  border-left: 1px solid #4a4062;
`;
const RInput = styled(Input)`
  height: 40px;
  background: #1f1830;
  border-color: #1f1830;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  line-height: 21px;
`;

const volumeInput = ({ volume, changeVolume, changeQty }) => {
  const contractItem = useSelector(selectCurrentSpot);
  const { t } = useTranslation();
  const renderPerfix = () => {
    return <AddonBefore>{t("Turnover")}:</AddonBefore>;
  };
  const renderAddonAfter = () => {
    return <AddonAfter>{contractItem?.currencyName}</AddonAfter>;
  };

  const handleChange = (v) => {
    let { value } = v.target;
    if (value === "") {
      changeQty("");
      changeVolume("");
      return;
    }

    // const reg = /^\d*(\.?\d{0,6}|\D)/g;
    // value = value.match(reg)[0];
    // changeVolume(value);
    const reg = /^(([1-9]\d*)(\.?\d*)?|0\.\d*|0)$/;
    if (reg.test(value)) {
      changeVolume(value);
    } else {
      changeVolume(volume);
    }
  };

  return (
    <CountInput>
      <InputGroup startIcon={renderPerfix()} endIcon={renderAddonAfter()} ta={"right"}>
        <RInput value={volume} onChange={handleChange} />
      </InputGroup>
    </CountInput>
  );
};

export default volumeInput;
