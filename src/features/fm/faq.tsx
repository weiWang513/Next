import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

const RegularQA = styled.div`
  width: 90%;
  background: #ffffff;
  border-radius: 12px;
  margin: 16px auto;
  padding: 16px;
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #0b0814;
    line-height: 22px;
    margin-bottom: 12px;
  }
`;

const RegularQAFM = styled.div`
  width: 100%;
  border-radius: 12px;
  margin: 72px auto;
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #220a60;
    line-height: 33px;
  }
`;

const UL = styled.ul`
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  & > li {
    transition: 1s all;
    cursor: pointer;
    user-select: none;
    .ques-div {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #220a60;
        line-height: 20px;
      }
      img {
        width: 24px;
        height: 24px;
        pointer-events: none;
      }
    }
  }
  .answer-div {
    margin-top: -45px;
    user-select: none;
    .seat {
      width: 100%;
      height: 40px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #7c7788;
      line-height: 24px;
      // margin-top: 60px;
      text-align: justify;
      user-select: none;
    }
  }
`;

const ULFM = styled.ul`
  width: 100%;
  background: #fff;
  border-radius: 16px;
  margin-top: 16px;
  -webkit-tap-highlight-color: transparent;
  & > li {
    transition: 1s all;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid #e9e7f0;
    padding: 24px;
    .ques-div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 16px;
        font-weight: 400;
        color: #220a60;
        line-height: 22px;
      }
      img {
        width: 24px;
        height: 24px;
        pointer-events: none;
      }
    }
  }
  .answer-div {
    margin-top: -45px;
    user-select: none;
    .seat {
      width: 100%;
      height: 40px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #7c7788;
      line-height: 24px;
      // margin-top: 60px;
      text-align: justify;
      user-select: none;
      margin-top: 16px;
    }
  }
`;

const RegularFAQ = ({ agent }: { agent?: string }) => {
  const { t } = useTranslation();

  let [showElem1, setShowElem1] = useState<number>(-1);

  const QuestionList = [
    {
      question: t("Question1"),
      answer: t("Answer1")
    },
    {
      question: t("Question2"),
      answer: t("Answer2")
    },
    {
      question: t("Question3"),
      answer: t("Answer3")
    },
    {
      question: t("Question4"),
      answer: t("Answer4")
    },
    {
      question: t("Question5"),
      answer: t("Answer5")
    },
    {
      question: t("Question6"),
      answer: t("Answer6")
    },
    {
      question: t("Question7"),
      answer: t("Answer7")
    }
  ];

  return agent === "web" ? (
    <RegularQAFM>
      <h3>{t("QuestionTitle")}</h3>
      <ULFM>
        {QuestionList.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              setShowElem1((showElem1 = index));
            }}
          >
            <div className="ques-div">
              <span>{item.question}</span>
              <img src={showElem1 === index ? "/images/fm/up.png" : "/images/fm/drop.png"} />
            </div>
            {showElem1 === index ? (
              <div
                className="answer-div"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowElem1((showElem1 = -1));
                }}
              >
                <div className="seat"></div>
                <p>{item.answer}</p>
              </div>
            ) : (
              ""
            )}
          </li>
        ))}
      </ULFM>
    </RegularQAFM>
  ) : (
    <RegularQA>
      <h3>{t("QuestionTitle")}</h3>
      <UL>
        {QuestionList.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              setShowElem1((showElem1 = index));
            }}
          >
            <div className="ques-div">
              <span>{item.question}</span>
              <img src={showElem1 === index ? "/images/fm/up.png" : "/images/fm/drop.png"} />
            </div>
            {showElem1 === index ? (
              <div
                className="answer-div"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowElem1((showElem1 = -1));
                }}
              >
                <div className="seat"></div>
                <p>{item.answer}</p>
              </div>
            ) : (
              ""
            )}
          </li>
        ))}
      </UL>
    </RegularQA>
  );
};

export default RegularFAQ;
