import firebaseFunctions from "../../utils/firebaseFunctions";
import libary from "../../utils/libary";

export const FETCH_TRANSACTION = "FETCH_TRANSACTION";

export const fetchTransaction = () => {
  return async dispatch => {
    let transactions = await firebaseFunctions.getTransactions("seller", 0);

    // Get 'amountOfType' and 'assignTime' in the right format
    transactions.forEach((item, index) => {
      transactions[index].detail.amountOfType = item.detail.items.length;
      transactions[index].detail.assignedTimeFormat = libary.formatDate(
        item.detail.assignedTime.toDate()
      );
    });

    dispatch({ type: FETCH_TRANSACTION, transactions });
  };
};
