import {
  getSellerListAndWasteType,
  addWaste,
  searchBuyers,
  sellWaste
} from "../../utils/firebaseFunctions";

// export const FETCH_SELLER_ITEMS = "FETCH_SELLER_ITEMS";
export const SET_WASTE = "SET_WASTE";
export const SET_WASTE_FOR_SELL = "SET_WASTE_FOR_SELL";
export const GET_BUYER_LIST = "GET_BUYER_LIST";
export const CHOOSEBUYER_SELL = "CHOOSEBUYER_SELL";

export const fetchSellerItems = () => {
  return async dispatch => {
    let sellerItemsAndWasteType = [];
    try {
      sellerItemsAndWasteType = await getSellerListAndWasteType();
      dispatch({
        type: SET_WASTE,
        sellerItems: [...sellerItemsAndWasteType]
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const setUserWaste = sellerItems => {
  return async dispatch => {
    // update new wastesData on firebase
    try {
      await addWaste({
        items: sellerItems
      });
      // set new wastesData
      dispatch({
        type: SET_WASTE,
        sellerItems: [...sellerItems]
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const setSellerItemsForSell = sellerItems => {
  return {
    type: SET_WASTE_FOR_SELL,
    itemsForSell: [...sellerItems]
  };
};

export const getBuyerList = () => {
  return async dispatch => {
    try {
      // search buyer
      let buyerList = await searchBuyers("", "desc");

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
    console.log("buyerPriceInfo");
    console.log(buyerPriceInfo);
    sellerItems.forEach((item, index) => {
      updatedItems.push({
        amount: item.amount,
        wasteType: item.wasteType,
        price: buyerPriceInfo[item.wasteType]
      });
    });

    // do async task
    let transaction = {
      sellerItems: updatedItems,
      addr: sellAddr,
      buyer: buyerName,
      txType: 0,
      assignedTime: assignedTime
    };

    console.log("transaction before sending");
    console.log(transaction);

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
