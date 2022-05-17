import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
// import Image from "next/image";

const InvestmentWarp = styled.div`
  display:none;
  ${({ theme }) => theme.mediaQueries.sm}{
    background: #fff;
    position: relative;
    z-index: 9;
    display:block;
  }
`;
const Investmentcenter = styled.div`
  width: 1200px;
  margin: 0 auto;
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > h2 {
    font-size: 32px;
    font-weight: 600;
    color: #220a60;
    line-height: 44px;
  }
  & > i {
    width: 36px;
    height: 6px;
    background: #220a60;
    margin-top: 32px;
  }
  & > section {
    margin: 0 auto;
    margin-top: 48px;
    ul {
      margin-bottom: 16px;
      display: flex;
      li {
        position: relative;
        width: 186px;
        height: 72px;
        background: #f5f3fb;
        border-radius: 4px;
        border: 1px solid #f5f3fb;
        display: flex;
        justify-content: center;
        align-items: center;
        filter: grayscale(100%);
        transition: all 0.2 ease;
        & + li {
          margin-left: 16px;
        }
        &:hover {
          filter: grayscale(0);
          background: #ffffff;
          box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
`;

const Investment = () => {
  const { t } = useTranslation();
  const list = [
    {
      image: "/images/home/ccfox-investors-gsr-matrix-fund.png",
      alt: "gsr-matrix-fund",
    },
    {
      image: "/images/home/ccfox-investors-fbg-capital.png",
      alt: "fbg-capital",
    },
    {
      image: "/images/home/ccfox-investors-sevenx-ventures.png",
      alt: "sevenx-ventures",
    },
    {
      image: "/images/home/ccfox-investors-super-chain-capital.png",
      alt: "super-chain-capital",
    },
    {
      image: "/images/home/ccfox-investors-ld-capital.png",
      alt: "ld-capital",
    },
    {
      image: "/images/home/ccfox-investors-consensus-lab.png",
      alt: "consensus-lab",
    },
    {
      image: "/images/home/ccfox-investors-redline-capital.png",
      alt: "redline-capital",
    },
    {
      image: "/images/home/ccfox-investors-chain-capital.png",
      alt: "chain-capital",
    },
    {
      image: "/images/home/ccfox-investors-yinglian-capital-ltd.png",
      alt: "yinglian-capital-ltd",
    },
    {
      image: "/images/home/ccfox-investors-quest-capital.png",
      alt: "quest-capital",
    },
    {
      image: "/images/home/ccfox-investors-hot-labs.png",
      alt: "hot-labs",
    },
    {
      image: "/images/home/ccfox-investors-infinity-labs.png",
      alt: "infinity-labs",
    },
  ];
  const groupArray = (array: Array<any>, length: number) => {
    let index = 0;
    let newArray = [];
    while (index < array.length) {
      newArray.push(array.slice(index, (index += length)));
    }
    return newArray;
  };
  return (
    <InvestmentWarp>
      <Investmentcenter>
        <h2>{t("InvestmentTitle")}</h2>
        <i></i>
        <section>
          {groupArray(list, 6).map((arr, index) => (
            <ul key={index}>
              {arr.map((item, idx) => (
                <li key={idx}>
                  <img src={item.image} alt={item.alt} />
                  {/* <Image
                    src={item.image}
                    alt={item.alt}
                    layout="intrinsic"
                    objectFit="contain"
                    quality={100}
                  /> */}
                </li>
              ))}
            </ul>
          ))}
        </section>
      </Investmentcenter>
    </InvestmentWarp>
  );
};

export default Investment;
