import { getAllWasteType } from "../../utils/firebaseFunctions";
import { Wastes } from "../../models/AllUserTrash";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";

//example purchaseList
// this buyer purchaseList
const purchaseList = {
  plastic: {
    PP: 12,
    HDPE: 8.5,
    PS: 4.5,
    PETE: 7,
    PVC: 17
  },
  glass: {
    redGlass: 4,
    greenGlass: 2
  }
};

export const fetchWasteType = () => {
  return async dispatch => {
    // wasteType
    wasteListSectionFormat = await getAllWasteType();

    dispatch({
      type: FETCH_WASTETYPE,
      wasteListSectionFormat,
      purchaseList: new Wastes(purchaseList)
    });
  };
};
