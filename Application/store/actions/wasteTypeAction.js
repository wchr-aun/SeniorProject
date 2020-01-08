import { getWasteType } from "../../utils/firebaseFunctions";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";

export const fetchWasteType = () => {
  return async dispatch => {
    let wasteTypesList = [];
    wasteTypesList = await getWasteType();
    dispatch({ type: FETCH_WASTETYPE, wasteTypesList });
  };
};
