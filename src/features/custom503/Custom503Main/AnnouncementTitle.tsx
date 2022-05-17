import { FC } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

const Title = styled.div`
  margin-bottom: 10px;
  font-size: 30px;
  font-weight: 600;
  color: #220a60;
  line-height: 42px;
  transition: all 0.5s;
  // 移动端
  @media only screen and (max-width: 1280px) {
    font-size: 24px;
    line-height: 33px;
    text-align: center;
  }
`;

const AnnouncementTitle: FC = () => {
  const { t } = useTranslation('common');
  return <Title>{t("custom503.title")}</Title>;
};

export default AnnouncementTitle;
