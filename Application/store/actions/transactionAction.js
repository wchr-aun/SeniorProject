import { getTransactions } from "../../utils/firebaseFunctions";
import libary from "../../utils/libary";

export const FETCH_TRANSACTION = "FETCH_TRANSACTION";

export const fetchTransaction = role => {
  return async dispatch => {
    try {
      let transactions = await getTransactions(role);
      dispatch({ type: FETCH_TRANSACTION, transactions });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: FETCH_TRANSACTION, transactions: [] });
      throw new Error(err.message);
    }
  };
};
