import firebaseFunctions from "../../utils/firebaseFunctions";
import firebaseUtil from "../../firebase";
import { LOCATION, askAsync } from "expo-permissions";
import { getCurrentPositionAsync, reverseGeocodeAsync } from "expo-location";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGIN = "LOGIN";
export const CREATEACCOUNT = "CREATEACCOUNT";
export const LOGOUT = "LOGOUT";
export const SIGNIN = "SIGNIN";

// use for get user location
const verifyPermissions = async () => {
  const result = await askAsync(LOCATION);
  if (result.status !== "granted") {
    console.log(
      "Insufficient permissions!",
      "You need to grant location permissions to use this app."
    );
    return false;
  }
  return true;
};
const getLocationHandler = async () => {
  const hasPermission = await verifyPermissions();
  if (!hasPermission) {
    return;
  }

  // Step-1
  try {
    const location = await getCurrentPositionAsync({
      timeout: 5000
    });
    // Step-2
    try {
      const locationAddr = await reverseGeocodeAsync(location.coords);
      return locationAddr;
    } catch (err) {
      console.log("Could not reverseGeocodeAsync");
      console.log(err);
    }
  } catch (err) {
    console.log("Could not getCurrentPositionAsync");
  }
};

// for use in future
export const getCurrentLocation = async () => {
  // do async task-1
  let userAddr = await getLocationHandler();
  console.log("userAddr");
  console.log(userAddr);
  let addr = `${userAddr[0].street} จังหวัด${userAddr[0].region} ${userAddr[0].postalCode}`;
  return addr;
};

export const signin = () => {
  return async dispatch => {
    // do async task-2
    return firebaseFunctions.getUsers().then(result => {
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
  };
};
