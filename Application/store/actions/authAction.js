import { AsyncStorage } from "react-native";
import firebaseFunctions from "../../utils/firebaseFunctions";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGIN = "LOGIN";
export const CREATEACCOUNT = "CREATEACCOUNT";
export const LOGOUT = "LOGOUT";
export const SIGNIN = "SIGNIN";

export const signin = () => {
  return async dispatch => {
    // do async task
    await firebaseFunctions.getUsers().then(result => {
      dispatch({ type: SIGNIN, userProfile: result });
    });
  };
};

export const logout = () => {
  // clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  // not need to do get data-after async so it can return {} immediately
  return { type: LOGOUT };
};
