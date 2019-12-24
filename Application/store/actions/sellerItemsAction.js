import firebaseFunctions from "../../utils/firebaseFunctions";

export const SET_USERTRASH = "SET_USERTRASH";
export const LOAD_SELLER_ITEMS = "LOAD_USERTRASH";

export const loadSellerItems = () => {
  return async dispatch => {
    firebaseFunctions.getSellerListAndWasteType().then(items => {
      dispatch({
        type: LOAD_SELLER_ITEMS,
        items: [...items]
      });
    });
  };
};

export const addToCart = product => {
  return { type: SET_USERTRASH, product: product };
};
