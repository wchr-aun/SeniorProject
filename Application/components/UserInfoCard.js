import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ThaiRegText from "./ThaiRegText";
import ImageCircle from "./UI/ImageCircle";
import { LinearGradient } from "expo-linear-gradient";

export default UserInfoCard = props => {
  return (
    <LinearGradient
      colors={
        props.userRole === "seller"
          ? ["#ffffff", "#fcfcfc"]
          : Colors.linearGradientDark
      }
      style={{ ...styles.userInfoContainer, ...props.style }}
    >
      <View
        style={{
          ...styles.userInfoContentContainer,
          backgroundColor:
            props.userRole === "seller"
              ? Colors.soft_secondary
              : Colors.primary_dark
        }}
      >
        {/* Row 1 */}
        <View
          style={{ ...styles.userInfoContentContainerRow1, ...styles.shadow }}
        >
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
                  color:
                    props.userRole === "seller"
                      ? Colors.on_secondary.high_constrast
                      : Colors.on_primary_dark.low_constrast
                }}
              >
                {props.userName}
              </ThaiRegText>
            </View>
            <ThaiRegText
              style={{
                color:
                  props.userRole === "seller"
                    ? Colors.on_secondary.high_constrast
                    : Colors.on_primary_dark.low_constrast
              }}
            >
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
                backgroundColor:
                  props.userRole === "seller"
                    ? "white"
                    : Colors.soft_primary_dark,
                borderRadius: 5,
                width: 35,
                height: 35,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                ...styles.shadow
              }}
            >
              <TouchableOpacity onPress={props.onSignout}>
                <Ionicons
                  name="ios-settings"
                  size={30}
                  color={
                    props.userRole === "seller"
                      ? Colors.hard_secondary
                      : Colors.hard_primary_dark
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Row 2 */}
        <View
          style={{
            ...styles.userInfoContentContainerRow2,
            backgroundColor:
              props.userRole === "seller"
                ? Colors.soft_secondary
                : Colors.hard_primary_dark
          }}
        >
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <ThaiRegText
              style={{
                fontSize: 20,
                color: Colors.on_primary_dark.high_constrast,
                fontAlign: "center"
              }}
            >
              {`${
                props.transactions
                  ? props.userRole === "seller"
                    ? props.transactions[1].length
                    : props.transactions[3].length
                  : ""
              } `}
            </ThaiRegText>
            <ThaiRegText
              style={{
                fontSize: 14,
                color:
                  props.userRole === "seller"
                    ? Colors.on_secondary.high_constrast
                    : Colors.on_primary_dark.low_constrast
              }}
            >
              {props.userRole === "seller"
                ? "รายการที่ผู้รับซื้อเสนอเวลาใหม่"
                : "รายการที่คุณกำลังเดินทางไปรับ"}
            </ThaiRegText>
          </View>

          <View
            style={{
              width: "50%",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <ThaiRegText
              style={{
                fontSize: 20,
                color: Colors.on_primary_dark.high_constrast
              }}
            >
              {`${
                props.transactions
                  ? props.userRole === "seller"
                    ? props.transactions[3].length
                    : props.transactions[0].length
                  : ""
              } `}
            </ThaiRegText>
            <ThaiRegText
              style={{
                fontSize: 14,
                color:
                  props.userRole === "seller"
                    ? Colors.on_secondary.high_constrast
                    : Colors.on_primary_dark.low_constrast
              }}
            >
              {props.userRole === "seller"
                ? "รายการที่ผู้รับซื้อกำลังเดินทางมารับ"
                : "รายการที่ร้องขอถึงคุณ"}
            </ThaiRegText>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: Colors.primary_dark,
    alignSelf: "center",
    width: "100%"
  },
  userInfoContentContainer: {
    flex: 1
  },
  imgContainer: {
    width: "30%",
    height: "100%"
  },
  userInfoContentContainerRow1: {
    height: "60%",
    width: "100%",
    flexDirection: "row",
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    padding: 10
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
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1
  }
});
