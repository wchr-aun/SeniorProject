import {
  getUsers,
  removeNotificationToken
} from "../../utils/firebaseFunctions";
import firebaseUtil from "../../firebase";
import { AsyncStorage } from "react-native";
import { verifyNotificationsPermissions } from "../../utils/permissions";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGIN = "LOGIN";
export const CREATEACCOUNT = "CREATEACCOUNT";
export const LOGOUT = "LOGOUT";
export const SIGNIN = "SIGNIN";
export const CHANGE_ROLE = "CHANGE_ROLE";

export const signin = () => {
  return async dispatch => {
    // do async task-2 get user info from firebase
    return getUsers().then(result => {
      dispatch({
        type: SIGNIN,
        userProfile: {
          ...result
        }
      });
      return;
    });
  };
};

export const setUserRole = role => {
  return async dispatch => {
    dispatch({
      type: CHANGE_ROLE,
      userRole: role
    });
  };
};

export const signout = () => {
  return dispatch => {
    return removeNotificationToken()
      .then(() => {
        return firebaseUtil
          .auth()
          .signOut()
          .then(() => {
            dispatch({ type: LOGOUT });
            return true;
          })
          .catch(() => {
            return false;
          });
      })
      .catch(err => {
        console.log(err.message);
        return false;
      });
  };
};

export const changeRole = role => {
  return async dispatch => {
    // do async task - set user role
    console.log("Chnage Role! in authActions into --> " + role);
    try {
      await AsyncStorage.setItem("CONFIG_ROLE", role);
      dispatch({
        type: CHANGE_ROLE,
        userRole: role
      });
    } catch (err) {
      console.log(err.message);
    }
  };
};
