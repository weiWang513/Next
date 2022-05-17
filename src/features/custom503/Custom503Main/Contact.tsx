import { FC } from "react";
import styled from "styled-components";
import ContactItem, { ContactItemProps } from "./ContactItem";
import { CONTACT_TELEGRAM, CONTACT_TWITTER } from "../../../contants";

const Container = styled.div`
  display: flex;
  background: #f5f3fb;
  border-radius: 0px 0px 16px 16px;
  transition: all 0.5s;

  // 移动端
  @media only screen and (max-width: 1280px) {
    justify-content: space-around;
  }
`;

const list: ContactItemProps[] = [
  {
    icon: "/images/503/twitter@2x.png",
    name: "Twitter",
    link: CONTACT_TWITTER,
    account: "@CCFOX2020"
  },
  {
    icon: "/images/503/telegram@2x.png",
    name: "Telegram",
    link: CONTACT_TELEGRAM,
    account: "ccfox_English"
  }
];

const Contact: FC = () => {
  return (
    <Container>
      {list.map((item: ContactItemProps) => (
        <ContactItem {...item} key={item.name} />
      ))}
    </Container>
  );
};

export default Contact;
