import { SET_USERTRASH } from "../actions/sellerItemsAction";

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USERTRASH:
      return {
        ...state,
        items: action.items
      };
    case "SELLING_TRASH":
      console.log(action);
      return {
        ...state
      };
  }
  return state;
}
