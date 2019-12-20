export const ADD_ORDER = "ADD_ORDER";
import Order from "./../../models/order";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    // execute async code tou want bacause redux-thunk take care for
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        `https://rn-shoping-cart-guide.firebaseio.com/orders/${userId}.json`
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      // Get respond from firebase
      const resData = await response.json();
      const loadedOrders = [];

      // Store each respond into array
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    // execute async code tou want bacause redux-thunk take care for
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;

    const date = new Date();
    const response = await fetch(
      `https://rn-shoping-cart-guide.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong with addOrder action");
    }
    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        cartItems: cartItems,
        totalAmount: totalAmount,
        date: date
      }
    });
  };
};
