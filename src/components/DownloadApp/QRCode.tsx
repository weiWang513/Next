import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import QRCode from 'qrcode'

const QRCodeArea = styled.div`
  width: 100%;
  height: 100%;
`

const QRCodeCompenet = (props) => {
  const QREl = useRef(null)
  useEffect(() => {
    useQRCode(props.url || '')
    console.log(props.url, 'QRCodeCompenet')
  }, [props.url])
  const useQRCode = (v:string):void => {
    QRCode.toCanvas(QREl.current, v, {margin: 2}, (error) => {
      if (error) console.error(error)
      QREl.current.style.cssText = 'width: 100%;height:100%;'
      // console.log("success!");
    })
  }
  return (
    <QRCodeArea>
      <canvas ref={QREl}></canvas>
    </QRCodeArea>
  )
}

export default QRCodeCompenet;