import { FETCH_WASTETYPE } from "../actions/wasteTypeAction";
import { LOGOUT } from "../actions/authAction";
initialState = {
  wasteTypes: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WASTETYPE:
      console.log("From wasteTypeReducer --> fetchWasteType");
      console.log(action.wasteTypes);
      return {
        wasteTypes: [...action.wasteTypes]
      };
    case LOGOUT:
      return initialState;
  }
  return state;
};
