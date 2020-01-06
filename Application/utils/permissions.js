import { LOCATION, askAsync, NOTIFICATIONS } from "expo-permissions";

const verifyLocationPermissions = async () => {
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

const verifyCameraPermissions = async () => {
  const result = await Permissions.askAsync(
    Permissions.CAMERA_ROLL,
    Permissions.CAMERA
  );
  if (result.status !== "granted") {
    console.log(
      "Insufficient permissions! You need to grant camera permissions to use this app."
    );
    return false;
  }
  return true;
};

const verifyNotificationsPermissions = async () => {
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

export default {
  verifyLocationPermissions,
  verifyNotificationsPermissions,
  verifyCameraPermissions
};
