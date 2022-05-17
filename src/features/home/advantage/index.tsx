import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
// import Image from "next/image";

const AdvantageWarp = styled.div`
  background: #f5f3fb;
`;
const AdvantageCenter = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 44px 24px 44px;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 1200px;
    margin: 0 auto;
    padding: 80px 0 100px;
    text-align: center;
  }
  & > h2 {
    color: #220a60;
    font-size: 24px;
    line-height: 33px;
    font-weight: 600;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 32px;
      line-height: 44px;
    }
  }
  & > p {
    color: #aaa4bb;
    margin-top: 8px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 14px;
      line-height: 20px;
    }
  }
  & > i {
    width: 36px;
    height: 6px;
    display: block;
    background: #220a60;
    margin: 0 auto;
    margin-top: 16px;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 36px;
      height: 6px;
      margin-top: 32px;
    }
  }
  & > ul {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    ${({ theme }) => theme.mediaQueries.md} {
      margin-top: 48px;
      display: flex;
      flex-direction: row;
    }
    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 24px;
      background: #ffffff;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0px 8px 16px 0px rgba(34, 10, 96, 0.05);
      ${({ theme }) => theme.mediaQueries.md} {
        flex: 1;
        padding: 24px 32px 48px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05);
        border-radius: 14px;
        flex-direction: column;
        align-items: center;
      }
      & + li {
        margin-left: 0;
        ${({ theme }) => theme.mediaQueries.md} {
          margin-left: 24px;
        }
      }
      section {
        width: 120px;
        height: 120px;
        position: relative;
        margin-right: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        ${({ theme }) => theme.mediaQueries.md} {
          width: 142px;
          height: 142px;
        }
      }

      &:nth-child(2) section {
        width: 120px;
        height: 120px;
        margin-right: 14px;
        ${({ theme }) => theme.mediaQueries.md} {
          width: 206px;
          height: 142px;
        }
      }
      & > div {
        flex: 1;
        h3 {
          font-size: 20px;
          line-height: 28px;
          font-weight: 600;
          color: #220a60;
          text-align: left;
          ${({ theme }) => theme.mediaQueries.md} {
            text-align: center;
            font-size: 24px;
            line-height: 32px;
            margin-top: 18px;
          }
        }
        p {
          margin-top: 8px;
          font-size: 14px;
          line-height: 24px;
          font-weight: 500;
          color: #aaa4bb;
          text-align: left;
          ${({ theme }) => theme.mediaQueries.md} {
            text-align: center;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }
`;
const Advantage = () => {
  const { t } = useTranslation();
  return (
    <AdvantageWarp>
      <AdvantageCenter>
        <h2>{t("AdvantageTitle")}</h2>
        <p>{t("AdvantageSubTitle")}</p>
        <i></i>
        <ul>
          <li>
            <section>
              <img src={"/images/home/safe.png"} alt="safe" />
              {/* <Image
                src={"/images/home/safe.png"}
                alt="safe"
                layout="fill"
                objectFit="fill"
                priority
              /> */}
            </section>
            <div>
              <h3>{t("Advantage1")}</h3>
              <p>{t("Advantage1Desc")}</p>
            </div>
          </li>
          <li>
            <section>
              <img src={"/images/home/specialty.png"} alt="specialty" />
              {/* <Image
                src={"/images/home/specialty.png"}
                alt="specialty"
                layout="fill"
                objectFit="fill"
                priority
              /> */}
            </section>
            <div>
              <h3>{t("Advantage2")}</h3>
              <p>{t("Advantage2Desc")}</p>
            </div>
          </li>
          <li>
            <section>
              <img src={"/images/home/friendly.png"} alt="friendly" />
              {/* <Image
                src={"/images/home/friendly.png"}
                alt="friendly"
                layout="fill"
                objectFit="fill"
                priority
              /> */}
            </section>
            <div>
              <h3>{t("Advantage3")}</h3>
              <p>{t("Advantage3Desc")}</p>
            </div>
          </li>
          <li>
            <section>
              <img src={"/images/home/flexible.png"} alt="flexible" />
              {/* <Image
                src={"/images/home/flexible.png"}
                alt="flexible"
                layout="fill"
                objectFit="fill"
                priority
              /> */}
            </section>
            <div>
              <h3>{t("Advantage4")}</h3>
              <p>{t("Advantage4Desc")}</p>
            </div>
          </li>
        </ul>
      </AdvantageCenter>
    </AdvantageWarp>
  );
};
export default Advantage;
