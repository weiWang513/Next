import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Checkbox, Toggle } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { ReactComponent as Setting } from "/public/images/SVG/setting.svg";
import { setInjectInfo, getInjectInfo } from "../../../../functions/info";
import { updateUserHabit } from "../../../../services/api/user";
import { setShowFavor, setPlaceConfirm, setUpDownColor } from "../../../../store/modules/appSlice";

export const SettingWarp = styled.div<{ showSettingPanel: boolean }>`
  position: relative;
  ${({ showSettingPanel }) =>
    showSettingPanel &&
    css`
      ${SettingDraw} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
      }
    `}
`;
const SettingIcon = styled(Setting)`
  cursor: pointer;
  &:hover {
    path {
      fill: #6f5aff;
    }
  }
`;
const SettingIconActive = styled(Setting)`
  cursor: pointer;
  path {
    fill: #6f5aff;
  }
`;

const StarTips = styled.aside`
  position: absolute;
  bottom: -40px;
  right: 0;
  width: 200px;
  height: 40px;
  background: #6024fd;
  border-radius: 4px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  line-height: 40px;
`;

const SettingDraw = styled.div`
  padding: 16px;
  padding-top: 6px;
  background: #1f1830;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  position: absolute;
  right: 0;
  z-index: 5;
  // 下拉效果
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
`;
const SettingItem = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 232px;
  height: 40px;
  border-bottom: 1px solid #181226;
  span.label {
    font-size: 12px;
    font-weight: 500;
    color: #605875;
    line-height: 16px;
  }
  & > div {
    display: flex;
    align-items: center;
    & > section {
      cursor: pointer;
      input {
        margin-left: 16px;
        margin-right: 4px;
      }
    }
  }
`;
const CheckboxLabel = styled.span<{ active?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ active }) => (active ? "#FFFFFF" : "#615976")};
`;

const CalcI = () => {
  const [showSettingPanel, setShowSettingPanel] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [showStarTips, setShowStarTips] = useState(false);
  const [twiceConfirm, setTwiceConfirm] = useState(false);
  const [updown, setUpdown] = useState("0");
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const showFavor = useAppSelector((state) => state.app.showFavor);
  const placeConfirm = useAppSelector((state) => state.app.placeConfirm);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.addEventListener("click", () => {
      setShowSettingPanel(false);
    });
    return () => {
      document.removeEventListener("click", () => {
        setShowSettingPanel(false);
      });
    };
  }, []);
  useEffect(() => {
    setShowStar(showFavor);
    if (!showFavor && !getInjectInfo("_showStarTips")) {
      setShowStarTips(true);
      setTimeout(() => {
        setInjectInfo("_showStarTips", "1");
        setShowStarTips(false);
      }, 3000);
    }
  }, [showFavor]);
  useEffect(() => {
    setTwiceConfirm(placeConfirm);
  }, [placeConfirm]);
  useEffect(() => {
    setUpdown(userHabit.upDownColor);
  }, [userHabit]);

  const openSetting = (event, show = false) => {
    setShowSettingPanel(show ? show : !showSettingPanel);
    event.nativeEvent.stopImmediatePropagation();
  };

  const sortData = (a, b) => a.currencyId - b.currencyId;

  const changeStar = () => {
    dispatch(setShowFavor(!showStar));
    setInjectInfo("_showStarRow", Number(!showStar).toString());
  };
  const changeTwiceConfirm = () => {
    dispatch(setPlaceConfirm(!twiceConfirm));
    setInjectInfo("NoPrompt", Number(!twiceConfirm).toString());
    if (!isLogin) return;
    updateUserHabit({
      habits: [{ habitCode: 1007, habitValue: Number(twiceConfirm) }]
    });
  };
  const changeUpdownColor = (v) => {
    dispatch(setUpDownColor(v));
    setInjectInfo("_upDownColor", v);
    if (!isLogin) return;
    updateUserHabit({
      habits: [{ habitCode: 1001, habitValue: v }]
    });
  };

  return (
    <SettingWarp showSettingPanel={showSettingPanel}>
      {showSettingPanel ? (
        <SettingIconActive onClick={(e) => openSetting(e)} />
      ) : (
        <SettingIcon onClick={(e) => openSetting(e)} />
      )}

      {showStarTips && <StarTips>{t("OpenFavorInSetting")}</StarTips>}

      <SettingDraw onClick={(e) => openSetting(e, true)}>
        <SettingItem>
          <span className="label">{t("FavorColumn")}</span>
          <Toggle checked={showStar} onChange={changeStar} scale={"sm"} isDark />
        </SettingItem>
        <SettingItem>
          <span className="label">{t("SecondConfirm")}</span>
          <Toggle checked={twiceConfirm} onChange={changeTwiceConfirm} scale={"sm"} isDark />
        </SettingItem>
        <SettingItem>
          <span className="label">{t("UpdownColor")}</span>
          <div>
            <section onClick={() => changeUpdownColor("0")}>
              <Checkbox
                name="up"
                type="checkbox"
                checked={updown === "0"}
                onChange={() => changeUpdownColor("0")}
                scale="sm"
                circle
                isDark
              />
              <CheckboxLabel active={updown === "0"}>{t("GreenUp")}</CheckboxLabel>
            </section>
            <section onClick={() => changeUpdownColor("1")}>
              <Checkbox
                name="down"
                type="checkbox"
                checked={updown === "1"}
                onChange={() => changeUpdownColor("1")}
                scale="sm"
                circle
                isDark
              />
              <CheckboxLabel active={updown === "1"}>{t("RedUp")}</CheckboxLabel>
            </section>
          </div>
        </SettingItem>
      </SettingDraw>
    </SettingWarp>
  );
};

export default CalcI;
