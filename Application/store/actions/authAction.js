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
      console.log("signin()");
      console.log(result);
      dispatch({ type: SIGNIN, userProfile: result });
    });
  };
};
