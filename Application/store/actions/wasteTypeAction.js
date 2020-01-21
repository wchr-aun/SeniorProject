import {
  getWasteType,
  getSectionListFormatWasteType
} from "../../utils/firebaseFunctions";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";
export const UPDATE_PURCHASELIST = "UPDATE_PURCHASELIST";

export const fetchWasteType = () => {
  return async dispatch => {
    let result = await getWasteType();
    dispatch({
      type: FETCH_WASTETYPE,
      wasteTypes: result.wasteTypes,
      wasteTypeDropdownFormat: result.wasteTypeDropdownFormat
    });
  };
};
