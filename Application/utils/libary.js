import firebaseFunctions from "./firebaseFunctions";
import { verifyLocationPermissions } from "./permissions";

import {
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  geocodeAsync,
  Accuracy
} from "expo-location";

const formatDate = date => {
  let monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฏาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  ];
  return (
    date.getDate() +
    " " +
    monthNames[date.getMonth()] +
    " " +
    (date.getFullYear() + 543)
  );
};

const formatTime = date => {
  return date.toLocaleTimeString() + " น.";
};

const getWasteDetailFromSubtype = (subWasteType, payload) => {
  console.log("---> subWasteType");
  console.log(subWasteType);
  console.log("---> payload");
  console.log(payload);
};

const getTransactionList = async role => {
  let allTx = [];
  for (let i = 0; i < 6; i++) {
    await firebaseFunctions
      .getTransactions(role, i)
      .then(eachTxStatus => {
        allTx.push(eachTxStatus);
      })
      .catch(error => {
        throw new error("Error getting document:", error);
      });
  }
  return allTx;
};

export const getCurrentLocation = async () => {
  const hasPermission = await verifyLocationPermissions();
  if (!hasPermission) {
    return;
  }
  // Step-1
  try {
    const location = await getCurrentPositionAsync({
      timeout: 5000,
      accuracy: Accuracy.BestForNavigation
    });
    // Step-2
    try {
      const locationInfo = await reverseGeocodeAsync(location.coords);
      console.log("locationInfo");
      console.log(locationInfo);
      return {
        readable:
          locationInfo[0].name +
          " " +
          locationInfo[0].region +
          " " +
          locationInfo[0].country +
          " " +
          locationInfo[0].postalCode,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (err) {
      console.log("Could not reverseGeocodeAsync");
      console.log(err);
    }
  } catch (err) {
    console.log("Could not getCurrentPositionAsync");
  }
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

export default {
  formatDate,
  getTransactionList,
  formatTime
};
