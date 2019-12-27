import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ThaiText from "./ThaiText";
import libary from "../utils/libary";
import ImageCircle from "./UI/ImageCircle";
import AppVariableSetting from "../constants/AppVariableSetting";

export default SellTransactionCard = props => {
  // Resolve change vertical and horizontal affect to width
  const [availableWidth, setAvailableWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableHeight, setAvailableHeight] = useState(
    // Delete status bar height
    Dimensions.get("window").height - AppVariableSetting.bottomBarHeight
  );
  useEffect(() => {
    const updateScreen = () => {
      setAvailableWidth(Dimensions.get("window").width);
      setAvailableHeight(
        // Real Content Height
        Dimensions.get("window").height - AppVariableSetting.bottomBarHeight
      );
    };
    Dimensions.addEventListener("change", updateScreen);
    return () => {
      Dimensions.removeEventListener("change", updateScreen);
    };
  });
  // Set-up the touchable view
  let TouchableComponent = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <TouchableComponent onPress={props.onPress}>
      <View
        style={{
          ...styles.container,
          ...props.style,
          width: availableWidth * 0.95,
          borderRadius: 10,
          flexDirection: "row"
        }}
      >
        <ImageCircle
          imgUrl={props.imgUrl}
          avariableWidth={availableWidth * 0.2}
          // style={{marginHorizontal: 10}}
        />
        <View
          style={{
            width: availableWidth * 0.7,
            // padding: 10,
            backgroundColor: "yellow"
          }}
        >
          <View style={{ ...styles.BuyerName }}>
            <ThaiText style={{ fontSize: 14 }}>{props.userName}</ThaiText>
          </View>
          <View style={styles.lineSeparate} />
          <View
            style={{
              ...styles.description,
              borderColor: "red",
              borderWidth: 1,
              width: "100%"
            }}
          >
            <View style={{ ...styles.amountOfType, width: "50%" }}>
              <Ionicons name="md-trash" size={24} color={Colors.primary} />
              <ThaiText style={{ fontSize: 14 }}>
                {props.amountOfType} ประเภท
              </ThaiText>
            </View>
            <View style={{ width: "50%" }}>
              <ThaiText style={{ fontSize: 14 }}>
                {libary.formatDate(props.meetTime)}
              </ThaiText>
            </View>
          </View>
        </View>
      </View>
    </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  userImg: {
    width: "100%",
    height: "100%"
  },
  description: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  amountOfType: {
    flexDirection: "row",
    alignItems: "center"
  },
  lineSeparate: {
    borderBottomColor: Colors.lineSeparate,
    borderBottomWidth: 1,
    marginVertical: 2
  }
});
