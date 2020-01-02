import { LOCATION, askAsync } from "expo-permissions";
import {
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  geocodeAsync
} from "expo-location";

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
      let addrReadable = `${locationAddr[0].street} จังหวัด${locationAddr[0].region} ${locationAddr[0].postalCode}`;
      return {
        addrReadable,
        addrString: locationAddr,
        addrCord: location.coords
      };
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
  return userAddr;
};

export const getManualStringLocation = async address => {
  let userAddrCord = await geocodeAsync(address);
  console.log("getManualStringLocation completed");
  console.log(userAddrCord);
  return {
    latitude: userAddrCord[0].latitude,
    longitude: userAddrCord[0].longitude
  };
};
