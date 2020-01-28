import React from "react";
import { View, StatusBar } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default CustomStatusBar = () => {
  return (
    <View style={{ height: getStatusBarHeight(), backgroundColor: "#9c9c9c" }}>
      <StatusBar translucent backgroundColor="#9c9c9c" />
    </View>
  );
};
