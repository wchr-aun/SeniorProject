import { getTransactions } from "../../utils/firebaseFunctions";
import libary from "../../utils/libary";

export const FETCH_TRANSACTION = "FETCH_TRANSACTION";

export const fetchTransaction = role => {
  return async dispatch => {
    try {
      let transactions = await getTransactions(role);

      /***************************CHANGE THIS********************************/
      transactions = transactions[0]; // Change this to whatever you need to
      /**********************************************************************/

      // Get 'amountOfType' and 'assignTime' in the right format
      transactions.forEach((item, index) => {
        transactions[index].detail.amountOfType = item.detail.items.length;
        transactions[index].detail.assignedTimeFormat = libary.formatDate(
          item.detail.assignedTime.toDate()
        );
      });

      dispatch({ type: FETCH_TRANSACTION, transactions });
    } catch (err) {
      dispatch({ type: FETCH_TRANSACTION, transactions: [] });
      throw new Error(err.message);
    }
  };
};
