import { FETCH_WASTEBUYER, UPDATE_PURCHASELIST } from "../actions/buyerAction";
import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";
initialState = {
  wasteListSectionFormat: [],
  purchaseList: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WASTEBUYER:
      return {
        ...state,
        wasteListSectionFormat: [...action.wasteListSectionFormat],
        purchaseList: action.purchaseList
      };
    case UPDATE_PURCHASELIST:
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
