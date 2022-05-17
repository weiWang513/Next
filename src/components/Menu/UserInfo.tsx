import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { ReactComponent as RightArr } from "/public/images/SVG/right_a_n.svg";
import { Flex, message } from "@ccfoxweb/uikit";
import { ReactComponent as Copy } from "/public/images/SVG/response/copy.svg";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { queryInviteCode } from "../../services/api/user";
import { updateUid } from "../../store/modules/appSlice";
import copy from "copy-to-clipboard";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const UserInfo = styled.div`
  padding: 0 16px 8px 24px;
  width: 100%;
  z-index: 10;
`

const L = styled(Flex)`
  justify-content: space-between;
  span {
    font-size: 24px;
    font-weight: 600;
    color: #220A60;
    line-height: 33px;
  }
`

const Tip = styled(Flex)`
  font-size: 14px;
  font-family: DINPro-Bold, DINPro;
  font-weight: bold;
  color: #AAA4BB;
  line-height: 17px;
  margin-top: 10px;
`

const userInfo = props => {
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const userLoginInfo = useAppSelector((state) => state.app.userLoginInfo);
  const [uid, setUID] = useState<string>("");
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { push } = useRouter();

  useEffect(() => {
    console.log('userInfo', userInfo, userLoginInfo)
  }, [userInfo, userLoginInfo])

  useEffect(() => {
    queryInviteCode({}).then((res) => {
      if (res?.data?.code === 0) {
        setUID(res.data.data.inviteCode);
        dispatch(updateUid(res.data.data.inviteCode));
      }
    });
  }, []);

  const handelCopy = (): void => {
    copy(uid);
    message.success(t("CopySuccess"));
  };
  
  return <UserInfo>
    <L onClick={() => push('/download')}>
      <span>{userInfo?.username}</span>
      <RightArr />
    </L>
    <Tip onClick={handelCopy}>UID: {uid}  <Copy /></Tip>
  </UserInfo>
}

export default userInfo