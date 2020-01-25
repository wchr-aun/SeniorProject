import {
  getSectionListFormatWasteType,
  editBuyerInfo,
  getPurchaseList
} from "../../utils/firebaseFunctions";
import { Wastes } from "../../models/AllUserTrash";

export const FETCH_PURCHASELIST = "FETCH_PURCHASELIST";
export const EDIT_PURCHASELIST = "EDIT_PURCHASELIST";
export const CONFIRM_CHANGE_PURCHASELIST = "CONFIRM_CHANGE_PURCHASELIST";

export const fetchBuyerInfo = () => {
  return async dispatch => {
    // wasteType
    wasteListSectionFormat = await getSectionListFormatWasteType();
    purchaseList = await getPurchaseList();

    dispatch({
      type: FETCH_PURCHASELIST,
      wasteListSectionFormat,
      purchaseList: new Wastes(purchaseList)
    });
  };
};

export const editPurchaseList = (type, subtypeIndex, price) => {
  return async dispatch => {
    dispatch({
      type: EDIT_PURCHASELIST,
      majortype: type,
      subtype: subtypeIndex,
      price: parseInt(price, 10)
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
      purchaseList: purchaseList.getObject(),
      desc,
      addr
    });

    dispatch({ type: CONFIRM_CHANGE_PURCHASELIST, purchaseList });
  };
};
