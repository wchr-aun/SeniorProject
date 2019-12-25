import { CHOOSEBUYER_SELL, SET_WASTE } from "../actions/sellerItemsAction";

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_WASTE:
      return {
        ...state,
        items: action.items
      };
    case CHOOSEBUYER_SELL:
      return {
        ...state
      };
  }
  return state;
}
