import { getAllWasteType } from "../../utils/firebaseFunctions";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";

//example purchaseList
const purchaseList = {
  plastic: {
    PP: 12,
    HDPE: 8.5,
    PS: 4.5,
    PETE: 7,
    PVC: 17
  },
  glass: {
    Red: 4,
    Green: 2
  }
};

export const fetchWasteType = () => {
  return async dispatch => {
    let allWasteTypeList = [];
    // wasteType
    allWasteTypeList = await getAllWasteType();

    dispatch({
      type: FETCH_WASTETYPE,
      WasteListSectionFormat: allWasteTypeList.WasteListSectionFormat,
      WasteList: allWasteTypeList.WasteList,
      purchaseList: purchaseList
    });
  };
};
