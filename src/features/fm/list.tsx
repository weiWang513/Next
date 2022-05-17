import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { Flex, Box, Text, useModal } from "@ccfoxweb/uikit";
import { lockedProduct } from "../../services/api/fm";
import useInterval from "../../hooks/useInterval";
import { Big } from "big.js";

import ApplyButton from "./ApplyButton";
import { getCurrencyList } from "../../store/modules/contractSlice";
import { useAppDispatch } from "../../store/hook";

const ListContainer = styled.div`
  margin: 47px 0 72px 0;
`;

const Title = styled(Flex)`
  align-items: flex-end;
  span {
    color: #220a60;
    font-weight: 600;
    line-height: 1;
    font-size: 24px;
    &:nth-of-type(2) {
      font-size: 14px;
      font-weight: 500;
      color: #aaa4bb;
      margin-left: 12px;
    }
  }
`;

const ListWrap = styled.div`
  margin-top: 20px;
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 8px 0 18px 0;
`;

const FlexItem = styled(Flex)`
  width: 25%;
  padding-left: 12px;
  box-sizing: border-box;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-left: 24px;
  }
`;

const CoinIcon = styled.img`
  display: block;
  width: 32px;
  margin-right: 8px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 12px;
  }
`;

const List = (props) => {
  const dispatch = useAppDispatch();

  const [list, setList] = useState([]);
  const { t } = useTranslation();

  const formatAnnualReturns = (v) => {
    return `${new Big(v || 0).times(100).toFixed(2).toString()}%`;
  };

  const getLockedProduct = () => {
    lockedProduct().then((res) => {
      console.log("lockedProduct", res);
      let data = res.data;

      if (data?.code === 0) {
        setList(data?.data || []);
      } else {
        setList([]);
      }
    });
  };

  useInterval(getLockedProduct, 60 * 1000);

  useEffect(() => {
    dispatch(getCurrencyList());
  }, []);

  return (
    <ListContainer>
      <Title>
        <span>{t("FmTitle")}</span>
        <span>{t("list1")}</span>
      </Title>

      <ListWrap>
        <Flex>
          <FlexItem>
            <Text color={"#AAA4BB"} fontSize="12px" lineHeight="32px">
              {t("list2")}
            </Text>
          </FlexItem>
          <FlexItem>
            <Text color={"#AAA4BB"} fontSize="12px" lineHeight="32px">
              {t("list3")}
            </Text>
          </FlexItem>
          <FlexItem>
            <Text color={"#AAA4BB"} fontSize="12px" lineHeight="32px">
              {t("list4")}
            </Text>
          </FlexItem>
          <FlexItem justifyContent={"flex-end"} pr={"24px"} pl={"0px"} style={{ width: "30%" }}>
            <Text color={"#AAA4BB"} fontSize="12px" lineHeight="32px">
              {t("list5")}
            </Text>
          </FlexItem>
        </Flex>

        <Box width={"100%"} height={"1px"} background={"#E9E7F0"} />

        {list?.map((item) => {
          return (
            <Box key={item.currencyId}>
              <Flex alignItems={"flex-start"}>
                <FlexItem mt={"28px"} alignItems={"flex-start"}>
                  <Flex>
                    <CoinIcon
                      src={`https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/currency/${item?.currencySymbol}@3x.png`}
                    />
                    <Text color={"#220A60"} fontSize="18px" lineHeight="23px" bold>
                      {item?.currencySymbol}
                    </Text>
                  </Flex>
                </FlexItem>

                <FlexItem flexDirection={"column"}>
                  {item?.productData.map((el) => {
                    return (
                      <Flex height={"40px"} key={el?.id} mt={"24px"}>
                        <Text color={"#20A3B5"} fontSize="18px" lineHeight="23px" bold>
                          {formatAnnualReturns(el?.annualReturns) || "--"}
                        </Text>
                      </Flex>
                    );
                  })}
                </FlexItem>
                <FlexItem flexDirection={"column"}>
                  {item?.productData.map((el) => {
                    return (
                      <Flex height={"40px"} key={el?.id} mt={"24px"}>
                        <Text color={"#220A60"} fontSize="18px" lineHeight="23px" bold>
                          {el?.period || "--"}
                          {t("list6")}
                        </Text>
                      </Flex>
                    );
                  })}
                </FlexItem>
                <FlexItem flexDirection={"column"} style={{ width: "30%" }}>
                  {item?.productData.map((el, index) => {
                    return (
                      <Flex
                        height={"40px"}
                        key={el?.id}
                        mt={"24px"}
                        justifyContent={"flex-end"}
                        pr={"24px"}
                        pl={"0px"}
                      >
                        <ApplyButton el={el} item={item} setReloadR={props.setReloadR} />
                      </Flex>
                    );
                  })}
                </FlexItem>
              </Flex>
              <Box width={"100%"} height={"1px"} background={"#E9E7F0"} mt={"24px"} />
            </Box>
          );
        })}
        <Flex justifyContent={"center"} mt={"18px"}>
          <Text color={"rgba(170, 164, 187, 1)"} fontSize="14px" lineHeight="20px">
            {t("comingSoon")}
          </Text>
        </Flex>
      </ListWrap>
    </ListContainer>
  );
};

export default List;
