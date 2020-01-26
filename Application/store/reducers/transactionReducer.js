import {
  FETCH_TRANSACTION,
  FETCH_QUICK_TRANSACTION,
  FETCH_TODAY_TRANSACTION,
  CHANGE_TRANSACTION_STATUS
} from "../actions/transactionAction";

import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";
import libary from "../../utils/libary";

initialState = {
  transactions: [],
  quickTransactions: [],
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
    case FETCH_QUICK_TRANSACTION:
      console.log("FETCH_QUICK_TRANSACTION - Redux");
      return { ...state, quickTransactions: [...action.quickTransactions] };
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
      let txType = action.updatedDetail.txType;
      let targetTx = "";

      if (oldStatusIndex === 0 && txType === 1) {
        // just got from 'quick selling pool'
        // get that tX
        targetTx = state.quickTransactions.filter(
          tx => tx.txId === action.updatedDetail.txID
        );
        // delete that tx in old status
        state.quickTransactions = state.quickTransactions.filter(
          tx => tx.txId !== action.updatedDetail.txID
        );
      } else {
        // get that tX
        targetTx = updatedTransactions[oldStatusIndex].filter(
          tx => tx.txId === action.updatedDetail.txID
        )[0];
        // delete that tx in old status
        updatedTransactions[oldStatusIndex] = updatedTransactions[
          oldStatusIndex
        ].filter(tx => tx.txId !== action.updatedDetail.txID);
      }

      // insert new tx in new status array
      updatedTransactions[newStatusIndex].push(targetTx);

      // update view
      let transactionsSectionListFormat = getTXSectionListFormat(
        updatedTransactions
      );

      console.log("IN TransactionReducer --- before return-update store ");
      console.log("updatedTransactions ");
      console.log(updatedTransactions);
      console.log("transactionsSectionListFormat ");
      console.log(transactionsSectionListFormat);

      return {
        ...state,
        transactions: [...updatedTransactions],
        transactionsSectionListFormat: [...transactionsSectionListFormat]
      };
    case CHANGE_ROLE:
      return initialState;
    case LOGOUT:
      return initialState;
  }
  return state;
};
