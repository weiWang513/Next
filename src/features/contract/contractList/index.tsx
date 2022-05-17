import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import Header from "./header";
import ContractItem from "./contractItem";
import { getFavorite } from "../../../services/api/contract";
import { updateFavoritesList } from "../../../store/modules/contractSlice";
import { getInjectInfo } from "../../../functions/info";
import NoData from "../../../components/NoData";
const ContractList = styled(Flex)`
  flex-direction: column;
  width: ${({ show }) => (show ? "274px" : 0)};
  // min-height: 663px;
  height: ${({ show }) => (show ? "calc(100vh - 167px)" : 0)};
  background: #08060f;
  box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.6);
  z-index: 1003;
  position: absolute;
  left: 0;
  top: 53px;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: ${({ show }) => `translate(${show ? 0 : -274}px, 0px)`};
  transition: all 0.3s ease-in-out;
`;
const ListContent = styled.div`
  flex: 1;
  overflow: overlay;
`;

const contractList = (props) => {
  const indictorList = useAppSelector((state) => state.contract.indictorList);
  const contractList = useAppSelector((state) => state.contract.contractList);
  const favoritesList = useAppSelector((state) => state.contract.favoritesList);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log(indictorList, "indictorList");
    if (isLogin) {
      getFavorite().then((res) => {
        if (res?.data?.code === 0) {
          console.log(res.data);
          const _favorites = JSON.parse(getInjectInfo("favorites") || "[]");
          dispatch(
            updateFavoritesList([
              ...new Set([...res.data?.data?.reverse(), ...(_favorites || [])]),
            ])
          );
          // dispatch(updateFavoritesList(res.data.data))
        }
      });
    } else {
      const _favorites = JSON.parse(getInjectInfo("favorites") || "[]");
      dispatch(updateFavoritesList([...new Set([...(_favorites || [])])]));
    }
  }, []);
  useEffect(() => {
    if (isLogin) {
      setTabIndex(0);
    } else {
      setTabIndex(1);
    }
  }, [isLogin]);
  const [tabIndex, setTabIndex] = useState(0);

  const listData = () => {
    switch (tabIndex) {
      case 0:
        return contractList.filter((e) =>
          favoritesList.find(
            (i) =>
              e.contractId === i &&
              (userHabit.locale === "zh_CN" ? e.contractId !== 999999 : true)
          )
        );
      case 1:
        return contractList.filter(
          (e) =>
            e.contractSide === 1 &&
            (userHabit.locale === "zh_CN" ? e.contractId !== 999999 : true)
        );
      case 2:
        return contractList.filter(
          (e) =>
            e.contractSide === 2 &&
            (userHabit.locale === "zh_CN" ? e.contractId !== 999999 : true)
        );

      default:
        break;
    }
  };
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  return (
    <ContractList onClick={stopPropagation} show={props.contractListShow}>
      <Header tabIndex={tabIndex} setTabIndex={(v) => setTabIndex(v)}></Header>
      <ListContent>
        {listData().length === 0 ? (
          <>
            <NoData />
          </>
        ) : (
          <>
            {listData()?.map((e, i) => {
              return <ContractItem key={i} indictor={e} />;
            })}
          </>
        )}
      </ListContent>
    </ContractList>
  );
};

export default contractList;
