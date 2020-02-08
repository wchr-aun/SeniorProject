import {
  FETCH_PURCHASELIST,
  EDIT_PURCHASELIST,
  CONFIRM_CHANGE_PURCHASELIST,
  GET_SELLER_LIST
} from "../actions/buyerAction";
import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";
initialState = {
  wasteListSectionFormat: [],
  sellerList: [],
  purchaseList: {},
  enableSearch: false
};

export default (state = initialState, action) => {
  let purchaseList = state.purchaseList;
  switch (action.type) {
    case FETCH_PURCHASELIST:
      console.log("BUYERINFO _ REDUCER\n\t\t");
      return {
        ...state,
        wasteListSectionFormat: [...action.wasteListSectionFormat],
        purchaseList: action.purchaseList,
        enableSearch: action.buyerInfo.enableSearch
      };
    case EDIT_PURCHASELIST:
      console.log("EDIT_PURCHASELIST - Redux");
      if (
        purchaseList[action.majortype] == undefined ||
        purchaseList[action.majortype][action.subtype] == undefined
      )
        purchaseList.addWasteObj({
          [action.majortype]: { [action.subtype]: 0 }
        });
      purchaseList.editValue(
        action.majortype,
        action.subtype,
        action.price - purchaseList[action.majortype][action.subtype]
      );
      return {
        ...state,
        purchaseList // if not usd {...} format, redux isn't force react app to re-render component so that the result in the page that use this redux-variable will be same.
      };
    case CONFIRM_CHANGE_PURCHASELIST:
      console.log("CONFIRM_CHANGE_PURCHASELIST - Redux");
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
