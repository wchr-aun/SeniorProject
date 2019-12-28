import firebaseFunctions from "../../utils/firebaseFunctions";

export const GET_SELLER_ITEMS = "GET_SELLER_ITEMS";
export const SET_WASTE = "SET_WASTE";
export const GET_BUYER_LIST = "GET_BUYER_LIST";
export const CHOOSEBUYER_SELL = "CHOOSEBUYER_SELL";
export const SET_WASTE_FOR_SELL = "SET_WASTE_FOR_SELL";

export const getSellerItems = () => {
  return async dispatch => {
    let sellerItemsAndWasteType = await firebaseFunctions.getSellerListAndWasteType();
    if (sellerItemsAndWasteType.length !== 0) {
      dispatch({
        type: SET_WASTE,
        items: [...sellerItemsAndWasteType]
      });
    } else {
      dispatch({ type: SET_WASTE, items: [] });
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
    console.log("before get buyer");
    let buyerList = await firebaseFunctions.searchBuyers("", "desc");
    console.log("after get buyer");

    // dispatch
    dispatch({
      type: GET_BUYER_LIST,
      buyerList: buyerList
    });
  };
};

export const chooseBuyerSell = (addr, items, buyer, price) => {
  return async dispatch => {
    // get only the true format

    let updatedItems = [];
    items.forEach((item, index) => {
      updatedItems.push({
        amount: item.amount,
        wasteType: item.wasteType,
        price: price
      });
    });

    // do async task
    let transaction = {
      items: updatedItems,
      addr,
      buyer,
      txType: 0,
      assignedTime: new Date().getTime()
    };

    await firebaseFunctions.sellWaste(transaction);

    dispatch({
      type: CHOOSEBUYER_SELL,
      transaction
    });
  };
};
