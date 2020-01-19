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
  sellerItemsForSell: {},
  sellerItemsFlatListFormat: [],
  sellerItemsCamera: [],
  buyerList: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SELLERITEMS:
      console.log("SET_SELLERITEMS Redux Reducer Run");
      return {
        ...state,
        sellerItems: action.sellerItems,
        sellerItemsForSell: action.sellerItemsForSell,
        sellerItemsFlatListFormat: action.sellerItemsFlatListFormat
      };
    case SET_WASTE_FOR_SELL:
      console.log("SET_WASTE_FOR_SELL Reducer Run");
      let sellerItemsForSellCloned = Object.assign(
        Object.create(action.sellerItemsForSell),
        action.sellerItemsForSell
      );
      sellerItemsForSellCloned.confirmValue();
      return {
        ...state,
        sellerItemsForSell: sellerItemsForSellCloned
      };
    case CHOOSEBUYER_SELL:
      console.log("CHOOSEBUYER_SELL Reducer Run");
      let sellerItemsCloned = Object.assign(
        Object.create(state.sellerItems),
        state.sellerItems
      );
      // reduce sellerItems
      for (let type in action.sellRequest["saleList"]) {
        if (type !== "_count" && type !== "length") {
          // got object
          for (let subtype in action.sellRequest[type]) {
            sellerItemsCloned.incrementalValue(
              type,
              subtype,
              -action.sellRequest["saleList"][type][subtype]
            );
          }
        }
      }
      //************ do remove some existing sellerItems
      return {
        ...state,
        sellerItems: sellerItemsCloned
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
