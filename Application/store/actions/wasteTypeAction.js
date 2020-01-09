import { getAllWasteType, editBuyerInfo } from "../../utils/firebaseFunctions";
import { Wastes } from "../../models/AllUserTrash";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";
export const UPDATE_PURCHASELIST = "UPDATE_PURCHASELIST";

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
    console.log("uupdatedPurchaseList check");
    console.log(purchaseList);
    console.log(desc);
    console.log(addr);
    editBuyerInfo({
      purchaseList,
      desc,
      addr
    });
  };
};
