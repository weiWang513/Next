import React, { useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { InputGroup, Input, Modal, ModalProps } from '@ccfoxweb/uikit'
import { allAreaCodeList } from '../../../utils/utils'
import { useTranslation } from "next-i18next";
import { ReactComponent as Search } from "/public/images/SVG/search-icon.svg";
import { ReactComponent as Nodata } from "/public/images/SVG/nodata.svg";

const CodeListWarp = styled.ul`
  width: 100%;
  height: 300px;
  margin-bottom: 16px;
  overflow-y: scroll;
`
const ListRow = styled.li`
  height: 48px;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: #F5F3FB;
  }
  & > span {
    font-size: 14px;
    font-weight: 500;
    color: #130F1D;
  }
  & > div {
    font-size: 14px;
    font-weight: bold;
    color: #6024FD;
  }
`
const NodataWarp = styled.div`
  width: 100%;
  height: 300px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > span {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #AAA4BB;
    line-height: 20px;
  }
`

const CustomModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const originCodeList = allAreaCodeList()
  const [codeList, setCodeList] = useState(allAreaCodeList())
  const [searchValue, setSearchValue] = useState<string>('')
  const { t } = useTranslation()

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const listTemp = originCodeList.filter(item => {
      if (value) {
        return t(item.label).indexOf(value) > -1 || item.value.indexOf(value) > -1
      } else {
        return true
      }
    })
    setCodeList(listTemp)
    setSearchValue(value)
  }
  return (
    <Modal title={title} width={"400px"} onDismiss={onDismiss} {...props}>
      <InputGroup
        startIcon={<Search />}
        hasClear={!!searchValue}
        clearClick={() => {
          setSearchValue('')
          setCodeList(originCodeList)
        }}
      >
        <Input type="text" value={searchValue} onChange={handleSearchChange} />
      </InputGroup>
      {codeList.length > 0 ? (
        <CodeListWarp>
          {codeList?.map(item => (
            <ListRow key={item.value} onClick={() => {
              selectAreaCode(item.value)
              onDismiss()
            }}>
              <span>{t(item.label)}</span>
              <div>{item.value}</div>
            </ListRow>
          ))}
        </CodeListWarp>
      ) : (
        <NodataWarp>
          <Nodata />
          <span>{t("NodataCode")}</span>
        </NodataWarp>
      )}
    </Modal>
  )
}

export default CustomModal
