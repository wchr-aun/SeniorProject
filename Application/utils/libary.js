import firebaseFunctions from "./firebaseFunctions";
import {
  verifyLocationPermissions,
  verifyCameraPermissions
} from "./permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import firebase from "firebase";
const SELLERITEMS_UPLOAD_FILEDIR = "sellReq_imgs/";

import {
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  geocodeAsync,
  Accuracy
} from "expo-location";
import Colors from "../constants/Colors";
import firebaseUtil from "../firebase";

const toDate = dateInSeccond => {
  return new firebase.firestore.Timestamp(dateInSeccond, 0);
};

const takeImgForGetprediction = async () => {
  const hasPermission = await verifyCameraPermissions();
  if (!hasPermission) {
    return;
  }
  const image = await ImagePicker.launchCameraAsync({
    aspect: [16, 9],
    quality: 0.5,
    base64: true
  });

  let resized =
    image.height > image.width
      ? { resize: { width: 600 } }
      : { resize: { height: 600 } };
  const resizedImage = await ImageManipulator.manipulateAsync(
    image.uri,
    [resized],
    { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );
  return resizedImage;
};

const takeAnImg = async () => {
  const hasPermission = await verifyCameraPermissions();
  if (!hasPermission) {
    return;
  }
  const image = await ImagePicker.launchCameraAsync({
    aspect: [16, 9],
    quality: 0.5
  });
  return image;
};

const uploadingImg = async image => {
  let uri = image.uri;

  const fileName = uri.split("/").pop();
  const response = await fetch(uri);
  const blob = await response.blob();

  console.log("before sending an img via firebaseStorage");
  var ref = firebaseUtil
    .storage()
    .ref()
    .child(SELLERITEMS_UPLOAD_FILEDIR + fileName);
  console.log("after sending an img via firebaseStorage");
  return ref.put(blob);
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
  takeImgForGetprediction,
  uploadingImg,
  takeAnImg
};
