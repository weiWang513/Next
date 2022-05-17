import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getArticlesList } from "../../../services/api/common";
import { useAppSelector } from "../../../store/hook";
import { ReactComponent as NoticeIcon } from "/public/images/SVG/notice-icon.svg";
import { ReactComponent as NoticeMore } from "/public/images/SVG/notice-more.svg";

const NoticeWarp = styled.div`
  box-shadow: 0px 4px 16px 0px rgba(34, 10, 96, 0.05);
  border-top: 1px solid #f5f3fb;
`;
const NoticeCenter = styled.div`
  max-width: 1200px;
  height: 48px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0;
  }
  & > a {
    width: 32px;
    height: 32px;
  }

  & > ul {
    flex: 1;
    height: 100%;
    overflow: hidden;
    word-break: keep-all;
    text-align: center;
    & > li {
      display: inline-block;
      box-sizing: border-box;
      position: relative;
      padding: 0 16px 0 12px;
      font-size: 14px;
      line-height: 48px;
      color: #220a60;
      & + li:before {
        content: "/";
        position: absolute;
        left: -4px;
        font-size: 12px;
        color: #220a60;
      }
      a:hover {
        color: #6024fd;
      }
    }
  }
`;

const Notice = () => {
  const [articleList, setArticleList] = useState([]);
  const userHabit = useAppSelector((state) => state.app.userHabit);

  useEffect(() => {
    if (userHabit.locale === "") return;

    let lang = userHabit?.locale || "";

    const params = { locale: lang };
    getArticlesList(params).then((res) => {
      if (res.data.code === 0) {
        const list = res.data.data.list;
        setArticleList(list);
      }
    });
  }, [userHabit.locale]);

  const getLink = () => {
    let lang = userHabit?.locale || "";
    if (lang === "zh_CN") {
      return "https://1316109.s4.udesk.cn/hc";
    } else if (lang === "zh_TW") {
      return "https://ccfox.zendesk.com/hc/zh-hk";
    } else if (lang === "ko_KR") {
      return "https://ccfox.zendesk.com/hc/ko-kr";
    } else {
      return "https://ccfox.zendesk.com/hc/en-us";
    }
  };

  return (
    <NoticeWarp>
      <NoticeCenter>
        <NoticeIcon />
        <ul>
          {articleList.map((item) => (
            <li key={item.id}>
              <a href={item.htmlUrl} target="_blank" rel="noopener noreferrer">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <a href={getLink()} target="_blank" rel="noopener noreferrer">
          <NoticeMore />
        </a>
      </NoticeCenter>
    </NoticeWarp>
  );
};

export default Notice;
