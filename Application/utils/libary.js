import firebaseFunctions from "./firebaseFunctions";
import { verifyLocationPermissions } from "./permissions";
import firebase from "firebase";
import { GOOGLE_API_KEY } from "react-native-dotenv";

import {
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  geocodeAsync,
  Accuracy
} from "expo-location";
import Colors from "../constants/Colors";

const toDate = dateInSeccond => {
  return new firebase.firestore.Timestamp(dateInSeccond, 0);
};

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
      return "รอการตอบกลับ";
    case 1:
      return "มีการเสนอเวลาใหม่";
    case 2:
      return "มีผู้รับซื้อแล้ว";
    case 3:
      return "กำลังเดินทางไปรับ";
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
        zipcode: parseInt(locationInfo[0].postalCode, 10)
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

const getDisableStatusForBuyer = (btnType, txStatus) => {
  /* 
  preferTime --> 1
  accept --> 2
  buyerWillGo --> 3
  cancel --> 4
  */
  switch (txStatus) {
    case 0:
      return false;
    case 1:
      if (btnType == 1 || btnType == 2) return true;
      else return false;
    case 2:
      if (btnType != 4 && btnType != 3 && btnType != 1) return true;
      else return false;
    case 3:
      if (btnType == 1 || btnType == 2) return true;
      else return false;
    case 4:
      return true;
    case 5:
      return true;
    default:
      break;
  }
};

const getDisableStatusForSeller = (btnType, txStatus) => {
  /* 
  preferTime --> 1
  accept --> 2
  cancel --> 4
  */
  switch (txStatus) {
    case 0:
      if (btnType != 4) return true;
      else return false;
    case 1:
      if (btnType != 4 && btnType != 2) return true;
      else return false;
    case 2:
      if (btnType != 4) return true;
      else return false;
    case 3:
      return true;
    case 4:
      return true;
    case 5:
      return true;
    default:
      break;
  }
};

const getDirections = (originCoords, destinationCoords) => {
  if (destinationCoords.length >= 10 || destinationCoords.length <= 0) return false
  const mode = "driving";
  const lastIndex = destinationCoords.length - 1
  const origin = String(originCoords.latitude) + "," + String(originCoords.longitude);
  const destination = String(destinationCoords[lastIndex].latitude) + "," + String(destinationCoords[lastIndex].longitude);
  let waypoints = ""

  if (destinationCoords.length)
    for (let i = 0; i < destinationCoords.length - 1; i++)
      waypoints += String(destinationCoords[i].latitude) + "," + String(destinationCoords[i].longitude)
  
  const url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&waypoints=" + waypoints + "&destination=" + destination + "&key=" + GOOGLE_API_KEY + "&mode=" + mode;
  return fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      return decode(responseJson.routes[0].overview_polyline.points)
    }).catch(err => {
      throw err;
    });
}

const decode = (t,e) => {
  for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){
    a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])
  }return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})
}


export default {
  formatDate,
  getTransactionList,
  formatTime,
  getReadableTxStatus,
  getColorTxStatus,
  getPostalcodeAddressFromCord,
  getDisableStatusForBuyer,
  getDisableStatusForSeller,
  toDate,
  getDirections
};
