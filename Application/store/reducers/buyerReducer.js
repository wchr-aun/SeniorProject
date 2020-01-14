import {
  FETCH_PURCHASELIST,
  EDIT_PURCHASELIST,
  CONFIRM_CHANGE_PURCHASELIST
} from "../actions/buyerAction";
import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";
initialState = {
  wasteListSectionFormat: [],
  purchaseList: {}
};

export default (state = initialState, action) => {
  let purchaseList = state.purchaseList;
  switch (action.type) {
    case FETCH_PURCHASELIST:
      console.log("BUYERINFO _ REDUCER\n\t\t");
      return {
        ...state,
        wasteListSectionFormat: [...action.wasteListSectionFormat],
        purchaseList: action.purchaseList
      };
    case EDIT_PURCHASELIST:
      console.log("EDIT_PURCHASELIST - Redux");

      purchaseList.editValue(action.majortype, action.subtype, action.price);
      let purchaseClone = Object.assign(
        Object.create(purchaseList),
        purchaseList
      ); // react-redux not re-render when update state by the state itself

      return {
        ...state,
        purchaseList: purchaseClone // if not usd {...} format, redux isn't force react app to re-render component so that the result in the page that use this redux-variable will be same.
      };
    case CONFIRM_CHANGE_PURCHASELIST:
      console.log("CONFIRM_CHANGE_PURCHASELIST - Redux");
      console.log(action);
      return {
        ...state,
        purchaseList: action.purchaseList
      };
    case CHANGE_ROLE:
      return initialState;
    case LOGOUT:
      return initialState;
  }
  return state;
};
