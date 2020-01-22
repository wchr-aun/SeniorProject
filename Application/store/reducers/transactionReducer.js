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
      console.log(action);
      return { ...state };
    case CHANGE_ROLE:
      return initialState;
    case LOGOUT:
      return initialState;
  }
  return state;
};
