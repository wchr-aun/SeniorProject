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
export const CHOOSEBUYER_SELL = "CHOOSEBUYER_SELL";
export const SET_FROM_CAMERA = "SET_FROM_CAMERA";

export const fetchSellerItems = () => {
  return async dispatch => {
    try {
      let sellerItems = new Wastes(await getSellerItems());
      dispatch({
        type: SET_SELLERITEMS,
        sellerItems: sellerItems,
        sellerItemsFlatListFormat: [...sellerItems.getFlatListFormat()]
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const updateSellerItems = sellerItems => {
  return async dispatch => {
    // update new wastesData on firebase
    try {
      console.log("sellerItemsAction -- updatedSellerItems -- ");
      console.log(sellerItems);
      await addWaste({
        items: sellerItems.getObject()
      });
      // set new wastesData
      dispatch({
        type: SET_SELLERITEMS,
        sellerItems,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat()
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const setSellerItemsForSell = sellerItems => {
  return async dispatch => {
    console.log(
      "---------> SellerItemAction ! setSellerItemsForSell <----------"
    );
    console.log(sellerItems);
    // sellerItemsForSell = sellerItems.filter(item => item.amountForSell > 0);

    // return dispatch({
    //   type: SET_WASTE_FOR_SELL,
    //   itemsForSell: [...sellerItemsForSell]
    // });
  };
};

export const getBuyerList = queryData => {
  return async dispatch => {
    try {
      // search buyer
      console.log("--- before sellerAction --- BuyerList");
      console.log(queryData);
      let buyerList = await queryBuyers(queryData);
      console.log("--- after sellerAction --- BuyerList");
      console.log(buyerList);

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

export const chooseBuyerSell = (
  sellAddr,
  sellerItems,
  buyerName,
  buyerPriceInfo,
  assignedTime
) => {
  return async dispatch => {
    // Map buyer price into an transaction
    let updatedItems = [];
    sellerItems.forEach((item, index) => {
      updatedItems.push({
        amount: item.amountForSell,
        wasteType: item.wasteType,
        price: buyerPriceInfo[item.wasteType]
      });
    });

    // do async task
    let transaction = {
      items: updatedItems,
      addr: sellAddr,
      buyer: buyerName,
      txType: 0,
      assignedTime: assignedTime
    };

    try {
      await sellWaste(transaction);
      // update redux store
      dispatch({
        type: CHOOSEBUYER_SELL,
        transaction
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};
