import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getInjectInfo, setInjectInfo } from "../../functions/info";
import { useAppSelector } from "../../store/hook";
import { getModalAlert } from "../../services/api/common";
import dayjs from "dayjs";

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
`;

const Wrap = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .target {
    display: block;
    width: 382px;
    height: 400px;
  }
  img.bg {
    display: block;
    width: 100%;
  }

  img.close {
    position: absolute;
    width: 86px;
    left: 50%;
    transform: translateX(-50%);
    bottom: -100px;
    cursor: pointer;
  }
`;

const ModalAlert = () => {
  const [show, setShow] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [jumpUrl, setJumpUrl] = useState("");
  const [endTime, setEndTime] = useState(
    new Date(new Date(new Date().toLocaleDateString())).getTime() + 24 * 60 * 60 * 1000
  ); // 当天24点时间戳

  const userHabit = useAppSelector((state) => state.app.userHabit);

  const close = () => {
    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = "auto";
    setShow(false);
  };

  const _close = () => {
    setInjectInfo("ModalAlert", endTime);
    close();
  };

  const clickPanel = (event) => {
    event.nativeEvent.stopImmediatePropagation();
  };

  useEffect(() => {
    if (userHabit.locale !== "") {
      let params = {
        type: 0, //默认是0,0代表PC， 1代表安卓，2代表ios，3代表H5
        locale: userHabit.locale
      };
      getModalAlert(params).then((res) => {
        let data = res?.data;
        if (data?.code === 0) {
          let list = data.data;
          let now = dayjs().valueOf();
          let item = list.find((el) => now < el.endTime);
          if (item) {
            let time = getInjectInfo("ModalAlert") || 0;
            if (now > Number(time) && now > item.startTime) {
              setImgUrl(item?.url);

              if (item.jumpUrl !== "") {
                if (item.jumpUrl.indexOf("?") > -1) {
                  setJumpUrl(`${item.jumpUrl}&locale=${userHabit.locale}&device=pc`);
                } else {
                  setJumpUrl(`${item.jumpUrl}?locale=${userHabit.locale}&device=pc`);
                }
              }

              let body = document.getElementsByTagName("body")[0];
              body.style.overflow = "hidden";

              setShow(true);
            }
          }
        }
      });
    }
  }, [userHabit]);

  // useEffect(() => {
  //   document.addEventListener("click", close);

  //   return () => {
  //     document.removeEventListener("click", close);
  //   };
  // }, []);
  // useEffect(() => {
  //   if (userHabit.locale === "ko_KR") {
  //     let _show = getInjectInfo("korea_modal") || false;
  //     setShow(_show ? false : true);

  //     document.addEventListener("click", close);
  //     return () => {
  //       document.removeEventListener("click", close);
  //     };
  //   }
  // }, [userHabit]);

  return (
    show && (
      <ModalContainer>
        <Wrap onClick={clickPanel}>
          <a className="target" href={jumpUrl} target="_blank" rel="noopener noreferrer">
            <img src={imgUrl} className="bg" />
          </a>
          <img src={"/images/home/koreaModalClose.png"} className="close" onClick={_close} />
        </Wrap>
      </ModalContainer>
    )
  );
};

export default ModalAlert;
