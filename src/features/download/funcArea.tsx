import React, { useEffect } from "react";
import styled from "styled-components";
import {Flex} from "@ccfoxweb/uikit";
import Image from "next/image";
import { ReactComponent as Iphone } from "/public/images/SVG/iphone.svg";
import { ReactComponent as Android } from "/public/images/SVG/Android.svg";
import { ReactComponent as Google } from "/public/images/SVG/Google_icon.svg";
import { useAppSelector } from "../../store/hook";
import QRCode from "../../components/DownloadApp/QRCode";
const FuncArea = styled.div`
  display: none;    
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;    
  }
`
const LeftSide = styled.aside`
  display: flex;
  flex-direction: column;
  & > h2 {
    font-size: 32px;
    font-weight: 600;
    color: #ffffff;
    line-height: 44px;
  }
  & > p {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
  }
  & > i {
    width: 36px;
    height: 6px;
    background: #ffffff;
    margin-top: 32px;
  }
  & > section {
    display: flex;
    margin-top: 48px;
    & > aside {
      width: 112px;
      height: 112px;
      background: #ffffff;
      border-radius: 4px;
      overflow: hidden;
    }
    & > div {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .download-block {
        display: flex;
        padding: 10px 16px;
        width: 156px;
        background: #ffffff;
        border-radius: 4px;
        aside {
          width: 24px;
          height: 24px;
        }
        div {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          p {
            font-size: 10px;
            font-weight: 400;
            color: #130f1d;
            line-height: 10px;
          }
          span {
            font-size: 16px;
            font-weight: bold;
            color: #130f1d;
            line-height: 20px;
          }
        }
      }
      .google-play{
        margin-left: 12px;
      }
    }
  }
`;

const F = styled(Flex)``  

const funcArea = props => {
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const versionObj = useAppSelector((state) => state.app.versionObj);

  return <FuncArea>
     <LeftSide>
        <section>
          <aside>
            {/* @ts-ignore */}
            <QRCode url={`${window.location.origin}/${userHabit.locale}/download`} />
            {/* <QRCode url={`${versionObj?.mobileUrl}/download?locale=${userHabit.locale}`} /> */}
          </aside>
          <div>
            <section className="download-block">
              <aside>
                <Iphone />
              </aside>
              <div>
                <p>Download for</p>
                <span>iPhone</span>
              </div>
            </section>
            <F>
              <section className="download-block">
                <aside>
                  <Android />
                </aside>
                <div>
                  <p>Download for</p>
                  <span>Android</span>
                </div>
              </section>
              <section className="download-block google-play">
                <aside>
                  <Google />
                </aside>
                <div>
                  <p>Download for</p>
                  <span>Google Play</span>
                </div>
              </section>
            </F>
          </div>
        </section>
      </LeftSide>
  </FuncArea>
}

export default funcArea