import { FETCH_TRANSACTION, FETCH_TODAY_TRANSACTION } from "../actions/transactionAction";
import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";

initialState = {
  transactions: [],
  todayTx: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRANSACTION:
      console.log(action.transactionMode)
      return {
        ...state,
        transactions: [...action.transactionMode]
      };
    case FETCH_TODAY_TRANSACTION:
      return {
        ...state,
        todayTx: [...action.transactionMode]
      };
    case CHANGE_ROLE:
      return initialState;
    case LOGOUT:
      return initialState;
  }
  return state;
};
