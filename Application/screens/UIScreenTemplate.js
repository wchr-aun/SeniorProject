import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  ActivityIndicator,
  Text
} from "react-native";

import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "react-native-responsive-screen";
import Colors from "../constants/Colors";

export default UIScreenTemplate = props => {
  return (
    <View
      style={{
        width: widthPercentageToDP("100%"),
        height: heightPercentageToDP("100%") + getStatusBarHeight(),
        backgroundColor: Colors.primary,
        paddingTop: getStatusBarHeight()
      }}
    >
      <View style={{ padding: widthPercentageToDP("5%") }}>
        <Text
          style={{ color: "white", fontSize: widthPercentageToDP("3.75%") }}
        >
          {getStatusBarHeight()}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: Colors.on_primary,
          borderRadius: 10,
          width: widthPercentageToDP("90%"),
          height: heightPercentageToDP("25%"),
          alignSelf: "center",
          flexDirection: "row"
        }}
      >
        <View
          style={{
            width: widthPercentageToDP("25%"),
            height: "100%",
            borderWidth: 1,
            borderColor: "yellow"
          }}
        ></View>
        <View
          style={{
            width: widthPercentageToDP("65%"),
            height: "100%",
            borderWidth: 1,
            borderColor: "red"
          }}
        ></View>
      </View>

      <View
        style={{
          backgroundColor: Colors.on_primary,
          borderRadius: 10,
          width: widthPercentageToDP("90%"),
          height: heightPercentageToDP("25%"),
          alignSelf: "center",
          flexDirection: "row"
        }}
      >
        <View
          style={{
            width: widthPercentageToDP("25%"),
            height: "100%",
            borderWidth: 1,
            borderColor: "yellow"
          }}
        ></View>
        <View
          style={{
            width: widthPercentageToDP("65%"),
            height: "100%",
            borderWidth: 1,
            borderColor: "red"
          }}
        ></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
