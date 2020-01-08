import { FETCH_WASTETYPE } from "../actions/wasteTypeAction";
import { LOGOUT } from "../actions/authAction";
initialState = {
  wasteTypesList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WASTETYPE:
      // console.log("From wasteTypeReducer --> fetchWasteType");
      return {
        wasteTypesList: [...action.wasteTypesList]
      };
    case LOGOUT:
      return initialState;
  }
  return state;
};
