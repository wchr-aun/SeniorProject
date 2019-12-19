import { AsyncStorage } from "react-native";
import firebaseUtil from "../../firebase";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGIN = "LOGIN";
export const CREATEACCOUNT = "CREATEACCOUNT";
export const LOGOUT = "LOGOUT";

export const logout = () => {
  // clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  // not need to do get data-after async so it can return {} immediately
  return { type: LOGOUT };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  console.log(
    "from auth reducer --> saveDataToStorage " + typeof expirationDate
  );
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expirationDate: expirationDate
    })
  );
};
