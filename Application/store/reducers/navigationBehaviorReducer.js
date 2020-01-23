import {
  OPERATION_COMPLETED,
  START_OPERATION
} from "../actions/navigationBehaviorAction";

import { LOGOUT } from "../actions/authAction";
import { SELLED_SELLERITEMS } from "../actions/sellerItemsAction";

const initialState = {
  isOperationCompleted: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case OPERATION_COMPLETED:
      return {
        isOperationCompleted: true
      };
    case START_OPERATION:
      return {
        isOperationCompleted: false
      };
    case SELLED_SELLERITEMS:
      return {
        isOperationCompleted: true
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
