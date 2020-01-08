import { getWasteType } from "../../utils/firebaseFunctions";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";

const purchaseList = {
  PP: 12,
  HDPE: 8.5,
  PS: 4.5,
  PETE: 7,
  PVC: 17,
  Red: 4,
  Green: 2
};

export const fetchWasteType = () => {
  return async dispatch => {
    let wasteTypesList = [];
    // wasteType
    wasteTypesList = await getWasteType();

    // purchaseList
    let modifiedPurchaseList = {};
    for (const subWasteType in purchaseList) {
      modifiedPurchaseList = {
        ...modifiedPurchaseList,
        [subWasteType]: {
          selected: 1,
          price: purchaseList[subWasteType]
        }
      };
    }
    dispatch({
      type: FETCH_WASTETYPE,
      wasteTypesList,
      purchaseList: modifiedPurchaseList
    });
  };
};
