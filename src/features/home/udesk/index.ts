import React, { useEffect } from "react";
import { useAppSelector } from "../../../store/hook";

const Udesk = () => {
  const userHabit = useAppSelector((state) => state.app.userHabit);

  useEffect(() => {
    // udesk 挂载 widnow
    (function (a, h, c, b, f, g) {
      a["UdeskApiObject"] = f;
      a[f] =
        a[f] ||
        function () {
          (a[f].d = a[f].d || []).push(arguments);
        };
      g = h.createElement(c);
      g.async = 1;
      g.charset = "utf-8";
      g.src = b;
      c = h.getElementsByTagName(c)[0];
      c.parentNode.insertBefore(g, c);
    })(window, document, "script", "https://assets-cli.s4.udesk.cn/im_client/js/udeskApi.js", "ud");
  }, []);

  useEffect(() => {
    if (userHabit.locale === "") return;

    let curLocale = userHabit.locale || "en_US";

    try {
      if (curLocale === "zh_CN") {
        ud({
          code: "f2c25cg",
          language: "zh-cn",
          link: "https://1316109.s4.udesk.cn/im_client/?web_plugin_id=15109"
        });
      } else if (curLocale === "zh_TW") {
        ud({
          code: "f2c25cg",
          language: "zh-TW",
          link: "https://1316109.s4.udesk.cn/im_client/?web_plugin_id=15110"
        });
      } else if (curLocale === "ko_KR") {
        ud({
          code: "f2c25cg",
          language: "ko",
          link: "https://1316109.s4.udesk.cn/im_client/?web_plugin_id=27210&language=ko"
        });
      } else {
        ud({
          code: "f2c25cg",
          language: "en-us",
          link: "https://1316109.s4.udesk.cn/im_client/?web_plugin_id=14240"
        });
      }
    } catch (error) {
      // console.log("userHabit.locale", error);
    }
  }, [userHabit.locale]);

  return null;
};

export default Udesk;
