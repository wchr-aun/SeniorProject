import {
  AUTHENTICATE,
  LOGOUT,
  CREATEACCOUNT,
  LOGIN
} from "../actions/authAction";

const initialState = {
  uid: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
