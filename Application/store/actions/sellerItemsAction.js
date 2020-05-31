import {
  getSellerItems,
  addWaste,
  queryBuyers,
  sellWaste,
  getFavBuyers,
} from "../../utils/firebaseFunctions";
import { Wastes } from "../../models/AllUserTrash";

// export const FETCH_SELLER_ITEMS = "FETCH_SELLER_ITEMS";
export const SET_SELLERITEMS = "SET_SELLERITEMS";
export const SET_WASTE_FOR_SELL = "SET_WASTE_FOR_SELL";
export const GET_BUYER_LIST = "GET_BUYER_LIST";
export const SELLED_SELLERITEMS = "SELLED_SELLERITEMS";
export const SET_FROM_CAMERA = "SET_FROM_CAMERA";
export const CLEAR_SELLERITEMSCAMERA = "CLEAR_SELLERITEMSCAMERA";

export const fetchSellerItems = () => {
  return async (dispatch) => {
    try {
      let result = await getSellerItems();
      let sellerItems = new Wastes(result);
      let sellerItemsForSell = new Wastes(result);

      dispatch({
        type: SET_SELLERITEMS,
        sellerItems,
        sellerItemsForSell,
        sellerItemsFlatListFormat: [...sellerItems.getFlatListFormat(true)],
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const updateSellerItems = (sellerItems) => {
  return async (dispatch) => {
    // update new wastesData on firebase
    let sellerItemsForSell = Object.assign(
      Object.create(sellerItems),
      sellerItems
    );

    try {
      await addWaste({
        items: sellerItems.getObject(),
      });
      // set new wastesData
      dispatch({
        type: SET_SELLERITEMS,
        sellerItems,
        sellerItemsForSell,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat(true),
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const clearSellerItemsCamera = () => {
  return async (dispatch) => {
    return dispatch({ type: CLEAR_SELLERITEMSCAMERA });
  };
};

export const setSellerItemsForSell = (sellerItemsForSell) => {
  return async (dispatch) => {
    return dispatch({
      type: SET_WASTE_FOR_SELL,
      sellerItemsForSell,
    });
  };
};

export const getBuyerList = (queryData) => {
  return async (dispatch) => {
    try {
      // search buyer
      let favBuyerList = await getFavBuyers();
      let buyerList = await queryBuyers(queryData);
      console.log("queryData");
      console.log(queryData);
      console.log("buyerList");
      console.log(buyerList);

      if (buyerList.length > 0) {
        // label fav flag
        for (let i = 0; i < buyerList.length; i++) {
          if (favBuyerList.includes(buyerList[i]["id"])) {
            buyerList[i]["isFav"] = true;
          } else {
            buyerList[i]["isFav"] = false;
          }
        }

        // dispatch
        dispatch({
          type: GET_BUYER_LIST,
          buyerList: buyerList,
        });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const sellRequest = (sellReq, imgsName) => {
  return async (dispatch) => {
    // do async task
    let sellRequest = {
      saleList: sellReq.saleList,
      addr: sellReq.sellerAddr,
      buyer: sellReq.sellMode === 0 ? sellReq.buyerInfomation.buyerName : "",
      txType: sellReq.sellMode,
      assignedTime: sellReq.assignedTime,
      unavailableTypes: sellReq.buyerInfomation.unavailableTypes,
      img: imgsName,
    };
    try {
      if (sellRequest["saleList"]["length"] === 0) {
        return;
      }
      await sellWaste(sellRequest);
      // update redux store
      dispatch({
        type: SELLED_SELLERITEMS,
        sellRequest,
        isReadyToNavigateBack: true,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};
