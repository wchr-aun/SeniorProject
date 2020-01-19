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
import ImageCircle from "./UI/ImageCircle";
import libary from "../utils/libary";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Header } from "react-navigation-stack";
import AppVariableSetting from "../constants/AppVariableSetting";

export default SellTransactionCard = props => {
  // Set-up the touchable view
  let TouchableComponent = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <TouchableComponent onPress={props.onPress}>
      <View
        style={{
          width: wp("95%"),
          height: 100,
          backgroundColor: Colors.on_primary,
          alignSelf: "center",
          marginVertical: 5,
          borderRadius: 10,
          flexDirection: "row"
        }}
      >
        <ImageCircle
          imgUrl={props.imgUrl}
          avariableWidth={wp("20%")}
          style={{ marginHorizontal: wp("3%") }}
        />
        <View
          style={{
            width: wp("69%"),
            padding: wp("1.75%")
          }}
        >
          <View style={{ ...styles.BuyerName }}>
            <ThaiText style={{ fontSize: 14 }}>
              ผู้รับซื้อ {props.userName}
            </ThaiText>
          </View>
          <View style={styles.lineSeparate} />
          <View
            style={{
              ...styles.description,
              width: "100%"
            }}
          >
            <View style={{ ...styles.amountOfType, width: "50%" }}>
              <Ionicons name="md-trash" size={24} color={Colors.primary} />
              <ThaiText style={{ fontSize: 14 }}>
                {props.amountOfType} ประเภท
              </ThaiText>
            </View>
          </View>
          <View style={{ ...styles.description }}>
            <View style={{ width: "50%" }}>
              <ThaiText
                style={{
                  fontSize: 8,
                  color: libary.getColorTxStatus(props.txStatus)
                }}
              >
                {libary.getReadableTxStatus(props.txStatus)}
              </ThaiText>
            </View>
            <View style={{ width: "50%" }}>
              <ThaiText style={{ fontSize: 14 }}>{props.meetDate}</ThaiText>
            </View>
          </View>
        </View>
      </View>
    </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  container: {},
  userImg: {
    width: "100%",
    height: "100%"
  },
  description: {
    flexDirection: "row",
    justifyContent: "flex-start"
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
