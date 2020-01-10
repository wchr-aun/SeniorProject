import {
  CHOOSEBUYER_SELL,
  SET_WASTE_FOR_SELL,
  GET_BUYER_LIST,
  FETCH_SELLER_ITEMS,
  SET_SELLERITEMS
} from "../actions/sellerItemsAction";
import { LOGOUT } from "../actions/authAction";

const initialState = {
  sellerItems: {},
  sellerItemsFlatListFormat: [],
  sellerItemsCamera: [],
  itemsForSell: [],
  buyerList: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SELLERITEMS:
      console.log("SET_SELLERITEMS Redux Reducer Run");
      console.log(action);
      return {
        ...state,
        sellerItems: action.sellerItems,
        sellerItemsFlatListFormat: action.sellerItemsFlatListFormat
      };
    case SET_WASTE_FOR_SELL:
      console.log("SET_WASTE_FOR_SELL Reducer Run");
      return {
        ...state,
        itemsForSell: [...action.itemsForSell]
      };
    case CHOOSEBUYER_SELL:
      console.log("CHOOSEBUYER_SELL Reducer Run");

      //************ do remove some existing sellerItems
      return {
        ...state
      };
    case GET_BUYER_LIST:
      console.log("GET_BUYER_LIST Reducer Run");
      return {
        ...state,
        buyerList: [...action.buyerList]
      };
    case LOGOUT:
      return initialState;
  }
  return state;
}
