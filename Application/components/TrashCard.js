import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput,
  Text
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Entypo, Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import ThaiMdText from "./ThaiMdText";
import ThaiRegText from "./ThaiRegText";
import Colors from "../constants/Colors";
import ImageCircle from "./UI/ImageCircle";
import ThaiBoldText from "./ThaiBoldText";

export default TrashCard = props => {
  return (
    <View
      style={{
        ...styles.trashCard,
        ...props.style,
        width: wp("96%"),
        height: hp("20%"),
        alignSelf: "center",
        marginVertical: 5,
        overflow: "hidden",
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        borderWidth: !props.cameraMode ? (props.editingMode ? 3 : null) : null,
        borderColor: !props.cameraMode
          ? props.editingMode
            ? Colors.primary_bright_variant
            : ""
          : ""
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
          justifyContent: "space-around"
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
          backgroundColor: Colors.secondary
        }}
      >
        <View
          style={{
            ...styles.sellerItemName,
            ...styles.descriptionRow,
            width: "100%",
            height: "30%"
          }}
        >
          <ThaiRegText style={{ fontSize: 12 }}>ประเภท: </ThaiRegText>
          <ThaiMdText
            style={{
              ...styles.trashName,
              color: Colors.primary_bright_variant,
              fontSize: 12
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
                height: "60%"
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
                        : Colors.error
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
                justifyContent: "space-around"
              }}
            >
              <View style={{ width: "20%" }}>
                <Ionicons
                  name="md-trash"
                  size={25}
                  color={Colors.hard_secondary}
                />
              </View>
              <View style={{ width: "80%" }}>
                <ThaiRegText style={styles.trashDisposal}>
                  {` ${props.wasteDisposal}`}
                </ThaiRegText>
              </View>
            </View>
            <View
              style={{
                ...styles._sellerItemPrice,
                ...styles.descriptionRow,
                width: "100%",
                height: "30%"
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
          padding: 10
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-around",
            borderRadius: 8,
            backgroundColor: Colors.soft_secondary,
            borderColor:
              props.cameraMode || props.editingMode
                ? Colors.hard_secondary
                : "",
            borderWidth: props.cameraMode || props.editingMode ? 3 : null
          }}
        >
          {/* + */}
          <View
            style={{
              width: "100%",
              height: "30%",
              alignItems: "center",
              justifyContent: "center",
              borderBottomColor:
                props.cameraMode || props.editingMode
                  ? Colors.hard_secondary
                  : "",
              borderBottomWidth:
                props.cameraMode || props.editingMode ? 0.5 : null
            }}
          >
            {!props.selected &&
            !props.editingMode &&
            !props.cameraMode ? null : (
              <TouchableWithoutFeedback onPress={props.onIncrease}>
                <AntDesign
                  name="plus"
                  size={24}
                  color={Colors.hard_secondary}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
          {/* number */}
          <View
            style={{
              width: "100%",
              height: "30%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TextInput
              style={{ textAlign: "center" }}
              selectTextOnFocus={true}
              keyboardType="numeric"
              onChangeText={props.onEdit}
              value={props.editingValue}
              textAlign={"center"}
            />
          </View>
          {/* - */}
          <View
            style={{
              width: "100%",
              height: "30%",
              alignItems: "center",
              justifyContent: "center",
              borderTopColor:
                props.cameraMode || props.editingMode
                  ? Colors.hard_secondary
                  : "",
              borderTopWidth: props.cameraMode || props.editingMode ? 0.5 : null
            }}
          >
            {!props.selected &&
            !props.editingMode &&
            !props.cameraMode ? null : (
              <TouchableWithoutFeedback onPress={props.onDecrease}>
                <AntDesign
                  name="minus"
                  size={24}
                  color={Colors.hard_secondary}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trashCard: {
    flexDirection: "row",
    borderRadius: 10
  },
  descriptionRow: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center"
  },
  trashName: {
    fontSize: 16
  },
  trashDisposal: {
    fontSize: 12
  }
});
