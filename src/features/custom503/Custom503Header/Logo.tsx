import { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

const LogoLink = styled.a`
  display: block;
  cursor: pointer;
`;

const Logo: FC = () => {
  return (
    <Link href="/">
      <LogoLink title="CCFOX">
        <Image src="/images/home/logo_R.png" alt="CCFOX" width={110} height={32} priority />
      </LogoLink>
    </Link>
  );
};

export default Logo;
