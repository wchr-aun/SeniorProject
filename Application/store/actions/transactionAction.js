import {
  getTransactions,
  getTodayTxForPathOp
} from "../../utils/firebaseFunctions";
import libary from "../../utils/libary";
import { updateTxStatus, querySellers } from "../../utils/firebaseFunctions";

export const FETCH_TRANSACTION = "FETCH_TRANSACTION";
export const FETCH_QUICK_TRANSACTION = "FETCH_QUICK_TRANSACTION";
export const FETCH_TODAY_TRANSACTION = "FETCH_TODAY_TRANSACTION";
export const CHANGE_TRANSACTION_STATUS = "CHANGE_TRANSACTION_STATUS";

export const fetchTransaction = role => {
  return async dispatch => {
    try {
      let transactions = await getTransactions(role);
      dispatch({
        type: FETCH_TRANSACTION,
        transactions
      });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: FETCH_TRANSACTION, transactions: [] });
      throw new Error(err.message);
    }
  };
};

export const fetchQuickTransaction = queryData => {
  return async dispatch => {
    try {
      // search buyer
      let SellerList = await querySellers(queryData);
      let cleanedFormatSellerList = [];
      let assignedTimeForUpdatingTx = [];

      SellerList.forEach((item, index) => {
        // edit time obj to firebase timeStamp
        let firebaseAssignedTime = [];
        item.assignedTime.forEach((time, index) => {
          let formattedTime = libary.toDate(time._seconds);
          firebaseAssignedTime.push(formattedTime);
          assignedTimeForUpdatingTx.push(formattedTime.seconds * 1000);
        });

        cleanedFormatSellerList.push({
          txId: item.id,
          detail: {
            ...item,
            assignedTime: firebaseAssignedTime,
            assignedTimeForUpdatingTx
          }
        });
      });
      console.log("cleanedFormatSellerList");
      console.log(cleanedFormatSellerList);

      // dispatch
      dispatch({
        type: FETCH_QUICK_TRANSACTION,
        quickTransactions: cleanedFormatSellerList
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const changeTransactionStatus = updatedDetail => {
  return async dispatch => {
    try {
      await updateTxStatus({
        txID: updatedDetail.txID,
        chosenTime: updatedDetail.chosenTime,
        status: updatedDetail.newStatus
      });

      // move that item to new status
      dispatch({ type: CHANGE_TRANSACTION_STATUS, updatedDetail });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: FETCH_TRANSACTION, transactionMode: [] });
      throw new Error(err.message);
    }
  };
};

export const fetchTransactionForPathOp = () => {
  return async dispatch => {
    try {
      let transactionMode = await getTodayTxForPathOp();
      dispatch({ type: FETCH_TODAY_TRANSACTION, transactionMode });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: FETCH_TODAY_TRANSACTION, transactionMode: [] });
      throw new Error(err.message);
    }
  };
};
