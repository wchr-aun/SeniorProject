import firebaseFunctions from "../../utils/firebaseFunctions";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";

export const fetchWasteType = () => {
  return async dispatch => {
    let wasteType = [];
    wasteType = await firebaseFunctions.getWasteType();
    dispatch({ type: FETCH_WASTETYPE, wasteType });
  };
};
