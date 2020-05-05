import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ThaiRegText from "./ThaiRegText";
import ImageCircle from "./UI/ImageCircle";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP } from "react-native-responsive-screen";
import ThaiMdText from "./ThaiMdText";
import ThaiBoldText from "./ThaiBoldText";

export default UserInfoCard = (props) => {
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
              : Colors.primary_dark,
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={props.onClick}
          style={{ width: "100%", height: "60%" }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#ffffff",
              borderBottomRightRadius: 4,
              borderBottomLeftRadius: 4,
              overflow: "hidden",
              ...styles.shadow,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "90%",
                padding: 10,
                flexDirection: "row",
              }}
            >
              <ImageCircle
                imgUrl={props.imgUrl}
                avariableWidth={props.avariableWidth * 0.25}
              />
              <View
                style={{
                  flex: 1,
                  padding: 10,
                }}
              >
                <View style={{ width: "100%" }}>
                  <ThaiBoldText
                    style={{
                      ...styles.userName,
                      color:
                        props.userRole === "seller"
                          ? Colors.on_secondary.high_constrast
                          : Colors.on_primary_dark.low_constrast,
                    }}
                  >
                    {props.userName}
                  </ThaiBoldText>
                </View>
                <View style={{ width: "100%" }}>
                  <ThaiRegText
                    style={{
                      color:
                        props.userRole === "seller"
                          ? Colors.on_secondary.high_constrast
                          : Colors.on_primary_dark.low_constrast,
                      fontSize: 16,
                    }}
                  >
                    {props.address}
                  </ThaiRegText>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignSelf: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  {/* <View style={{ backgroundColor: "red" }}> */}
                  <ThaiRegText style={{ fontSize: 12, textAlign: "right" }}>
                    กดเพื่อแก้ไขข้อมูล
                  </ThaiRegText>
                  {/* </View> */}
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: Colors.primary_bright_variant,
                height: "10%",
                width: "100%",
              }}
            />
          </View>
        </TouchableOpacity>

        {/* Row 2 */}
        <View
          style={{
            ...styles.userInfoContentContainerRow2,
            backgroundColor:
              props.userRole === "seller"
                ? Colors.soft_secondary
                : Colors.hard_primary_dark,
          }}
        >
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ThaiRegText
              style={{
                fontSize: 20,
                color: Colors.on_primary_dark.high_constrast,
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
                    : Colors.on_primary_dark.low_constrast,
              }}
            >
              {props.userRole === "seller"
                ? "รายการที่ผู้รับซื้อเสนอเวลาใหม่"
                : "รายการที่คุณกำลังเดินทางไปรับ"}
            </ThaiRegText>
          </View>

          <View
            style={{
              width: "80%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ThaiRegText
              style={{
                fontSize: 20,
                color: Colors.on_primary_dark.high_constrast,
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
                    : Colors.on_primary_dark.low_constrast,
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
    width: "100%",
  },
  userInfoContentContainer: {
    flex: 1,
  },
  imgContainer: {
    width: "30%",
    height: "100%",
  },
  userInfoContentContainerRow2: {
    height: "40%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  userImg: {
    // If don't specify this, img size can't resize and organize
    width: "100%",
    height: "100%",
    paddingTop: 0,
  },
  userName: {
    fontSize: 20,
  },
  lineSeparate: {
    borderBottomWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 5, //for android
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});
