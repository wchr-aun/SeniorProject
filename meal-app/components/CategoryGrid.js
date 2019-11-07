import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableNativeFeedback
} from "react-native";
import FontUsed from "../constants/FontsUsed";

export default CategoryGrid = props => {
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.gridItem}>
      <TouchableCmp onPress={props.onPress} style={{ flex: 1 }}>
        <View
          style={{ ...styles.container, ...{ backgroundColor: props.color } }}
        >
          <Text>{props.title}</Text>
        </View>
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 15,
    height: 150,
    borderRadius: 10,
    elevation: 5, //shadow for android
    overflow:
      Platform.OS === "android" && Platform.Version >= 21 ? "hidden" : "visible"
  },
  container: {
    flex: 1,
    borderRadius: 10,
    shadowColor: "black", //shadow for IOS
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    padding: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  title: {
    fontFamily: FontUsed.titleText,
    fontSize: 22,
    textAlign: "right"
  }
});
