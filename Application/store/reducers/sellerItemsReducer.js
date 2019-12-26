import { CHOOSEBUYER_SELL, SET_WASTE } from "../actions/sellerItemsAction";

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_WASTE:
      console.log("SET WASTE Reducer Run");
      return {
        ...state,
        items: action.items
      };
    case CHOOSEBUYER_SELL:
      console.log("CHOOSEBUYER_SELL Reducer Run");
      console.log(action.transaction.items);

      return {
        ...state
      };
  }
  return state;
}
