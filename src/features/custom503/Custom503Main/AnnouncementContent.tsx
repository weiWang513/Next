import { FC } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

const Container = styled.div`
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #aaa4bb;
  line-height: 20px;
`;

const AnnouncementContent: FC = () => {
  const { t } = useTranslation();
  return <Container>{t("custom503.introduce")}</Container>;
};

export default AnnouncementContent;
