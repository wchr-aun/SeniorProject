import firebaseFunctions from "./firebaseFunctions";
import { verifyLocationPermissions } from "./permissions";

import {
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  geocodeAsync,
  Accuracy
} from "expo-location";
import Colors from "../constants/Colors";

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

const getReadableTxStatus = txStatus => {
  //   Transaction Status
  // 0 - เพิ่งสร้าง
  // 1 - ถูกปฏิเสธ แบบมีเงื่อนไข
  // 2 - รอทราบวัน
  // 3 - buyer กำลังไปรับ
  // 4 - Cancel
  // 5 - Complete เสร็จสมบูรณ์
  switch (txStatus) {
    case 0:
      return "กำลังรอการตอบกลับ";
    case 1:
      return "ถูกปฏิเสธ";
    case 2:
      return "";
    case 3:
      return "อยู่ในระหว่างการเดินทางไปรับ";
    case 4:
      return "ยกเลิก";
    case 5:
      return "ดำเนินการเสร็จสิ้น";
    default:
      break;
  }
};
const getColorTxStatus = txStatus => {
  //   Transaction Status
  // 0 - เพิ่งสร้าง
  // 1 - ถูกปฏิเสธ แบบมีเงื่อนไข
  // 2 - รอทราบวัน
  // 3 - buyer กำลังไปรับ
  // 4 - Cancel
  // 5 - Complete เสร็จสมบูรณ์
  switch (txStatus) {
    case 0:
      return Colors.txStatus.zero;
    case 1:
      return Colors.txStatus.one;
    case 2:
      return Colors.txStatus.two;
    case 3:
      return Colors.txStatus.three;
    case 4:
      return Colors.txStatus.four;
    case 5:
      return Colors.txStatus.five;
    default:
      break;
  }
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
        longitude: location.coords.longitude,
        zipcode: locationInfo[0].postalCode
      };
    } catch (err) {
      console.log("Could not reverseGeocodeAsync");
      console.log(err);
    }
  } catch (err) {
    console.log("Could not getCurrentPositionAsync");
  }
};

export const getPostalcodeAddressFromCord = async (lat, long) => {
  const locationInfo = await reverseGeocodeAsync({
    latitude: lat,
    longitude: long
  });
  return locationInfo;
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
  formatTime,
  getReadableTxStatus,
  getColorTxStatus,
  getPostalcodeAddressFromCord
};
