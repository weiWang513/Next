import React, { useCallback, useState, useEffect } from "react";
import _ from "lodash";

export interface ScreenSize {
  width: number;
  height: number;
}

function ChangeSize() {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  });

  const onResize = useCallback(() => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  }, []);

  useEffect(() => {
    window.addEventListener(
      "resize",
      _.debounce(() => {
        onResize();
      }, 1000)
    );
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
}

export default ChangeSize;
