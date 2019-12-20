import CartItem from "./../../models/cart-item";

import { ADD_TO_CART, REMOVE_FROM_CART } from "./../actions/cartAction";
import { ADD_ORDER } from "./../actions/ordersAction";
import { DELETE_PRODUCT } from "./../actions/productAction";

const initialState = {
  items: {},
  totalAmount: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;

      let updatedOrAddItemsCart;
      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        updatedOrAddItemsCart = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].totalAmount + productPrice
        );
      } else {
        // add new one to the cart-items
        updatedOrAddItemsCart = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
      }
      // Update State
      return {
        ...state,
        items: {
          ...state.items,
          [addedProduct.id]: updatedOrAddItemsCart
        },
        totalAmount: state.totalAmount + productPrice
      };
    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.productId];
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        // need to reduce it not erase it
        updatedCartItems = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.totalAmount - selectedCartItem.productPrice
        );
        updatedCartItems = {
          ...state.items,
          [action.productId]: updatedCartItems
        };
      } else {
        // Delete entire that item
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.productId];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: Math.max(state.totalAmount - selectedCartItem.productPrice)
      };
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.productId]) {
        return state;
      }
      const updatedItems = { ...state.items };
      delete updatedItems[action.productId];
      return {
        ...state,
        items: updatedItems,
        totalAmount:
          state.totalAmount - state.items[action.productId].totalAmount
      };
  }
  return state;
}
