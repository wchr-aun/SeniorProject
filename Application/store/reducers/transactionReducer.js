import {
  FETCH_TRANSACTION,
  FETCH_TODAY_TRANSACTION,
  CHANGE_TRANSACTION_STATUS
} from "../actions/transactionAction";

import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";
import libary from "../../utils/libary";

initialState = {
  transactions: [],
  transactionsSectionListFormat: [],
  todayTx: []
};

const getTXSectionListFormat = transactions => {
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
  return transactionsSectionListFormat;
};

export default (state = initialState, action) => {
  let updatedTransactions = [];
  switch (action.type) {
    case FETCH_TRANSACTION:
      console.log("FETCH_TRANSACTION");
      transactionsSectionListFormat = getTXSectionListFormat(
        action.transactions
      );
      return {
        ...state,
        transactions: [...action.transactions],
        transactionsSectionListFormat: [...transactionsSectionListFormat]
      };
    case FETCH_TODAY_TRANSACTION:
      console.log("FETCH_TODAY_TRANSACTION");
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

      // update view
      let transactionsSectionListFormat = getTXSectionListFormat(
        updatedTransactions
      );

      return {
        ...state,
        transactions: updatedTransactions,
        transactionsSectionListFormat: [...transactionsSectionListFormat]
      };
    case CHANGE_ROLE:
      return initialState;
    case LOGOUT:
      return initialState;
  }
  return state;
};
