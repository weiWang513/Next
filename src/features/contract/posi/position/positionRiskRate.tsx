import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../../../../store/hook'
import { calcIsolatedRiskRate, calcRiskRate } from '../../../../utils/common'
import { toFix6 } from '../../../../utils/filters'
const posiRiskrate = props => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [riskRate, setRiskrate] = useState(0)

  const indictorList = useAppSelector(state => state.contract.indictorList)
  const contractList = useAppSelector(state => state.contract.contractList)
  const accountList = useAppSelector(state => state.assets.accountList)
  const posListProps = useAppSelector(state => state.assets.posListProps)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let _riskRate =
      props.item.marginType === 1
        ? toFix6(calcRiskRate(props.item, contractList, accountList, posListProps))
        : toFix6(calcIsolatedRiskRate(props.item))
    setRiskrate(_riskRate)
  }, [indictorList])
  return <>{riskRate || 0}%</>
}

export default posiRiskrate