import { FETCH_WASTETYPE } from "../actions/wasteTypeAction";
import { LOGOUT } from "../actions/authAction";

initialState = {
  wasteTypes: [],
  wasteListSectionFormat: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WASTETYPE:
      console.log("FETCH_WASTETYPE Redux Run");
      return {
        ...state,
        wasteTypes: action.wasteTypes,
        wasteTypeDropdownFormat: action.wasteTypeDropdownFormat,
        wasteListSectionFormat: action.wasteListSectionFormat
      };
    case LOGOUT:
      return initialState;
  }
  return state;
};
