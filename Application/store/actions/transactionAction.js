import {
  getTransactions,
  getTodayTxForPathOp
} from "../../utils/firebaseFunctions";
import libary from "../../utils/libary";
import { updateTxStatus } from "../../utils/firebaseFunctions";

export const FETCH_TRANSACTION = "FETCH_TRANSACTION";
export const FETCH_TODAY_TRANSACTION = "FETCH_TODAY_TRANSACTION";
export const CHANGE_TRANSACTION_STATUS = "CHANGE_TRANSACTION_STATUS";

export const fetchTransaction = role => {
  return async dispatch => {
    try {
      let transactions = await getTransactions(role);
      let transactionsSectionListFormat = [];
      let transactionsQuick = [];
      // create sectionList transactions
      transactions.forEach((transactionMode, index) => {
        let data = [];
        transactionMode.forEach((transaction, index) => {
          data.push(transaction);

          // for quick transaction
          if (
            transaction.detail.txStatus === 0 &&
            transaction.detail.txType === 1
          )
            transactionsQuick.push({
              transaction
            });
        });
        transactionsSectionListFormat.push({
          transactionMode: libary.getReadableTxStatus(index),
          data
        });
      });
      dispatch({
        type: FETCH_TRANSACTION,
        transactions,
        transactionsQuick,
        transactionsSectionListFormat
      });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: FETCH_TRANSACTION, transactions: [] });
      throw new Error(err.message);
    }
  };
};

export const changeTransactionStatus = updatedDetail => {
  return async dispatch => {
    try {
      console.log("updatedDetail");
      console.log(updatedDetail);
      await updateTxStatus({
        txID: updatedDetail.txID,
        // chosenTime: 0,
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
