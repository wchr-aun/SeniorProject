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
import ThaiRegText from "./ThaiRegText";
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
          backgroundColor: Colors.on_primary_dark.low_constrast,
          alignSelf: "center",
          marginVertical: 5,
          borderRadius: 10,
          flexDirection: "row"
        }}
      >
        <ImageCircle
          imgUrl={require("./../assets/img/questionmark.png")}
          avariableWidth={wp("20%")}
          style={{ marginHorizontal: wp("3%") }}
        />
        <View
          style={{
            width: wp("69%"),
            padding: wp("1.75%")
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <View style={{ width: "60%" }}>
              <ThaiRegText
                style={{ fontSize: 10, color: Colors.soft_primary_dark }}
              >
                {props.userRole === "seller" ? "ผู้รับซื้อ: " : "ผู้ขาย: "}{" "}
                <ThaiMdText
                  style={{ fontSize: 10, color: Colors.primary_bright_variant }}
                >
                  {props.userName ? props.userName : "ยังไม่ระบุ"}
                </ThaiMdText>
              </ThaiRegText>
            </View>

            <View style={{ width: "40%" }}>
              <ThaiRegText
                style={{
                  fontSize: 10,
                  color: libary.getColorTxStatus(props.txStatus)
                }}
              >
                {libary.getReadableTxStatus(props.txStatus)}
              </ThaiRegText>
            </View>
          </View>
          <View style={styles.lineSeparateHorizontal} />
          <View
            style={{
              ...styles.description,
              width: "50%"
            }}
          >
            <View style={{ width: "100%" }}>
              <ThaiRegText style={{ fontSize: 8 }}>{props.addr}</ThaiRegText>
            </View>
          </View>
          <View style={{ ...styles.description, width: "50%" }}>
            <View style={{ ...styles.amountOfType, width: "100%" }}>
              <Ionicons name="md-trash" size={20} color={Colors.primary_dark} />
              <ThaiRegText style={{ fontSize: 12 }}>
                {props.amountOfType} ประเภท
              </ThaiRegText>
            </View>
            <View style={{ width: "100%" }}>
              <ThaiRegText style={{ fontSize: 12 }}>
                {props.meetDate}
              </ThaiRegText>
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
  lineSeparateHorizontal: {
    borderBottomColor: Colors.hard_secondary,
    borderBottomWidth: 1,
    borderRadius: 5,
    marginVertical: 5
  }
});
