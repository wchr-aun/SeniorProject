import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ThaiRegText from "./ThaiRegText";
import ImageCircle from "./UI/ImageCircle";
import { LinearGradient } from "expo-linear-gradient";

export default UserInfoCard = props => {
  console.log(props);
  return (
    <LinearGradient
      colors={Colors.linearGradientDark}
      style={{ ...styles.userInfoContainer, ...props.style }}
    >
      <View style={styles.userInfoContentContainer}>
        {/* Row 1 */}
        <View style={styles.userInfoContentContainerRow1}>
          <ImageCircle
            imgUrl={props.imgUrl}
            avariableWidth={props.avariableWidth * 0.25}
          />
          <View
            style={{
              width: props.avariableWidth * 0.5,
              padding: 20
            }}
          >
            <View style={{ width: "100%", flexDirection: "row" }}>
              <ThaiRegText
                style={{
                  ...styles.userName,
                  color: Colors.on_primary_dark.high_constrast
                }}
              >
                {props.userName}
              </ThaiRegText>
            </View>
            <ThaiRegText style={{ color: Colors.soft_secondary }}>
              {props.address}
            </ThaiRegText>
          </View>
          <View
            style={{
              width: props.avariableWidth * 0.2,
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <View
              style={{
                backgroundColor: Colors.soft_primary_dark,
                borderRadius: 5,
                width: 35,
                height: 35,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity onPress={props.onSignout}>
                <Ionicons
                  name="ios-settings"
                  size={30}
                  color={Colors.primary_dark}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Line Separate */}
        <View style={styles.lineSeparate} />
        {/* Row 2 */}
        <View style={styles.userInfoContentContainerRow2}>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_dark.low_constrast
            }}
          >
            {props.userRole === "seller"
              ? "จำนวนรายการที่รอคุณเลือกเวลา"
              : "จำนวนคำขอที่ขายขยะให้คุณ"}
          </ThaiRegText>
          <ThaiRegText
            style={{
              fontSize: 20,
              color: Colors.on_primary_dark.high_constrast
            }}
          >
            {props.numberOfIncompleteTx}
          </ThaiRegText>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: Colors.primary_dark,
    alignSelf: "center"
  },
  userInfoContentContainer: {
    flex: 1,
    margin: 10,
    height: "100%"
  },
  imgContainer: {
    width: "30%",
    height: "100%"
  },
  userInfoContentContainerRow1: {
    height: "50%",
    width: "100%",
    flexDirection: "row"
  },
  userInfoContentContainerRow2: {
    height: "40%",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16
  },
  userImg: {
    // If don't specify this, img size can't resize and organize
    width: "100%",
    height: "100%",
    paddingTop: 0
  },
  userName: {
    fontSize: 18
  },
  lineSeparate: {
    backgroundColor: Colors.hard_primary_dark,
    borderBottomColor: Colors.soft_primary_dark,
    borderBottomWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 5 //for android
  }
});
