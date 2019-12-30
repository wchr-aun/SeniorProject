import { ADD_PLACE, SET_PLACES } from "./places-actions";
import Place from "../models/place";

import { LOGOUT } from "../actions/authAction";

const initialState = {
  places: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACES:
      return {
        places: action.places.map(
          pl => new Place(pl.id.toString(), pl.title, pl.imageUri)
        )
      };
    case ADD_PLACE:
      const newPlace = new Place(
        action.placeData.id.toString(),
        action.placeData.title,
        action.placeData.image
      );
      return {
        places: state.places.concat(newPlace)
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
