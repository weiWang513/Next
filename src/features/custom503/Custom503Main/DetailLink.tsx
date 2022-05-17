import { FC } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../store/hook";

const Container = styled.a`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  color: #6024fd;
  line-height: 20px;
  transition: all 0.5s;

  // 移动端
  @media only screen and (max-width: 1280px) {
    justify-content: center;
  }
`;

const Text = styled.div`
  display: flex;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  color: #6024fd;
  line-height: 20px;
`;

const Icon = styled.div`
  margin-right: 3px;
  width: 20px;
  height: 20px;
  background: url("/images/503/enter@2x.png") no-repeat center center;
  background-size: contain;
`;

const localeLinkDict = {
  ["zh_CN"]: "https://1316109.s4.udesk.cn/hc/articles/27372",
  ["zh_TW"]: "https://ccfox.zendesk.com/hc/zh-hk/articles/4415145151513",
  ["en_US"]: "https://ccfox.zendesk.com/hc/en-us/articles/4415145151513",
  ["ko_KR"]: "https://ccfox.zendesk.com/hc/ko-kr/articles/4415145151513"
};

const DetailLink: FC = () => {
  const { t } = useTranslation();
  const userHabit = useAppSelector((state) => state.app.userHabit);

  return (
    <Container
      href={localeLinkDict[userHabit.locale] || localeLinkDict["en_US"]}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Text>{t("custom503.detailLink")}</Text>
      <Icon />
    </Container>
  );
};

export default DetailLink;
