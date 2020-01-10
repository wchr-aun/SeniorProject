import { getWasteType } from "../../utils/firebaseFunctions";
import { Wastes } from "../../models/AllUserTrash";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";
export const UPDATE_PURCHASELIST = "UPDATE_PURCHASELIST";

export const fetchWasteType = () => {
  return async dispatch => {
    let wasteTypes = await getWasteType();

    dispatch({
      type: FETCH_WASTETYPE,
      wasteTypes: new Wastes(wasteTypes)
    });
  };
};
