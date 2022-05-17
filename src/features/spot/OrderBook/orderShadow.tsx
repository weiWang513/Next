import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const ShowdowItem = styled.span<{
  bgColor: string;
}>`
  // display: block;
  position: absolute;
  top: 0;
  right: 0;
  height: 20px;
  background: ${({ bgColor }) => (bgColor ? bgColor : `rgba(236, 81, 109, 0.2)`)};
  transition: all 0.2s ease-in-out;
`;

const orderShadow = (props) => {
  const refs = useRef(null);

  const calcWidth = (el, max) => {
    return `${(el[2] / max) * 100}%`;
  };

  useEffect(() => {
    if (refs.current) {
      // var old = refs.current;
      // var clone = refs.current.cloneNode(true);
      // // 一些基于clone的大量DOM操作
      // clone.style.width = calcWidth(props.order, props.max);
      // refs.current.parentNode.replaceChild(clone, refs.current);
      refs.current.style.width = calcWidth(props.order, props.max);
    }
  }, [props.order, props.max]);

  return (
    <ShowdowItem
      ref={refs}
      className="order-shandow"
      // width={calcWidth(props.order, props.max)}
      bgColor={props.bgColor}
    />
  );
};

export default orderShadow;
