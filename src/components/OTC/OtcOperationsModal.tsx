import React from "react";
import styled from "styled-components";
import { Modal, ModalProps, Flex } from "@ccfoxweb/uikit";
import OtcCardTop from "./OtcCardTop";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import { Big } from "big.js";

const Container = styled.div`
  width: 100%;
  padding-bottom: 24px;
`;

const Wrap = styled.div`
  border-radius: 4px;
  border: 1px solid #eeeeee;
  margin-bottom: 16px;
  cursor: pointer;
  &.active {
    border: 1px solid rgba(106, 69, 255, 1);
  }
`;

const OtcCardInfo = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 8px 16px;
`;

const OtcCardInfoInner = styled(Flex)`
  width: 100%;
  height: 54px;
  background-color: rgba(245, 243, 251, 1);
  border-radius: 4px;
  position: relative;
`;

const OtcCardInfoWrap = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span:nth-of-type(1) {
    color: rgba(19, 15, 29, 1);
    font-size: 14px;
    line-height: 18px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  span:nth-of-type(2) {
    color: rgba(170, 164, 187, 1);
    font-size: 12px;
    line-height: 16px;
  }
`;

const Line = styled.div`
  width: 1px;
  height: 40px;
  background: #e6e6e6;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.div`
  color: rgba(34, 10, 96, 1);
  font-size: 20px;
  font-weight: bold;
  span {
    color: rgba(170, 164, 187, 1);
    font-size: 14px;
    margin-left: 12px;
  }
`;

const OtcOperationsModal: React.FC<ModalProps> = ({
  title,
  onDismiss,
  selectAreaCode,
  merchantsList,
  currencyIdItem,
  faitCurrencyIdItem,
  serviceProviderItem,
  setServiceProviderItem,
  ratiolist,
  during,
  buyNum,
  ...props
}) => {
  const { t } = useTranslation();

  const selectServiceProvider = (item) => {
    setServiceProviderItem(item);
    onDismiss();
  };

  const _title = () => {
    return (
      <Title>
        {t("purchaseStyle")}
        <span>
          {Number(during) ? `${during}s` : <Loading width={16} color={"rgba(170, 164, 187, 1)"} />}
        </span>
      </Title>
    );
  };
  return (
    <Modal title={_title()} onDismiss={onDismiss} {...props}>
      <Container>
        {merchantsList?.map((el) => {
          return (
            <Wrap
              className={
                serviceProviderItem?.serviceProviderTag === el.serviceProviderTag ? "active" : ""
              }
              onClick={() => selectServiceProvider(el)}
            >
              <OtcCardTop
                serviceProviderItem={el}
                currencyIdItem={currencyIdItem}
                faitCurrencyIdItem={faitCurrencyIdItem}
                ratiolist={ratiolist}
              />
              {new Big(buyNum || 0).gt(0) && (
                <OtcCardInfo>
                  <OtcCardInfoInner>
                    <OtcCardInfoWrap>
                      <span>
                        {Number(
                          ratiolist?.find((r) => r.serviceProviderTag === el.serviceProviderTag)
                            ?._payNum
                        ) || "--"}
                      </span>
                      <span>
                        {t("preSend")}({faitCurrencyIdItem.symbol})
                      </span>
                    </OtcCardInfoWrap>
                    <Line />
                    <OtcCardInfoWrap>
                      <span>
                        {Number(
                          ratiolist?.find((r) => r.serviceProviderTag === el.serviceProviderTag)
                            ?._getNum
                        ) || "--"}
                      </span>
                      <span>
                        {t("preGet")}({currencyIdItem.symbol})
                      </span>
                    </OtcCardInfoWrap>
                  </OtcCardInfoInner>
                </OtcCardInfo>
              )}
            </Wrap>
          );
        })}
      </Container>
    </Modal>
  );
};

export default OtcOperationsModal;
