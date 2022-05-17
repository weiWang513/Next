import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Flex, useModal, Text, Tooltip } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import FmModal from "./fmModal";
import ChangeSize from "../../hooks/useClientSize";
import FmBModal from "./fmBModal";
import { useAppSelector } from "../../store/hook";
import { useRouter } from "next/router";
const ApplyButton = styled(Flex)`
  justify-content: center;
  height: 40px;
  background: rgba(32, 163, 181, 0.1);
  border-radius: 4px;
  width: 96px;
  transition: all 0.5s;
  :hover {
    background: rgba(32, 163, 181, 0.2);
  }
  :active {
    cursor: pointer;
  }
  &.apply-disbaled {
    background: url("/images/SVG/fm/warning_icon.svg") no-repeat right top rgba(245, 243, 251, 1);
    cursor: not-allowed;
    border: 1px solid #e6e3f0;
    :hover {
      background: url("/images/SVG/fm/warning_icon.svg") no-repeat right top rgba(245, 243, 251, 1);
    }
  }
`;

const applyButton = (props) => {
  let size = ChangeSize();
  useEffect(() => {}, [size]);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { push } = useRouter();

  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);

  const openApplyModal = (el) => {
    if (!isLogin) {
      push("/login");
      return;
    }
    if (!el?.purchaseEnabled || el?.status === 0) return;

    // do something for open modal
    // ....
    // if (size.width > 1280) {
    //   openFmModal()
    // } else {
    setShowModal(true);
    // }
  };

  const [openFmModal] = useModal(
    <FmModal el={props.el} item={props.item} />,
    true,
    true,
    `fmModal${Math.random()}`
  );

  const renderText = (el) => {
    // purchaseEnabled  ：false 售罄，true 启用
    // status 0 额度已满，1 进行中

    return !el?.purchaseEnabled ? t("fm25") : el?.status === 0 ? t("fm26") : t("fm27");
  };

  const renderApplyButton = () => {
    return (
      <ApplyButton
        className={!props.el?.purchaseEnabled || props.el?.status === 0 ? "apply-disbaled" : ""}
        onClick={() => openApplyModal(props.el)}
      >
        <Text
          fontSize={"14px"}
          color={
            !props.el?.purchaseEnabled || props.el?.status === 0
              ? "rgba(216, 212, 228, 1)"
              : "#20A3B5"
          }
          bold
        >
          {renderText(props.el)}
        </Text>
        <FmBModal
          el={props.el}
          item={props.item}
          show={showModal}
          setReloadR={props.setReloadR}
          close={() => {
            setTimeout(() => {
              setShowModal(false);
            }, 100);
          }}
        />
      </ApplyButton>
    );
  };

  return (
    <>
      {!props.el?.purchaseEnabled || props.el?.status === 0 ? (
        <Tooltip
          text={!props.el?.purchaseEnabled ? t("fm24") : t("fm23")}
          placement={"left"}
          hideTargetDecoration
          tipWidth={200}
          color={"#fff"}
          bg={"rgba(34, 10, 96, 0.9)"}
        >
          {renderApplyButton()}
        </Tooltip>
      ) : (
        renderApplyButton()
      )}
    </>
  );
};

export default applyButton;
