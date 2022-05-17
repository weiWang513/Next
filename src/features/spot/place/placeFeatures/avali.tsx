import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex, useModal } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { ReactComponent as Transfer } from "/public/images/SVG/transfer_avail.svg";
import TransferModal from "../assetInfo/transferModal";
import { useSelector } from "react-redux";
import { selectCurrentSpot } from "../../../../store/modules/spotSlice";

const Avali = styled(Flex)`
  justify-content: space-between;
  margin: 8px 0;
`;

const Avalible = styled(Flex)`
  justify-content: ${({ justify }) => justify || "flex-start"};
  span.label,
  span.symbol {
    font-size: 12px;
    font-weight: bold;
    color: #615976;
    line-height: 15px;
  }
  span.value {
    font-size: 12px;
    font-weight: bold;
    color: #ffffff;
    line-height: 15px;
    margin: 0 4px;
  }
`;
const TransferIcon = styled(Transfer)`
  cursor: pointer;
`;

const AF = styled(Flex)`
  flex: 1;
  width: 100%;
  flex-direction: ${({ fd }) => fd};
  justify-content: space-between;
`;

const avali = ({
  side,
  changePrice,
  changeQty,
  changeVolume,
  commodityQty,
  currencyQty
}) => {
  const contractItem = useSelector(selectCurrentSpot);
  const currencyList = useAppSelector((state) => state.spot.currencyList);
  const isLogin = useAppSelector((state) => state.app.isLogin);

  const { t } = useTranslation();
  const [openTransferModal] = useModal(
    <TransferModal
      contractItem={contractItem}
      currencyList={currencyList}
      isLogin={isLogin}
    />
  );

  const transfer = (): void => {
    openTransferModal();
    changePrice("");
    changeQty("");
    changeVolume("");
  };

  // 余额如果接口返回空，则显示为零
  const balance = Number(side > 0 ? currencyQty : commodityQty) || 0;

  return (
    <>
      <Avali>
        <Avalible>
          <span className="label">{t("Avali")}</span>
          <span className="value">
            {balance}
          </span>
          <span className="label">{side > 0 ? contractItem?.currencyName : contractItem?.commodityName}</span>
        </Avalible>
        <TransferIcon onClick={transfer} />
      </Avali>
    </>
  );
};

export default avali;
