import {
  LOCATION,
  askAsync,
  NOTIFICATIONS,
  CAMERA,
  CAMERA_ROLL
} from "expo-permissions";

export const verifyLocationPermissions = async () => {
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

export const verifyCameraPermissions = async () => {
  const result = await askAsync(CAMERA_ROLL, CAMERA);
  if (result.status !== "granted") {
    console.log(
      "Insufficient permissions! You need to grant camera permissions to use this app."
    );
    return false;
  }
  return true;
};

export const verifyNotificationsPermissions = async () => {
  const result = await askAsync(NOTIFICATIONS);
  if (result.status !== "granted") {
    console.log(
      "Insufficient permissions!",
      "You need to grant NOTIFICATIONS permissions to use this app."
    );
    return false;
  }
  return true;
};
