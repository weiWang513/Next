import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Button, useModal, message } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { uuid } from "../../../../utils/utils";
import PlaceModal from "./placeModal";
import { useSelector } from "react-redux";
import { selectCurrentSpot } from "../../../../store/modules/spotSlice";
import { placeOrder } from "../../../../services/api/spot";

const PlaceBtn = styled(Flex)`
  flex-direction: ${({ fd }) => fd};
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 8px;
  border-top: 1px solid #1f1830;
`;

const Btn = styled(Button)`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  height: 40px;
  border-radius: 4px;
`;

const placeBtn = ({ side, price, qty, priceTypeTab, resetParams }) => {
  const [loading, setLoading] = useState(false);
  const contractItem = useSelector(selectCurrentSpot);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const placeConfirm = useAppSelector((state) => state.app.placeConfirm);
  const { t } = useTranslation(["common", "code"]);
  const [openModal] = useModal(
    <PlaceModal
      title={t("PlaceConfirm")}
      contractItem={contractItem}
      side={side}
      price={price}
      qty={qty}
      priceTypeTab={priceTypeTab}
      resetParams={resetParams}
    />,
    true,
    true,
    "PlaceModal"
  );

  const place = () => {
    if (priceTypeTab === 1 && !price) {
      message.info(t("PriceWarn"));
      return;
    }
    if (!qty) {
      message.info(t("InputQtyOrVolume"));
      return;
    }
    handelPlace();
  };
  const handelPlace = () => {
    if (placeConfirm) {
      openModal();
    } else {
      confirm();
    }
  };

  const confirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000);
    const params = {
      contractId: contractItem.contractId,
      side: side,
      price: priceTypeTab === 1 ? price : "",
      quantity: qty,
      orderType: priceTypeTab,
      timeInForce: 2
    };
    placeOrder({
      params: params,
      headers: { unique: uuid() }
    }).then((res) => {
      setLoading(false);
      if (res.data.code === 0) {
        message.success(t("OrderedSuccessfully"), 1.5);
        resetParams();
      } else if (res.data.code === 102160504) {
        message.error(t("102160504", { n: Number(res.data.data), ns: "code" }));
      }
    });
  };

  return (
    <PlaceBtn>
      {side > 0 ? (
        <Button
          scale={"md"}
          width="100%"
          onClick={() => place()}
          isLoading={loading}
          variant={userHabit?.upDownColor === "0" ? "success" : "danger"}
        >
          {t("Buy")} {contractItem?.commodityName}
        </Button>
      ) : (
        <Button
          scale={"md"}
          width="100%"
          onClick={() => place()}
          isLoading={loading}
          variant={userHabit?.upDownColor === "0" ? "danger" : "success"}
        >
          {t("Sell")} {contractItem?.commodityName}
        </Button>
      )}
    </PlaceBtn>
  );
};

export default placeBtn;
