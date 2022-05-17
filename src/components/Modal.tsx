import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const Modal = styled.div<{h?;}>`
  width: 336px;
  background: #FFFFFF;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  position: fixed;
  left: calc(50% - 168px);
  top: ${({h}) => `calc(50% - ${h}px)`};
  z-index: 1000;
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
  z-index: 10;
  pointer-events: initial;
`

const modal = props => {
  return <>
    {
      props.show && <Mask />
    }
    {
      props.show && <Modal h={props.h}>
        {props.renderContent()}
      </Modal>
    }
  </>
}

export default modal