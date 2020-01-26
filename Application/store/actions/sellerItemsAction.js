import {
  getSellerItems,
  addWaste,
  queryBuyers,
  sellWaste
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
  return async dispatch => {
    try {
      let result = await getSellerItems();
      let sellerItems = new Wastes(result);
      let sellerItemsForSell = new Wastes(result);

      dispatch({
        type: SET_SELLERITEMS,
        sellerItems,
        sellerItemsForSell,
        sellerItemsFlatListFormat: [...sellerItems.getFlatListFormat(true)]
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const updateSellerItems = sellerItems => {
  return async dispatch => {
    // update new wastesData on firebase
    let sellerItemsForSell = Object.assign(
      Object.create(sellerItems),
      sellerItems
    );

    try {
      await addWaste({
        items: sellerItems.getObject()
      });
      // set new wastesData
      dispatch({
        type: SET_SELLERITEMS,
        sellerItems,
        sellerItemsForSell,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat(true)
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const clearSellerItemsCamera = () => {
  return async dispatch => {
    return dispatch({ type: CLEAR_SELLERITEMSCAMERA });
  };
};

export const setSellerItemsForSell = sellerItemsForSell => {
  return async dispatch => {
    return dispatch({
      type: SET_WASTE_FOR_SELL,
      sellerItemsForSell
    });
  };
};

export const getBuyerList = queryData => {
  return async dispatch => {
    try {
      // search buyer
      let buyerList = await queryBuyers(queryData);

      // dispatch
      dispatch({
        type: GET_BUYER_LIST,
        buyerList: buyerList
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const sellRequest = (
  sellAddr,
  sellerItems,
  buyerName,
  buyerPriceInfo,
  unavailableTypes,
  assignedTime,
  sellMode
) => {
  return async dispatch => {
    // sell only sellerItem that buyer have
    let saleList = {};
    saleList["length"] = 0;
    for (let type in sellerItems) {
      if (type != "length" && type != "_count" && type != "_selected") {
        for (let subtype in sellerItems[type]) {
          if (unavailableTypes[subtype] != undefined) break;
          // chooseBuyer sell
          if (
            sellMode === 1 &&
            !sellerItems._selected[type][subtype] == false
          ) {
            if (saleList[type] == undefined) {
              saleList[type] = {};
            }
            saleList["length"] += 1;
            saleList[type][subtype] = {
              amount: sellerItems[type][subtype]
            };
          } else if (
            !(
              buyerPriceInfo[type] == undefined ||
              buyerPriceInfo[type][subtype] == undefined ||
              sellerItems._selected[type][subtype] == false
            )
          ) {
            if (saleList[type] == undefined) {
              saleList[type] = {};
            }
            saleList["length"] += 1;
            saleList[type][subtype] = {
              amount: sellerItems[type][subtype],
              price: buyerPriceInfo[type][subtype]
            };
          }
        }
      }
    }

    // do async task
    let sellRequest = {
      saleList,
      addr: sellAddr,
      buyer: sellMode === 0 ? buyerName : "",
      txType: sellMode,
      assignedTime: assignedTime,
      unavailableTypes
    };
    try {
      if (sellRequest["saleList"]["length"] === 0) {
        return;
      }
      console.log("sellRequest");
      console.log(sellRequest);
      await sellWaste(sellRequest);
      // update redux store
      dispatch({
        type: SELLED_SELLERITEMS,
        sellRequest,
        isReadyToNavigateBack: true
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};
