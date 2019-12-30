import firebaseFunctions from "../../utils/firebaseFunctions";

// export const FETCH_SELLER_ITEMS = "FETCH_SELLER_ITEMS";
export const SET_WASTE = "SET_WASTE";
export const SET_WASTE_FOR_SELL = "SET_WASTE_FOR_SELL";
export const GET_BUYER_LIST = "GET_BUYER_LIST";
export const CHOOSEBUYER_SELL = "CHOOSEBUYER_SELL";

export const fetchSellerItems = () => {
  return async dispatch => {
    let sellerItemsAndWasteType = [];
    try {
      console.log("sellerItemsActiin: befores getSellerListAndWasteType");
      sellerItemsAndWasteType = await firebaseFunctions.getSellerListAndWasteType();
      console.log("sellerItemsActiin: after getSellerListAndWasteType");
      dispatch({
        type: SET_WASTE,
        items: [...sellerItemsAndWasteType]
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const setUserWaste = items => {
  return async dispatch => {
    // update new wastesData on firebase
    await firebaseFunctions.addWaste({
      items
    });
    // set new wastesData
    dispatch({
      type: SET_WASTE,
      items: [...items]
    });
  };
};

export const setSellerItemsForSell = items => {
  return {
    type: SET_WASTE_FOR_SELL,
    itemsForSell: [...items]
  };
};

export const getBuyerList = () => {
  return async dispatch => {
    // search buyer
    let buyerList = await firebaseFunctions.searchBuyers("", "desc");

    // dispatch
    dispatch({
      type: GET_BUYER_LIST,
      buyerList: buyerList
    });
  };
};

export const chooseBuyerSell = (
  sellAddr,
  items,
  buyerName,
  buyerPriceInfo,
  assignedTime
) => {
  return async dispatch => {
    // Map buyer price into an transaction
    let updatedItems = [];
    items.forEach((item, index) => {
      updatedItems.push({
        amount: item.amount,
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
      await firebaseFunctions.sellWaste(transaction);
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
