import React, { useState } from "react";
import { View, Button, Text, ActivityIndicator, Alert } from "react-native";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

const LocationPicker = props => {
  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant location permissions to use this app.",
        [{ text: "Okay" }]
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

    try {
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000
      });
    } catch (err) {
      Alert.alert("Could not fetch location", "Please try again", [
        { text: "Okay" }
      ]);
    }
  };

  return (
    <View>
      <View>
        <Text></Text>
      </View>
      <Button />
    </View>
  );
};
