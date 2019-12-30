import {
  CHOOSEBUYER_SELL,
  SET_WASTE,
  SET_WASTE_FOR_SELL,
  GET_BUYER_LIST,
  FETCH_SELLER_ITEMS
} from "../actions/sellerItemsAction";
import { LOGOUT } from "../actions/authAction";

const initialState = {
  items: [],
  itemsForSell: [],
  buyerList: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_WASTE:
      console.log("SET WASTE Reducer Run");
      return {
        ...state,
        items: action.items
      };
    case SET_WASTE_FOR_SELL:
      console.log("SET_WASTE_FOR_SELL Reducer Run");
      console.log(action.itemsForSell);
      return {
        ...state,
        itemsForSell: [...action.itemsForSell]
      };
    case CHOOSEBUYER_SELL:
      console.log("CHOOSEBUYER_SELL Reducer Run");
      console.log(action.transaction.items);

      return {
        ...state
      };
    case GET_BUYER_LIST:
      console.log("GET_BUYER_LIST Reducer Run");
      console.log(action.buyerList);
      return {
        ...state,
        buyerList: [...action.buyerList]
      };
    case LOGOUT:
      return initialState;
  }
  return state;
}
