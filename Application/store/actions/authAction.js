import { getUsers, removeNotificationToken } from "../../utils/firebaseFunctions";
import firebaseUtil from "../../firebase";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGIN = "LOGIN";
export const CREATEACCOUNT = "CREATEACCOUNT";
export const LOGOUT = "LOGOUT";
export const SIGNIN = "SIGNIN";

export const signin = () => {
  return async dispatch => {
    // do async task-2
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

export const signout = () => {
  return async dispatch => {
    // do async task
    return removeNotificationToken().then(() => {
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
        console.log(err.message)
        return false;
      });
  };
};
