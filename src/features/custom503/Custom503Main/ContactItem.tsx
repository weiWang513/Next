import { FC } from "react";
import styled from "styled-components";
import Image from "next/image";

const Container = styled.a`
  display: flex;
  margin-left: 16px;
  padding: 8px 16px;
  background: #f5f3fb;
  border-radius: 0px 0px 16px 16px;
  background: #ffffff;
  border-radius: 4px;
  transition: all 0.5s;

  // 移动端
  @media only screen and (max-width: 1280px) {
    margin-left: 0;
  }
`;

const Content = styled.div`
  padding-left: 8px;
`;

const Platform = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #220a60;
  line-height: 18px;
`;

const Account = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #aaa4bb;
  line-height: 15px;
`;

export interface ContactItemProps {
  icon: string;
  name: string;
  link: string;
  account: string;
}

const ContactItem: FC<ContactItemProps> = ({ name, icon, link, account }) => {
  return (
    <Container href={link} target="_blank" rel="noopener noreferrer">
      <Image src={icon} alt={name} width={32} height={32} priority />
      <Content>
        <Platform>{name}</Platform>
        <Account>{account}</Account>
      </Content>
    </Container>
  );
};

export default ContactItem;
