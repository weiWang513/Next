import React, { useState } from "react";
import styled from "styled-components";
import { Flex, Button, Modal, ModalProps, message } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { uuid } from "../../../../utils/utils";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { placeOrder } from "../../../../services/api/spot";

const ConfirmContent = styled.div`
  // height: 249px;
  width: 100%;
`;

const SymbolW = styled(Flex)`
  height: 40px;
  span.symbol {
    display: flex;
    font-size: 16px;
    font-weight: bold;
    margin-right: 4px;
    color: #fff;
  }
  span.side {
    display: flex;
    background: ${({ bgcB }) => bgcB};
    border-radius: 9px;
    padding: 2px 6px;
    margin-right: 4px;
    span {
      font-size: 10px;
      font-weight: 500;
      color: ${({ c }) => c};
    }
  }
  span.lever {
    display: flex;
    background: #3f3755;
    border-radius: 9px;
    padding: 2px 6px;
    span {
      font-size: 10px;
      font-weight: 500;
      color: #ffffff;
    }
  }
`;
const InfoItem = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  span.l {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
  span.r {
    font-size: 12px;
    color: #615976;
    line-height: 15px;
    span.v {
      font-weight: bold;
      color: #ffffff;
      margin-right: 2px;
    }
  }
`;

const StopPNL = styled(Flex)`
  width: 288px;
  height: 58px;
  background: #1f1830;
  border-radius: 8px;
  margin-top: 12px;
`;

const StopPNLI = styled(Flex)`
  height: 38px;
  flex: 1;
  flex-direction: column;
  span.p {
    font-size: 14px;
    font-weight: bold;
    color: #14af81;
    line-height: 17px;
  }
  span.l {
    font-size: 14px;
    font-weight: bold;
    color: #ec516d;
    line-height: 17px;
  }
  span.label {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
`;

const StopPNLIL = styled(StopPNLI)`
  border-right: 1px solid #181226;
`;

const BtnW = styled(Flex)`
  justify-content: space-between;
  margin: 24px 0;
`;

const ConfirmContentTips = styled.div`
  width: 336px;
  padding: 20px 24px;
  background: rgba(31, 24, 48, 1);
  border-radius: 0px 0px 16px 16px;
  span {
    font-size: 12px;
    color: #615976;
  }
  span.t {
    font-size: 12px;
    color: #615976;
  }
  span.sub-t {
    font-size: 12px;
    font-weight: 600;
    color: #fff;
  }
`;
const NoPNL = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  width: 288px;
  height: 58px;
  background: #1f1830;
  border-radius: 8px;
  margin-top: 12px;
  span.t {
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 18px;
  }
  span.s-t {
    font-size: 12px;
    font-weight: 500;
    color: #3f3755;
    line-height: 17px;
  }
`;

const PlaceModal: React.FC<ModalProps> = ({
  title,
  contractItem,
  side,
  price,
  qty,
  priceTypeTab,
  resetParams,
  onDismiss,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(["common", "code"]);
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();

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
      onDismiss();
      if (res.data.code === 0) {
        message.success(t("OrderedSuccessfully"), 1.5);
        resetParams();
      } else if (res.data.code === 102160504) {
        message.error(t("102160504", { n: Number(res.data.data), ns: "code" }));
      }
    });
  };

  return (
    <Modal title={title} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      <ConfirmContent>
        <SymbolW
          bgcB={side > 0 ? orderUpColorArea : orderDownColorArea}
          c={side > 0 ? colorUp : colorDown}
        >
          <span className="symbol">{contractItem?.symbol}</span>
          <span className="side">
            <span>{side > 0 ? t("Buy") : t("Sell")}</span>
          </span>
        </SymbolW>
        <InfoItem>
          <span className="l">{t("OrderPrice")}</span>
          {priceTypeTab === 3 ? (
            <span className="r">{t("market")}</span>
          ) : (
            <span className="r">
              <span className="v">{price}</span> {contractItem?.currencyName}
            </span>
          )}
        </InfoItem>
        <InfoItem>
          <span className="l">{side > 0 ? t("BuyQuantity") : t("SellQuantity")}:</span>
          <span className="r">
            <span className="v">{qty}</span> {contractItem?.commodityName}
          </span>
        </InfoItem>
        <BtnW>
          <Button width="47%" variant={"secondary"} onClick={() => onDismiss()} isDark={true}>
            {t("Cancel")}
          </Button>
          <Button width="47%" variant={"primary"} isLoading={loading} onClick={confirm}>
            {t("ConfirmB")}
          </Button>
        </BtnW>
      </ConfirmContent>
    </Modal>
  );
};

export default PlaceModal;
