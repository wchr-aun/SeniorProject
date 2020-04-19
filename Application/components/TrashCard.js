import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Text,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Entypo, Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import ThaiMdText from "./ThaiMdText";
import ThaiRegText from "./ThaiRegText";
import Colors from "../constants/Colors";
import ImageCircle from "./UI/ImageCircle";
import ThaiBoldText from "./ThaiBoldText";

const getReadableTag = (tag) => {
  switch (tag) {
    case 0:
      return "ขยะอันตราย";
    case 1:
      return "ขยะรีไซเคิล";
    case 2:
      return "ขยะทั่วไป";
    default:
      break;
  }
};
const getColorTag = (tag) => {
  switch (tag) {
    case 0:
      return "#b51a18";
    case 1:
      return "#e6c41c";
    case 2:
      return "#1b36ab";
    default:
      break;
  }
};

export default TrashCard = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View
        style={{
          ...styles.trashCard,
          ...props.style,
          width: wp("94%"),
          height: hp("20%"),
          alignSelf: "center",
          marginVertical: 5,
          overflow: "hidden",
          backgroundColor: Colors.secondary,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            ...styles.image,
            width: "30%",
            height: "100%",
            backgroundColor: Colors.secondary,
            padding: wp("2.5%"),
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <ImageCircle
            avariableWidth={wp("20%")}
            imgUrl={props.imgUrl}
            style={{ borderWidth: 1, borderColor: Colors.soft_secondary }}
          />
        </View>

        <View
          style={{
            ...styles.descriptionContainer,
            width: "50%",
            height: "100%",
            backgroundColor: Colors.secondary,
          }}
        >
          <View
            style={{
              ...styles.sellerItemName,
              ...styles.descriptionRow,
              width: "100%",
              height: "30%",
            }}
          >
            <ThaiRegText style={{ fontSize: 12 }}>ประเภท: </ThaiRegText>
            <ThaiMdText
              style={{
                ...styles.trashName,
                color: Colors.primary_bright_variant,
                fontSize: 12,
              }}
            >
              {props.wasteName}
            </ThaiMdText>
          </View>
          {props.editingMode && !props.cameraMode ? (
            <>
              <View
                style={{
                  ...styles._sellerItemPrice,
                  ...styles.descriptionRow,
                  width: "100%",
                  height: "60%",
                }}
              >
                <ThaiRegText style={{ fontSize: 12 }}>
                  {`จำนวนเปลี่ยนแปลง   `}
                  <ThaiBoldText
                    style={{
                      fontSize: 12,
                      color:
                        isNaN(props.changeAmount) || props.changeAmount === 0
                          ? Colors.primary_dark
                          : props.changeAmount > 0
                          ? Colors.primary_bright
                          : Colors.error,
                    }}
                  >
                    {props.changeAmount ? props.changeAmount.toString() : 0}
                  </ThaiBoldText>
                </ThaiRegText>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  ...styles.sellerItemDisposal,
                  ...styles.descriptionRow,
                  width: "100%",
                  height: "30%",
                  justifyContent: "space-around",
                }}
              >
                <View style={{ width: "20%" }}>
                  <Ionicons
                    name="md-trash"
                    size={25}
                    color={getColorTag(props.wasteTag)}
                  />
                </View>
                <View style={{ width: "80%" }}>
                  <ThaiRegText
                    style={{
                      ...styles.trashDisposal,
                      color: getColorTag(props.wasteTag),
                    }}
                  >
                    {` ${getReadableTag(props.wasteTag)}`}
                  </ThaiRegText>
                </View>
              </View>
              <View
                style={{
                  ...styles._sellerItemPrice,
                  ...styles.descriptionRow,
                  width: "100%",
                  height: "30%",
                }}
              >
                <ThaiRegText style={styles.trashAdjustPrice}>
                  {`ราคารับซื้อเฉลี่ย `}
                </ThaiRegText>
                <ThaiBoldText
                  style={{ fontSize: 12, color: Colors.soft_primary_bright }}
                >
                  {props.trashAdjustPrice}
                </ThaiBoldText>
                <ThaiRegText style={styles.trashAdjustPrice}>
                  {` บ./กก.`}
                </ThaiRegText>
              </View>
            </>
          )}
        </View>

        {/* Adjust Component */}
        <View
          style={{
            width: "20%",
            height: "100%",
            backgroundColor: Colors.secondary,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <View
            style={{
              ...styles.shadow,
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "space-around",
              borderRadius: 8,
              backgroundColor: Colors.soft_secondary,
            }}
          >
            {/* + */}
            <View
              style={{
                width: "100%",
                height: "30%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!props.selected &&
              !props.editingMode &&
              !props.cameraMode ? null : (
                <TouchableOpacity onPress={props.onIncrease}>
                  <AntDesign
                    name="plus"
                    size={24}
                    color={Colors.soft_primary_dark}
                  />
                </TouchableOpacity>
              )}
            </View>
            {/* number */}
            <View
              style={{
                width: "100%",
                height: "30%",
                justifyContent: "center",
                alignItems: "center",
                ...styles.shadow,
              }}
            >
              {props.editingMode ? (
                <TextInput
                  style={{ textAlign: "center" }}
                  selectTextOnFocus={true}
                  keyboardType="numeric"
                  onChangeText={props.onEdit}
                  value={props.editingValue}
                  textAlign={"center"}
                />
              ) : (
                <Text style={{ textAlign: "center" }} textAlign={"center"}>
                  {props.editingValue}
                </Text>
              )}
            </View>
            {/* - */}
            <View
              style={{
                width: "100%",
                height: "30%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!props.selected &&
              !props.editingMode &&
              !props.cameraMode ? null : (
                <TouchableOpacity onPress={props.onDecrease}>
                  <AntDesign
                    name="minus"
                    size={24}
                    color={Colors.soft_primary_dark}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  trashCard: {
    flexDirection: "row",
    borderRadius: 10,
  },
  descriptionRow: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
  },
  trashName: {
    fontSize: 16,
  },
  trashDisposal: {
    fontSize: 12,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
