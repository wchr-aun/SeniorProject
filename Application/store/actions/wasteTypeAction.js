import { getAllWasteType } from "../../utils/firebaseFunctions";

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
    let allWasteTypeList = [];
    // wasteType
    allWasteTypeList = await getAllWasteType();
    console.log("------------- wasteTypesList RAW from wasteTypeAction");
    console.log(allWasteTypeList);

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
      WasteListSectionFormat: allWasteTypeList.WasteListSectionFormat,
      WasteList: allWasteTypeList.WasteList,
      purchaseList: modifiedPurchaseList
    });
  };
};
