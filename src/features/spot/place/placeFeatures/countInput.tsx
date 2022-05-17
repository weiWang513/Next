import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Input, InputGroup, Select } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { useSelector } from "react-redux";
import { selectCurrentSpot } from "../../../../store/modules/spotSlice";
import { getCurrencyPrecisionById } from "../../../../utils/filters";

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
const PriceSelect = styled(Select)`
  width: 72px;
  flex: 0 0 72px;
  // background: rgba(24, 18, 38, 1);
`;

const countInput = ({ priceTypeTab, qty, changeQty, volume, changeVolume }) => {
  const [marketType, setMarketType] = useState(0); // 0 数量，1 交易额
  const contractItem = useSelector(selectCurrentSpot);
  const { t } = useTranslation();

  useEffect(() => {
    if (priceTypeTab === 1) {
      setMarketType(0);
    }
  }, [priceTypeTab]);

  useEffect(() => {
    changeQty("");
    changeVolume("");
  }, [marketType]);

  const renderPerfix = () => {
    if (priceTypeTab === 1) {
      return <AddonBefore>{t("Quantity")}:</AddonBefore>;
    } else {
      return renderSelect();
    }
  };
  const renderSelect = () => {
    return (
      <PriceSelect
        width={90}
        scale="sm"
        isDark={true}
        value={marketType}
        sp={10}
        ep={6}
        options={[
          {
            label: t("Quantity"),
            value: 0
          },
          {
            label: t("Turnover"),
            value: 1
          }
        ]}
        background="rgba(24, 18, 38, 1)"
        onChange={(v) => setMarketType(v.value)}
      />
    );
  };
  const renderAddonAfter = () => {
    return (
      <AddonAfter>
        {marketType === 0 ? contractItem?.commodityName : contractItem?.currencyName}
      </AddonAfter>
    );
  };

  const handleChange = (v) => {
    let { value } = v.target;
    if (!Number(value)) {
      changeVolume("");
    }

    if (marketType === 0) {
      const length = getCurrencyPrecisionById(contractItem?.commodityId);
      // const reg = new RegExp("^\\d*(\\.?\\d{0," + length + "}|\\D)", "g")
      const reg = /^\d*(\.?\d{0,6}|\D)/g;
      value = value.match(reg)[0];
      changeQty(value);
    } else {
      const length = getCurrencyPrecisionById(contractItem?.currencyId);
      // const reg = new RegExp("^\\d*(\\.?\\d{0," + length + "}|\\D)", "g")
      const reg = /^\d*(\.?\d{0,6}|\D)/g;
      value = value.match(reg)[0];
      changeVolume(value);
    }
  };

  return (
    <CountInput>
      <InputGroup startIcon={renderPerfix()} endIcon={renderAddonAfter()} ta={"right"}>
        <RInput value={marketType === 0 ? qty : volume} onChange={handleChange} />
      </InputGroup>
    </CountInput>
  );
};

export default countInput;
