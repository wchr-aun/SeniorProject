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

const ADD_WASTE = "ADD_WASTE";
const MINUS_WASTE = "MINUS_WASTE";
const EDIT_WASTE = "EDIT_WASTE";

const AmountOfTrash = props => {
  return (
    <View
      style={{
        ...props.style,
        alignItems: "center"
      }}
    >
      <View>
        <ThaiText style={{ fontSize: 8 }}>จำนวน</ThaiText>
      </View>
      <View style={{ width: wp("20%") }}>
        <Text style={{ textAlign: "center", fontSize: wp("7%") }}>
          {props.amountOfTrash.toString()}
        </Text>
      </View>
    </View>
  );
};

const AdjustAmountOfTrash = props => {
  return (
    <View style={{ ...props.style, flexDirection: "row" }}>
      <TouchableWithoutFeedback
        style={styles.plusAndMinusCircle}
        onPress={
          !props.UI_disabledMinus
            ? () => {
                props.dispatchAmountTrashsState({
                  type: MINUS_WASTE,
                  wasteType: props.wasteType,
                  amount: 1
                });
              }
            : null
        }
      >
        <Entypo name="circle-with-minus" size={24} color={Colors.primary} />
      </TouchableWithoutFeedback>
      <View style={{ width: 30 }}>
        <TextInput
          keyboardType="numeric"
          onChangeText={text => {
            props.dispatchAmountTrashsState({
              type: EDIT_WASTE,
              wasteType: props.wasteType,
              value: text > 0 ? parseInt(text, 10) : 0 //not positive, Nan
            });
          }}
          value={(props.UI_diff ? props.UI_diff : 0).toString()}
          style={{ textAlign: "center" }}
        ></TextInput>
      </View>
      <TouchableWithoutFeedback
        style={styles.plusAndMinusCircle}
        onPress={() => {
          props.dispatchAmountTrashsState({
            type: ADD_WASTE,
            wasteType: props.wasteType,
            amount: 1
          });
        }}
      >
        <Entypo name="circle-with-plus" size={24} color={Colors.primary} />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TrashCard = props => {
  // Selected Trasition
  const [isSelected, setIsSelected] = useState(false);

  return (
    <View
      style={{
        ...styles.trashCard,
        ...props.style,
        width: wp("95%"),
        height: hp("20%"),
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "red",
        marginVertical: wp("1.25%")
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
        <AmountOfTrash amountOfTrash={props.amountOfTrash} />
      </View>

      <View
        style={{
          ...styles.descriptionContainer,
          width: "70%",
          height: "100%",
          padding: wp("2.5%"),
          borderWidth: 1,
          borderColor: "yellow"
        }}
      >
        {/* Trash Name */}
        <View style={{ width: "80%", height: "20%", backgroundColor: "red" }}>
          <ThaiTitleText style={styles.trashName}>
            {props.wasteType}
          </ThaiTitleText>
        </View>
        {/* Check - UnCheck */}
        {!props.sellingMode ? null : (
          <TouchableWithoutFeedback
            style={{
              width: "30%",
              height: "100%",
              alignSelf: "flex-end"
            }}
            onPress={() => {
              setIsSelected(previousState => !previousState);
              // put the amouth of this trash into state
              props.dispatchAmountTrashsState(props.selectedHandler());
            }}
          >
            <MaterialIcons
              name={isSelected ? "check-box" : "check-box-outline-blank"}
              size={20}
              color={Colors.primary}
            />
          </TouchableWithoutFeedback>
        )}
        <View style={styles.descriptionRow}>
          <Ionicons name="md-trash" size={20} color={Colors.primary_variant} />
          <ThaiText style={styles.trashDisposal}>
            {props.wasteDisposal}
          </ThaiText>
        </View>
        <View style={styles.descriptionRow}>
          <ThaiText style={styles.trashAdjustPrice}>
            {props.trashAdjustPrice} บ./กก.
          </ThaiText>
        </View>
        {!props.editingMode && !isSelected ? null : (
          <AdjustAmountOfTrash
            wasteType={props.wasteType}
            amountOfTrash={props.amountOfTrash}
            dispatchAmountTrashsState={props.dispatchAmountTrashsState}
            UI_disabledMinus={props.UI_disabledMinus}
            UI_diff={props.UI_diff}
            style={{ alignSelf: "center", alignItems: "center" }}
          />
        )}
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
  },
  plusAndMinusCircle: {
    marginHorizontal: 5
  }
});
