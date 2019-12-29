import { FETCH_WASTETYPE } from "../actions/wasteTypeAction";

initialState = {
  wasteTypes: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WASTETYPE:
      return {
        wasteTypes: action.wasteType
      };
  }
  return state;
};
