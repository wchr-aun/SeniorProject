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

const SELECT_ITEM = "SELECT_ITEM";
const ADD_WASTE = "ADD_WASTE";
const MINUS_WASTE = "MINUS_WASTE";
const EDIT_WASTE = "EDIT_WASTE";
const SET_WASTE = "SET_WASTE";

const AmountOfTrash = props => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignSelf: "flex-end",
        alignItems: "center"
      }}
    >
      <View style={{ marginRight: 5 }}>
        <ThaiText style={{ ...styles.amountOfTrash, marginRight: 5 }}>
          จำนวน
        </ThaiText>
      </View>
      <View style={{ width: 30 }}>
        <Text style={{ textAlign: "center" }}>
          {props.amountOfTrash.toString()}
        </Text>
      </View>
    </View>
  );
};

const AdjustAmountOfTrash = props => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignSelf: "flex-end",
        alignItems: "center"
      }}
    >
      <View style={{ marginRight: 5 }}>
        <ThaiText style={{ ...styles.amountOfTrash, marginRight: 5 }}>
          จำนวน
        </ThaiText>
      </View>
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
          value={props.amountOfTrash.toString()}
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
        width: wp("90%"),
        height: hp("28%"),
        alignSelf: "center"
      }}
    >
      <ImageCircle avariableWidth={wp("20%")} imgUrl={props.imgUrl} />

      <View
        style={{
          ...styles.descriptionContainer,
          flex: 1,
          padding: 10
        }}
      >
        <View
          style={{
            ...styles.descriptionRow,
            flexWrap: "wrap"
          }}
        >
          {/* Trash Name */}
          <View style={{ width: "70%", height: "100%" }}>
            <ThaiTitleText style={styles.trashName}>
              {props.wasteType}
            </ThaiTitleText>
          </View>
          {/* Check - UnCheck */}
          {props.editingMode ? (
            <View
              style={{
                width: "30%",
                height: "100%",
                alignSelf: "flex-end"
              }}
            >
              <Text
                style={{
                  color: isNaN(props.UI_diff)
                    ? null
                    : props.UI_diff > 0
                    ? "green"
                    : "red"
                }}
              >
                {props.UI_diff ? props.UI_diff : null}
              </Text>
            </View>
          ) : !props.sellingMode ? null : (
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
        </View>
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
        {!props.editingMode && !isSelected ? (
          <View
            style={{
              ...styles.descriptionRow,
              flexDirection: "row",
              justifyContent: "center",
              padding: 5
            }}
          >
            <AmountOfTrash amountOfTrash={props.amountOfTrash} />
          </View>
        ) : (
          <View
            style={{
              ...styles.descriptionRow,
              flexDirection: "row",
              justifyContent: "center",
              padding: 5
            }}
          >
            <AdjustAmountOfTrash
              wasteType={props.wasteType}
              amountOfTrash={props.amountOfTrash}
              dispatchAmountTrashsState={props.dispatchAmountTrashsState}
              UI_disabledMinus={props.UI_disabledMinus}
            />
          </View>
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
  descriptionContainer: {},
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
  amountOfTrash: {
    fontSize: 14
  },
  trashDisposal: {
    fontSize: 12
  },
  plusAndMinusCircle: {
    marginHorizontal: 5
  }
});
