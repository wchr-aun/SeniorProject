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
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ThaiTitleText from "./ThaiTitleText";
import ThaiText from "./ThaiText";
import Colors from "../constants/Colors";
import ImageCircle from "./UI/ImageCircle";

const AmountOfTrash = props => {
  return (
    <View
      style={{
        ...props.style,
        alignItems: "center",
        flexDirection: "row"
      }}
    >
      <View
        style={{
          width: "100%"
        }}
      >
        <ThaiText
          style={{
            textAlign: "center",
            fontSize: 8,
            color:
              isNaN(props.changeAmount) || props.changeAmount === 0
                ? "black"
                : props.changeAmount > 0
                ? "green"
                : Colors.error
          }}
        >
          {`เปลี่ยนแปลง ${
            props.changeAmount ? props.changeAmount.toString() : 0
          }`}
        </ThaiText>
      </View>
    </View>
  );
};

const AdjustAmountOfTrash = props => {
  return (
    <View style={{ ...props.style, flexDirection: "row" }}>
      <View style={{ marginHorizontal: 5, width: "30%" }}>
        {!props.selected && !props.editingMode ? null : (
          <TouchableWithoutFeedback onPress={props.onDecrease}>
            <Entypo name="circle-with-minus" size={24} color={Colors.primary} />
          </TouchableWithoutFeedback>
        )}
      </View>
      <View style={{ width: "30%", alignSelf: "center" }}>
        <TextInput
          selectTextOnFocus={true}
          keyboardType="numeric"
          onChangeText={props.onEdit}
          value={props.editingValue}
          textAlign={"center"}
        />
      </View>
      <View style={{ width: "30%" }}>
        {!props.selected && !props.editingMode ? null : (
          <TouchableWithoutFeedback onPress={props.onIncrease}>
            <Entypo name="circle-with-plus" size={24} color={Colors.primary} />
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

export default TrashCard = props => {
  return (
    <View
      style={{
        ...styles.trashCard,
        ...props.style,
        width: wp("95%"),
        height: hp("20%"),
        alignSelf: "center",
        backgroundColor: Colors.on_primary,
        borderRadius: 10,
        marginVertical: 5
      }}
    >
      <View
        style={{
          width: "30%",
          height: "100%",
          backgroundColor: Colors.on_primary,
          padding: wp("2.5%"),
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        <ImageCircle
          avariableWidth={wp("20%")}
          imgUrl={props.imgUrl}
          style={{ borderWidth: 1, borderColor: "black" }}
        />
      </View>

      <View
        style={{
          ...styles.descriptionContainer,
          width: "70%",
          height: "100%",
          padding: wp("2.5%")
        }}
      >
        {/* Trash Name */}
        <View
          style={{
            width: "100%",
            height: "20%",
            flexDirection: "row"
          }}
        >
          <View style={{ width: "80%", height: "100%" }}>
            <ThaiTitleText style={styles.trashName}>
              {props.subtype}
            </ThaiTitleText>
          </View>
        </View>

        {/* detail */}
        <View
          style={{
            width: "100%",
            height: "80%",
            flexDirection: "row"
          }}
        >
          <View style={{ width: "50%", height: "100%" }}>
            <View
              style={{ ...styles.descriptionRow, width: "100%", height: "50%" }}
            >
              <Ionicons
                name="md-trash"
                size={20}
                color={Colors.primary_variant}
              />
              <ThaiText style={styles.trashDisposal}>
                {props.wasteDisposal}
              </ThaiText>
            </View>
            <View
              style={{ ...styles.descriptionRow, width: "100%", height: "50%" }}
            >
              <ThaiText style={styles.trashAdjustPrice}>
                {props.trashAdjustPrice} บ./กก.
              </ThaiText>
            </View>
          </View>

          <View style={{ width: "50%", height: "100%" }}>
            <AmountOfTrash
              style={{ width: "100%", height: "50%" }}
              changeAmount={props.changeAmount}
              oldAmount={props.oldAmount}
            />
            <AdjustAmountOfTrash
              style={{
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "space-around",
                width: "100%",
                height: "50%"
              }}
              subtype={props.subtype}
              majortype={props.majortype}
              onIncrease={props.onIncrease}
              onDecrease={props.onDecrease}
              onEdit={props.onEdit}
              UI_diff={props.UI_diff}
              selected={props.selected}
              editingMode={props.editingMode}
              editingValue={props.editingValue}
              changeAmount={props.changeAmount}
              oldAmount={props.oldAmount}
            />
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
  trashAdjustPrice: {
    fontSize: 12
  },
  trashDisposal: {
    fontSize: 12
  }
});
