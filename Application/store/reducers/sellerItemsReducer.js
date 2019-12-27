import {
  CHOOSEBUYER_SELL,
  SET_WASTE,
  SET_WASTE_FOR_SELL
} from "../actions/sellerItemsAction";

const initialState = {
  items: [],
  itemsForSell: []
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
  }
  return state;
}
