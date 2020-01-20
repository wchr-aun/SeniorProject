import {
  getTransactions,
  getTodayTxForPathOp
} from "../../utils/firebaseFunctions";
import libary from "../../utils/libary";

export const FETCH_TRANSACTION = "FETCH_TRANSACTION";
export const FETCH_TODAY_TRANSACTION = "FETCH_TODAY_TRANSACTION";

export const fetchTransaction = role => {
  return async dispatch => {
    try {
      let transactions = await getTransactions(role);
      let transactionsSectionListFormat = [];
      // create sectionList transactions
      transactions.forEach((transactionMode, index) => {
        let data = [];
        transactionMode.forEach((transaction, index) => {
          data.push(transaction);
        });

        transactionsSectionListFormat.push({
          transactionMode: libary.getReadableTxStatus(index),
          data
        });
      });
      dispatch({
        type: FETCH_TRANSACTION,
        transactions,
        transactionsSectionListFormat
      });
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
