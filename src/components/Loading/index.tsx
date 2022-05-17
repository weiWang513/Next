import React from "react";
import styled from "styled-components";

const LdsRing = styled.div<{ width: number; color?: string }>`
  display: inline-block;
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${({ width }) => (width / 10) * 8}px;
    height: ${({ width }) => (width / 10) * 8}px;
    margin: ${({ width }) => width / 10}px;
    border: ${({ width }) => width / 10}px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({ color }) => (color ? color : "#fff")} transparent
      transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

interface LoadingTypes {
  width?: number;
  color?: string;
}

const Loading = ({ width = 24, color }: LoadingTypes): JSX.Element => {
  return (
    <LdsRing width={width} color={color}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </LdsRing>
  );
};

export default Loading;
