import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { updatePosiMode } from "../store/modules/placeSlice";


const getPosiMode = props => {
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const accountList = useAppSelector((state) => state.assets.accountList);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (contractItem.currencyId && accountList.length > 0) {
      const accountItem = accountList.find(
        (item) => item.currencyId === contractItem?.currencyId
      );
      dispatch(updatePosiMode(accountItem ? accountItem?.posiMode : 0));
    }
  }, [contractItem, accountList]);
  return (<></>)
}

export default getPosiMode