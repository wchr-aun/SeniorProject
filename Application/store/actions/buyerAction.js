import {
  getSectionListFormatWasteType,
  editBuyerInfo,
  getPurchaseList
} from "../../utils/firebaseFunctions";
import { Wastes } from "../../models/AllUserTrash";

export const FETCH_WASTEBUYER = "FETCH_WASTEBUYER";
export const UPDATE_PURCHASELIST = "UPDATE_PURCHASELIST";

//example purchaseList
// this buyer purchaseList
// const purchaseList = {
//   plastic: {
//     PP: 12,
//     HDPE: 8.5,
//     PS: 4.5,
//     PETE: 7,
//     PVC: 17
//   },
//   glass: {
//     redGlass: 4,
//     greenGlass: 2
//   }
// };

export const fetchBuyerInfo = () => {
  return async dispatch => {
    // wasteType
    wasteListSectionFormat = await getSectionListFormatWasteType();
    purchaseList = await getPurchaseList();
    console.log("--- fetch buyer info --- wasteListSectionFormat");
    console.log("_________wasteListSectionFormat");
    console.log(wasteListSectionFormat);
    console.log("_________purchaseList");
    console.log(purchaseList);

    dispatch({
      type: FETCH_WASTEBUYER,
      wasteListSectionFormat,
      purchaseList: new Wastes(purchaseList)
    });
  };
};

export const updatePurchaseList = (purchaseList, desc, addr) => {
  return async dispatch => {
    /* 
buyerInfo = {
  purchaseList: {
    PP(waste type): 159(price),
    HDPE(waste type): 999(price)
  },
  desc: "description",
  addr: {
    "latitude": number,
    "longitude": number,
    "readable": "E",
  }
} */
    await editBuyerInfo({
      purchaseList,
      desc,
      addr
    });

    dispatch({ type: UPDATE_PURCHASELIST, purchaseList });
  };
};
