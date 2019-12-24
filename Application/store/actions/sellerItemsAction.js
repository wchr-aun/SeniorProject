import firebaseFunctions from "../../utils/firebaseFunctions";

export const SET_USERTRASH = "SET_USERTRASH";
export const LOAD_SELLER_ITEMS = "LOAD_USERTRASH";

export const loadSellerItems = () => {
  return async dispatch => {
    firebaseFunctions.getSellerItems().then(itemsReturned => {
      new Promise((resolve, reject) => {
        itemsReturned.forEach((item, index) => {
          firebaseFunctions
            .getWasteTypeDetail(item.wasteType)
            .then(wasteTypeDetail => {
              itemsReturned[index].wasteDisposal = wasteTypeDetail.disposal;
              itemsReturned[index].wasteDescription =
                wasteTypeDetail.description;
              if (index === itemsReturned.length - 1) {
                resolve();
              }
            });
        });
      }).then(() => {
        console.log(itemsReturned);
        console.log("From sellerItemsReducer.js " + itemsReturned);
        dispatch({
          type: LOAD_SELLER_ITEMS,
          items: [...itemsReturned]
        });
      });
    });
  };
};

export const addToCart = product => {
  return { type: SET_USERTRASH, product: product };
};
