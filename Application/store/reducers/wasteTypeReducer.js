import { FETCH_WASTETYPE } from "../actions/wasteTypeAction";
import { LOGOUT } from "../actions/authAction";
initialState = {
  /*
    array[
      {
        value: 'Plastic',
        data: [{
          value: 'HDPE',
          disposal: 'abc'
          description: 'xyz'
        },{
          value: 'PP',
          disposal: 'abc'
          description: 'xyz'
        }
      }
    ]
  */
  wasteTypesList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WASTETYPE:
      return {
        wasteTypesList: [...action.wasteTypesList]
      };
    case LOGOUT:
      return initialState;
  }
  return state;
};
