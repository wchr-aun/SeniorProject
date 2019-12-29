import { FETCH_TRANSACTION } from "../actions/transactionAction";

initialState = {
  transactions: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRANSACTION:
      console.log("transactions");
      console.log(action.transactions);

      return {
        ...state,
        transactions: [...action.transactions]
      };
  }
  return state;
};
