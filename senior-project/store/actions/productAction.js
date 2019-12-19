export const DELETE_PRODUCT = "DELETE_PRODUCT";
import Product from "./../../models/product";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // execute async code tou want bacause redux-thunk take care for
    const userId = getState().authReducer.userId;

    try {
      const response = await fetch(
        "https://rn-shoping-cart-guide.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      // Get respond from firebase
      const resData = await response.json();
      const loadedProducts = [];

      // Store each respond into array
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    // Get redux store
    const token = getState().authReducer.token;

    // execute async code tou want bacause redux-thunk take care for
    const response = await fetch(
      `https://rn-shoping-cart-guide.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE"
      }
    );
    dispatch({
      type: DELETE_PRODUCT,
      productId: productId
    });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // Get redux store
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;

    // execute async code tou want bacause redux-thunk take care for
    const response = await fetch(
      `https://rn-shoping-cart-guide.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId
        })
      }
    );

    const resData = await response.json();

    // this below will be automatically called when asyncronus operation above are finished.
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name, //id get from firebase
        title,
        description,
        imageUrl,
        price,
        ownerId: userId
      }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    // Get redux store
    const token = getState().authReducer.token;

    // execute async code tou want bacause redux-thunk take care for
    const response = await fetch(
      `https://rn-shoping-cart-guide.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong with update product");
    } else {
      console.log("updated!");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      productId: id,
      productData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
