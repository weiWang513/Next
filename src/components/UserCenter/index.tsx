import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Flex, Dropdown, message } from "@ccfoxweb/uikit";
import { ReactComponent as Avatar } from "/public/images/SVG/avatar.svg";
import { ReactComponent as RightArr } from "/public/images/SVG/right_a_n.svg";
import { ReactComponent as Copy } from "/public/images/SVG/copy.svg";
import { ReactComponent as Assets } from "/public/images/SVG/assets.svg";
import { ReactComponent as Recharge } from "/public/images/SVG/recharge.svg";
import { ReactComponent as Withdraw } from "/public/images/SVG/withdraw.svg";
import { ReactComponent as InviteR } from "/public/images/SVG/inviteR.svg";
import { ReactComponent as LogOut } from "/public/images/SVG/logout.svg";
import { removeInjectInfo } from "../../functions/info";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { setIsLogin, updateUid } from "../../store/modules/appSlice";
import copy from "copy-to-clipboard";
import { queryInviteCode } from "../../services/api/contract";
import { useTranslation } from "next-i18next";
import { hostReplace } from "../../utils/utils";

const TargetWarp = styled(Flex)`
  width: 56px;
  height: 56px;
  justify-content: center;
  cursor: pointer;
  &:hover {
    // background: #1F1830;
    svg {
      path {
        fill: #6f5aff;
      }
    }
  }
`;
const DropPadding = styled.div`
  padding-top: 4px;
`;
const DropDownMain = styled(Flex)`
  min-width: 232px;
  // width: 196px;
  // height: 216px;
  flex-direction: column;
  background: #1f1830;
  border-radius: 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const DropdownTop = styled.div`
  width: 100%;
  padding: 20px 16px 20px 24px;
  // background: #130F1D;
`;

const UserName = styled(Flex)`
  justify-content: space-between;
  // justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
  p {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    line-height: 20px;
    height: 24px;
  }
  &:hover {
    p {
      color: #6f5aff;
    }
    svg {
      path {
        fill: #6f5aff;
      }
    }
  }
`;

const UID = styled(Flex)`
  cursor: pointer;
  justify-content: flex-start;
  span {
    font-size: 14px;
    font-weight: 500;
    color: #665f7a;
    line-height: 18px;
  }
  &:hover {
    svg {
      path {
        fill: #6f5aff;
      }
    }
  }
`;

const List = styled(Flex)`
  flex: 0 0 152px;
  flex-direction: column;
  justify-content: flex-start;
`;

const ListItem = styled(Flex)`
  // width: 100%;
  min-width: 172px;
  height: 48px;
  padding: 0 8px;
  cursor: pointer;
  span {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
  }
  .selected {
    color: #14af81;
  }
  &:hover {
    background: #130f1d;
    span {
      color: #6f5aff;
    }
  }
`;
const AvatarSvg = styled(Avatar)`
  path {
    // fill: #6F5AFF;
  }
`;

const targetHoverStyle = `
  // background: #1F1830;
  svg {
    path {
      fill: #6F5AFF;
    }
  }
`;
interface UserInfo {
  username?: string;
}
interface Options {
  key: string;
  value: string;
  icon?: any;
}
const DownloadApp = () => {
  const { t } = useTranslation();
  const dropRef = useRef(null);

  const options: Options[] = [
    {
      key: t("MyBalance"),
      value: "/user/assets",
      icon: () => <Assets />,
    },
    {
      key: t("RechargeCash"),
      value: "/user/assets/recharge",
      icon: () => <Recharge />,
    },
    {
      key: t("WithDrawCash"),
      value: "/user/assets/cash",
      icon: () => <Withdraw />,
    },
    // {
    //   key: t("Transfer"),
    //   value: '/',
    //   icon: () => <Tansfer />
    // },
    {
      key: t("InviteReturn"),
      value: "/invite",
      icon: () => <InviteR />,
    },
    {
      key: t("Logout"),
      value: "",
      icon: () => <LogOut />,
    },
  ];
  const dispatch = useAppDispatch();
  const [uid, setUID] = useState<string>("");
  const userInfo = useAppSelector<UserInfo>((state) => state.app.userInfo);
  useEffect(() => {
    queryInviteCode({}).then((res) => {
      if (res?.data?.code === 0) {
        setUID(res.data.data.inviteCode);
        dispatch(updateUid(res.data.data.inviteCode));
      }
    });
  }, []);
  const dropdownTarget = (): any => {
    return (
      <TargetWarp>
        <Avatar />
      </TargetWarp>
    );
  };
  const handelClick = (v: Options): void => {
    if (v.value) {
      window.location.href = `https://${hostReplace()}${v.value}`;
    } else {
      removeInjectInfo("_authorization");
      dispatch(setIsLogin(false));
    }
  };
  const handelCopy = (): void => {
    copy(uid);
    message.success(t("CopySuccess"));
    // copy(uid, {
    //   onCopy: () => message.success(t("CopySuccess"))
    // });
  };
  const gotoUser = (): void => {
    window.location.href = `https://${hostReplace()}/user`;
  };
  return (
    <Dropdown
      position="bottom-left"
      target={dropdownTarget()}
      targetHoverStyle={targetHoverStyle}
      ref={dropRef}
    >
      <DropPadding>
        <DropDownMain>
          <DropdownTop>
            <UserName onClick={() => gotoUser()}>
              <p>{userInfo?.username}</p>
              <RightArr />
            </UserName>
            <UID>
              <span>UID:{uid}</span>
              <Copy
                onClick={() => {
                  handelCopy();
                  dropRef.current.close();
                }}
              />
            </UID>
          </DropdownTop>
          {options.map((i) => {
            return (
              <ListItem
                key={i.key}
                onClick={() => {
                  handelClick(i);
                  dropRef.current.close();
                }}
              >
                {i.icon()}
                <span>{i.key}</span>
              </ListItem>
            );
          })}
        </DropDownMain>
      </DropPadding>
    </Dropdown>
  );
};

export default DownloadApp;
