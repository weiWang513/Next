import React from "react";
import styled from "styled-components";
import { Flex, Dropdown, Button } from "@ccfoxweb/uikit";
import { useAppSelector } from "../../store/hook";
import QRCodeCompenet from "./QRCode";
import { ReactComponent as Phone } from "/public/images/SVG/phone.svg";
import { useTranslation } from "next-i18next";
import Link from "next/link";
const PhoneWarp = styled(Flex)`
  width: 56px;
  height: 56px;
  justify-content: center;
  cursor: pointer;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: inline-flex;
  }
  &:hover {
    // background: #1F1830;
    svg {
      path {
        fill: #6f5aff;
      }
    }
  }
`;
const DropPadding = styled.div`
  padding-top: 4px;
`;
const QRCodeMain = styled(Flex)`
  // width: 196px;
  // height: 216px;
  flex-direction: column;
  padding: 24px;
  padding-bottom: 16px;
  background: #1f1830;
  border-radius: 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.2);
`;
const QRCode = styled.div`
  width: 148px;
  height: 148px;
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
`;
const DownloadTip = styled.div`
  // min-width: 147px;
  word-break: keep-all;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: #665f7a;
  line-height: 18px;
`;
const targetHoverStyle = `
  // background: #1F1830;
  svg {
    path {
      fill: #6F5AFF;
    }
  }
`;

const Download = styled(Dropdown)``;

const DownloadApp = () => {
  const versionObj = useAppSelector((state) => state.app.versionObj);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const { t } = useTranslation();
  const dropdownTarget = () => {
    return (
      <PhoneWarp>
        <Phone />
      </PhoneWarp>
    );
  };
  return (
    <Download position="bottom-right" target={dropdownTarget()} targetHoverStyle={targetHoverStyle}>
      <DropPadding>
        <QRCodeMain>
          <QRCode>
            <QRCodeCompenet url={`${window.location.origin}/${userHabit.locale}/download`} />
          </QRCode>
          <DownloadTip>{t("ScanDownload")}</DownloadTip>
          <Link href={'/download'}>
            <Button variant={"primary"} scale={"md"} mt={"8px"} width={"148px"}>
              {t("MoreDownlodWay")}
            </Button>
          </Link>
        </QRCodeMain>
      </DropPadding>
    </Download>
  );
};

export default DownloadApp;
