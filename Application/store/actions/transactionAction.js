import { getTransactions } from "../../utils/firebaseFunctions";
import libary from "../../utils/libary";

export const FETCH_TRANSACTION = "FETCH_TRANSACTION";

export const fetchTransaction = role => {
  return async dispatch => {
    try {
      let transactionMode = await getTransactions(role);

      dispatch({ type: FETCH_TRANSACTION, transactionMode });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: FETCH_TRANSACTION, transactions: [] });
      throw new Error(err.message);
    }
  };
};
