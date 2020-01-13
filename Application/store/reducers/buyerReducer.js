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
  switch (action.type) {
    case FETCH_PURCHASELIST:
      console.log("BUYERINFO _ REDUCER\n\t\t");
      console.log(action.purchaseList);
      return {
        ...state,
        wasteListSectionFormat: [...action.wasteListSectionFormat],
        purchaseList: action.purchaseList
      };
    case EDIT_PURCHASELIST:
      console.log("EDIT_PURCHASELIST - Redux");
      console.log(action);
      return {
        ...state,
        purchaseList: action.purchaseList
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
