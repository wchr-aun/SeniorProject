import firebaseFunctions from "./firebaseFunctions";
import {
  verifyLocationPermissions,
  verifyCameraPermissions,
} from "./permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import firebase from "firebase";
const SELLERITEMS_UPLOAD_FILEDIR = "sellReq_imgs/";
const USER_FILEDIR = "profile_pictures/";
import { GOOGLE_API_KEY } from "react-native-dotenv";
import { Alert } from "react-native";

import {
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  geocodeAsync,
  Accuracy,
} from "expo-location";
import Colors from "../constants/Colors";
import firebaseUtil from "../firebase";

const toDate = (dateInSeccond) => {
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
    base64: true,
  });

  if (image.cancelled) {
    return;
  }
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

const pickedAnImg = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    quality: 1,
  });

  if (!result.cancelled) {
    return result;
  }
};

const takeAnImg = async () => {
  const hasPermission = await verifyCameraPermissions();
  if (!hasPermission) {
    console.log("not permit");
    return;
  }
  const image = await ImagePicker.launchCameraAsync({
    aspect: [16, 9],
    quality: 0.5,
  }).catch((err) => {
    Alert.alert(
      "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
      err.message,
      [{ text: "OK" }]
    );
  });
  return !image.cancelled ? image : null;
};

const uploadingImg = async (image, fileName, mode) => {
  let uri = image.uri;

  const response = await fetch(uri);
  const blob = await response.blob();

  var ref = firebaseUtil
    .storage()
    .ref()
    .child(
      `${mode === "tx" ? SELLERITEMS_UPLOAD_FILEDIR : USER_FILEDIR}${fileName}`
    );
  return ref.put(blob).catch((err) => {
    Alert.alert(
      "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
      err.message,
      [{ text: "OK" }]
    );
  });
};

const downloadingImg = async (imgNames, mode) => {
  let allImgs = [];
  let promises = [];
  for (let imgName of imgNames) {
    promises.push(
      firebaseUtil
        .storage()
        .ref()
        .child(
          `${
            mode === "tx" ? SELLERITEMS_UPLOAD_FILEDIR : USER_FILEDIR
          }${imgName}`
        )
        .getDownloadURL()
        .then((uri) => {
          allImgs.push(uri);
        })
    );
  }
  return Promise.all(promises).then(() => {
    return allImgs;
  });
};

const getPrediction = async (image) => {
  // send an image
  const PERDICT_LINK = "http://34.87.39.76:5000/predict";
  return await fetch(PERDICT_LINK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ photo: image.base64 }),
  })
    .then((res) => {
      return res.json().results;
    })
    .catch((error) => {
      console.log(error);
    });
};

const formatDate = (date) => {
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
    "ธันวาคม",
  ];
  return (
    date.getDate() +
    " " +
    monthNames[date.getMonth()] +
    " " +
    (date.getFullYear() + 543)
  );
};

const formatTime = (date) => {
  //   getHours() - Returns the hour of the day (0-23).
  // getMinutes() - Returns the minute (0-59).
  //   return date.toLocaleTimeString() + " น.";
  return `${
    date
      .getHours()
      .toString()
      .match(/^[12]*/i)[0] !== ""
      ? date.getHours()
      : `0${date.getHours()}`
  }:${date.getMinutes().toString() === "0" ? "00" : date.getMinutes()} น.`;
};

const getReadableTxStatus = (txStatus, userRole) => {
  //   Transaction Status
  // 0 - เพิ่งสร้าง
  // 1 - ถูกปฏิเสธ แบบมีเงื่อนไข
  // 2 - รอทราบวัน
  // 3 - buyer กำลังไปรับ
  // 4 - Cancel
  // 5 - Complete เสร็จสมบูรณ์
  switch (txStatus) {
    case 0:
      return userRole === "seller" ? "รอการตอบกลับ" : "รอคุณตอบกลับ";
    case 1:
      return userRole === "seller"
        ? "ผู้ซื้อเสนอเวลานัดใหม่"
        : "คุณเสนอเวลานัดใหม่";
    case 2:
      return userRole === "seller" ? "มีผู้รับซื้อแล้ว" : "คุณรับซื้อแล้ว";
    case 3:
      return userRole === "seller" ? "กำลังเดินทางมารับ" : "กำลังเดินทางไปรับ";
    case 4:
      return "ถูกยกเลิก";
    case 5:
      return "ดำเนินการเสร็จสิ้น";
    default:
      break;
  }
};
const getColorTxStatus = (txStatus) => {
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

const getTransactionList = async (role) => {
  let allTx = [];
  for (let i = 0; i < 6; i++) {
    await firebaseFunctions
      .getTransactions(role, i)
      .then((eachTxStatus) => {
        allTx.push(eachTxStatus);
      })
      .catch((error) => {
        Alert.alert(
          "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
          err.message,
          [{ text: "OK" }]
        );
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
      accuracy: Accuracy.BestForNavigation,
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
        zipcode: parseInt(locationInfo[0].postalCode, 10),
      };
    } catch (err) {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
    }
  } catch (err) {
    Alert.alert(
      "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
      err.message,
      [{ text: "OK" }]
    );
  }
};

export const getPostalcodeAddressFromCord = async (lat, long) => {
  const locationInfo = await reverseGeocodeAsync({
    latitude: lat,
    longitude: long,
  }).catch((err) => {
    Alert.alert(
      "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
      err.message,
      [{ text: "OK" }]
    );
  });
  return locationInfo;
};

export const getManualStringLocation = async (address) => {
  let userAddrCord = await geocodeAsync(address);
  return {
    latitude: userAddrCord[0].latitude,
    longitude: userAddrCord[0].longitude,
  };
};

const getDirections = (originCoords, destinationCoords) => {
  if (destinationCoords.length >= 10 || destinationCoords.length <= 0)
    return false;
  const mode = "driving";
  const lastIndex = destinationCoords.length - 1;
  const origin =
    String(originCoords.latitude) + "," + String(originCoords.longitude);
  const destination =
    String(destinationCoords[lastIndex].latitude) +
    "," +
    String(destinationCoords[lastIndex].longitude);
  let waypoints = "";

  if (destinationCoords.length)
    for (let i = 0; i < destinationCoords.length - 1; i++)
      waypoints +=
        String(destinationCoords[i].latitude) +
        "," +
        String(destinationCoords[i].longitude);

  const url =
    "https://maps.googleapis.com/maps/api/directions/json?origin=" +
    origin +
    "&waypoints=" +
    waypoints +
    "&destination=" +
    destination +
    "&key=" +
    GOOGLE_API_KEY +
    "&mode=" +
    mode;
  return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      return decode(responseJson.routes[0].overview_polyline.points);
    })
    .catch((err) => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
    });
};

const decode = (t, e) => {
  for (
    var n,
      o,
      u = 0,
      l = 0,
      r = 0,
      d = [],
      h = 0,
      i = 0,
      a = null,
      c = Math.pow(10, e || 5);
    u < t.length;

  ) {
    (a = null), (h = 0), (i = 0);
    do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
    while (a >= 32);
    (n = 1 & i ? ~(i >> 1) : i >> 1), (h = i = 0);
    do (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
    while (a >= 32);
    (o = 1 & i ? ~(i >> 1) : i >> 1),
      (l += n),
      (r += o),
      d.push([l / c, r / c]);
  }
  return (d = d.map(function (t) {
    return { latitude: t[0], longitude: t[1] };
  }));
};

export default {
  formatDate,
  getTransactionList,
  formatTime,
  getReadableTxStatus,
  getColorTxStatus,
  getPostalcodeAddressFromCord,
  toDate,
  getDirections,
  takeImgForGetprediction,
  uploadingImg,
  takeAnImg,
  downloadingImg,
  pickedAnImg,
  getPrediction,
};
