import { getTransactions, getTodayTxForPathOp } from "../../utils/firebaseFunctions";

export const FETCH_TRANSACTION = "FETCH_TRANSACTION";
export const FETCH_TODAY_TRANSACTION = "FETCH_TODAY_TRANSACTION";

export const fetchTransaction = role => {
  return async dispatch => {
    try {
      let transactions = await getTransactions(role);
      dispatch({ type: FETCH_TRANSACTION, transactions });
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
      dispatch({ type: FETCH_TRANSACTION, transactionMode });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: FETCH_TRANSACTION, transactionMode: [] });
      throw new Error(err.message);
    }
  };
};
