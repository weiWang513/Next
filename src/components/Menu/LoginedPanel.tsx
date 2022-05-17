import React, { useState, useEffect, useRef } from "react";
import { Flex } from "@ccfoxweb/uikit";
import styled from "styled-components";
import { ReactComponent as Avatar } from "/public/images/SVG/response/avatar.svg";
import { ReactComponent as Close } from "/public/images/SVG/close-contract.svg";
import UserInfo from './UserInfo'
import UserCenterPanel from './UserCenterPanel'

const MenuC = styled.div`
  margin-left: 12px;
  cursor: pointer;
  display: inline-flex;
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  } 
`

const MenuD = styled.div<{op?}>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  max-width: 334px;
  width: 75%;
  background: #FFFFFF;
  box-shadow: -4px 0px 16px 0px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s, opacity 0.15s;
  transform: ${({op}) => `scaleX(${op})`};
  transform-origin: right;
  opacity: ${({op}) => op || 0};

  display: flex;
  flex-direction: column;
`

const CloseW = styled(Flex)`
  justify-content: flex-end;
  padding: 20px 14px 0 0;
  z-index: 10;
`

const Header = styled(Flex)`
  flex: 0 0 128px;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`

const Options = styled.div`
  flex: 1;
  overflow: overlay;
`

const T = styled.div`
  height: 1000px
`

const HeaderBg = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(106, 69, 255, 0.2);
  filter: blur(20px);
  border-radius: 0 0 50px 50px;
`

const menu = props => {
  const [f, setF] = useState(false)
  useEffect(() => {
    document.addEventListener("click", (e) => {
      setF(false);
    });

    return () => {
      document.removeEventListener("click", (e) => {
        setF(false);
      });
    };
  }, []);

  const setOverflow = (v) => {
    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = v ? "auto" : "hidden";
  }

  useEffect(() => {
    setOverflow(!f)
  }, [f])


  return <MenuC>
    <Avatar  onClick={(e) => {
      setF(!f)
      e.stopPropagation();
    }} />
    <MenuD op={f ? 1 : 0} onClick={(e) => {
      e.stopPropagation()
    }}>
      <Header>
        <HeaderBg />
        <CloseW>
          <Close onClick={(e) =>  {
            setF(false)
          }}/>
        </CloseW>
        <UserInfo />
      </Header>
      <Options>
        <UserCenterPanel />
      </Options>
    </MenuD>
  </MenuC>
}

export default menu