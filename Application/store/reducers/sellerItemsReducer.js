import { SET_USERTRASH, LOAD_SELLER_ITEMS } from "../actions/sellerItemsAction";
import firebaseFunctions from "../../utils/firebaseFunctions";

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_SELLER_ITEMS:
      console.log(action.items);
      return {
        items: action.items
      };
  }
  return state;
}
