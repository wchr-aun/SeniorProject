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
  wasteTypesList: [],
  purchaseList: {
    PP: 12,
    HDPE: 8.5,
    PS: 4.5,
    PETE: 7,
    PVC: 17,
    Red: 4,
    Green: 2
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WASTETYPE:
      return {
        ...state,
        wasteTypesList: [...action.wasteTypesList]
      };
    case LOGOUT:
      return initialState;
  }
  return state;
};
