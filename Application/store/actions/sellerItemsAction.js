import firebaseFunctions from "../../utils/firebaseFunctions";

export const SET_WASTE = "SET_WASTE";
export const CHOOSEBUYER_SELL = "CHOOSEBUYER_SELL";

export const setUserWaste = items => {
  return dispatch => {
    // set new wastesData
    dispatch({
      type: SET_WASTE,
      items: [...items]
    });
  };
};

export const chooseBuyerSell = (addr, items, buyer, price) => {
  return async dispatch => {
    // get only the true format
    console.log("items");
    console.log(items);

    let updatedItems = [];
    items.forEach((item, index) => {
      updatedItems.push({
        amount: item.amount,
        wasteType: item.wasteType,
        price: price
      });
    });

    console.log("updatedItems from chooseBuyer");
    console.log(updatedItems);
    // do async task
    let transaction = {
      items: updatedItems,
      addr,
      buyer,
      txType: "Choose Buyer Selling",
      assignedTime: new Date().getTime()
    };
    await firebaseFunctions.sellWaste(transaction);

    dispatch({
      type: CHOOSEBUYER_SELL,
      transaction
    });
  };
};
