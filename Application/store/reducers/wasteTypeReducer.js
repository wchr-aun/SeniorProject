import { FETCH_WASTETYPE } from "../actions/wasteTypeAction";
import { LOGOUT, CHANGE_ROLE } from "../actions/authAction";
initialState = {
  wasteTypesList: [],
  purchaseList: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WASTETYPE:
      return {
        ...state,
        wasteTypesList: [...action.wasteTypesList],
        purchaseList: { ...action.purchaseList }
      };
    case CHANGE_ROLE:
      return initialState;
    case LOGOUT:
      return initialState;
  }
  return state;
};

// purchaseList: {
//   PP: {selected: 1, price: 12},
//   HDPE: 8.5,
//   PS: 4.5,
//   PETE: 7,
//   PVC: 17,
//   Red: 4,
//   Green: 2
// }

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
