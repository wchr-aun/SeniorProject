import {
  FETCH_TRANSACTION,
  FETCH_TODAY_TRANSACTION,
  CHANGE_TRANSACTION_STATUS
} from "../actions/transactionAction";
import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";

initialState = {
  transactions: [],
  transactionsSectionListFormat: [],
  todayTx: []
};

export default (state = initialState, action) => {
  let updatedTransactions = [];
  switch (action.type) {
    case FETCH_TRANSACTION:
      return {
        ...state,
        transactions: [...action.transactions],
        transactionsSectionListFormat: [...action.transactionsSectionListFormat]
      };
    case FETCH_TODAY_TRANSACTION:
      return {
        ...state,
        todayTx: [...action.transactionMode]
      };
    case CHANGE_TRANSACTION_STATUS:
      console.log("CHANGE_TRANSACTION_STATUS");
      updatedTransactions = [...state.transactions];
      let oldStatusIndex = action.updatedDetail.oldStatus;
      let newStatusIndex = action.updatedDetail.newStatus;
      // get that tX
      let targetTx = updatedTransactions[oldStatusIndex].filter(
        tx => tx.txId === action.updatedDetail.txID
      )[0];
      // delete that tx in old status
      updatedTransactions[oldStatusIndex] = updatedTransactions[
        oldStatusIndex
      ].filter(tx => tx.txId !== action.updatedDetail.txID);

      // insert new tx in new status array
      updatedTransactions[newStatusIndex].push(targetTx);
      console.log("--- updatedTransactions[oldStatusIndex]");
      console.log(updatedTransactions[oldStatusIndex]);
      console.log("--- updatedTransactions[newStatusIndex]");
      console.log(updatedTransactions[newStatusIndex]);

      return { ...state, transactions: updatedTransactions };
    case CHANGE_ROLE:
      return initialState;
    case LOGOUT:
      return initialState;
  }
  return state;
};
