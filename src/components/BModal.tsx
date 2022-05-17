import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ChangeSize from '../hooks/useClientSize'

const Modal = styled.div<{op?;}>`
  width: 100%;
  background: #fff;
  border-radius: 26px 24px 0px 0px;
  position: fixed;
  left: 0;
  right: 0;
  top: 137px;
  bottom: 0;
  z-index: 111;
  // height: calc(100vh - 137px);
  transition: transform 0.15s, opacity 0.15s;
  transform: ${({op}) => `scaleY(${op})`};
  transform-origin: bottom;
  opacity: ${({op}) => op || 0};
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 648px;
    height: 494px;
    background: #f5f3fb;
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
    border-radius: 16px;
    transition: opacity 0.15s;
    transform-origin: center;
    opacity: ${({op}) => op || 0};
    overflow: hidden;
    left: calc(50% - 324px);
    right: calc(50% - 324px);
    top: calc(50% - 247px);
    bottom: calc(50% - 247px);
  }
`

const Mask = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #000000;
  -webkit-transition: opacity 0.4s;
  transition: opacity 0.4s;
  opacity: 0.3;
  z-index: 11;
  pointer-events: initial;
`

const modal = props => {
  let size = ChangeSize();

  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [props.show])
  
  return <>
    {
      props.show && <Mask onClick={() => {
        if (size.width < 1280) {
          props.close()
        } else {
          return
        }
        console.log('first')
      }} />
    }
    {
      <Modal op={Number(props.show)}>
        {props.renderContent()}
      </Modal>
    }
  </>
}

export default modal