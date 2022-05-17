import React, { useEffect } from 'react';
import {Svg,SvgProps} from '@ccfoxweb/uikit'

import styled from "styled-components";

const svgPath = styled.path`
  &:hover {
    fill: ${props => props.fill};
    
  }
`

const Icon: React.FC<SvgProps> = props => {
  return (
    <Svg viewBox={props.viewBox || '0 0 32 32'} width={props.width || '40px'} height={props.height || '40px'} {...props}>
      {
        props?.path?.path?.map(path => {
          return (
            <path key={path} d={path} fill={props?.path?.color} fillRule="nonzero"></path>
          )
        })
      }
      {/* <path d="M19.5671429,8 C20.3585714,8 21,8.76629324 21,9.69813312 L21,22.3018647 C21,23.239678 20.3592857,24 19.5671429,24 L12.4328571,24 C11.645472,24.0014265 11.0051094,23.2425087 11,22.3018647 L11,9.69813312 C11,8.76117324 11.6407143,8 12.4328571,8 L19.5671429,8 Z M17,20.7999999 L15,20.7999999 C14.4477153,20.7999999 14,21.2477151 14,21.7999999 L14,21.7999999 L14,21.9333332 C14,22.485618 14.4477153,22.9333332 15,22.9333332 L15,22.9333332 L17,22.9333332 C17.5522847,22.9333332 18,22.485618 18,21.9333332 L18,21.9333332 L18,21.7999999 C18,21.2477151 17.5522847,20.7999999 17,20.7999999 L17,20.7999999 Z" id="形状结合" fill="#6F5AFF" fillRule="nonzero"></path> */}
    </Svg>
  );
};

export default Icon;