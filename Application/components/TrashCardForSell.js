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
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ThaiTitleText from "./ThaiTitleText";
import ThaiText from "./ThaiText";
import Colors from "../constants/Colors";
import ImageCircle from "./UI/ImageCircle";

const ADD_AMOUNT_FORSELL = "ADD_AMOUNT_FORSELL";
const MINUS_AMOUNT_FORSELL = "MINUS_AMOUNT_FORSELL";
const EDIT_AMOUNT_FORSELL = "EDIT_AMOUNT_FORSELL";
const SELECT_ITEM = "SELECT_ITEM";

const AmountOfTrash = props => {
  return (
    <View
      style={{
        ...props.style,
        alignItems: "center"
      }}
    >
      <View>
        <ThaiText style={{ fontSize: 8 }}>เหลือ</ThaiText>
      </View>
      <View
        style={{
          width: wp("20%")
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: wp("7%"),
            color: "green"
          }}
        >
          {(props.amount - props.amountForSell).toString()}
        </Text>
      </View>
    </View>
  );
};

const AdjustAmountOfTrash = props => {
  console.log(props);
  return (
    <View style={{ ...props.style, flexDirection: "row" }}>
      <TouchableWithoutFeedback
        style={styles.plusAndMinusCircle}
        onPress={
          !props.UI_MinusDisabled
            ? () => {
                props.dispatchAmountTrashsState({
                  type: MINUS_AMOUNT_FORSELL,
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
              type: EDIT_AMOUNT_FORSELL,
              wasteType: props.wasteType,
              value: text > 0 ? parseInt(text, 10) : 0 //not positive, Nan
            });
          }}
          value={(props.amountForSell ? props.amountForSell : 0).toString()}
          style={{ textAlign: "center" }}
        ></TextInput>
      </View>
      <TouchableWithoutFeedback
        style={styles.plusAndMinusCircle}
        onPress={() =>
          !props.UI_PlusDisabled
            ? props.dispatchAmountTrashsState({
                type: ADD_AMOUNT_FORSELL,
                wasteType: props.wasteType,
                amount: 1
              })
            : null
        }
      >
        <Entypo name="circle-with-plus" size={24} color={Colors.primary} />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TrashCardForSell = props => {
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
        <AmountOfTrash
          amount={props.amount}
          amountForSell={props.amountForSell}
        />
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
        <TouchableWithoutFeedback
          style={{
            width: "30%",
            height: "100%",
            alignSelf: "flex-end"
          }}
          onPress={() => {
            setIsSelected(previousState => !previousState);
            // put the amouth of this trash into state
            props.dispatchAmountTrashsState({
              type: SELECT_ITEM,
              preIsSelected: isSelected, //bacause it not immediatly change after setIsSelected
              wasteType: props.wasteType
            });
          }}
        >
          <MaterialIcons
            name={isSelected ? "check-box" : "check-box-outline-blank"}
            size={20}
            color={Colors.primary}
          />
        </TouchableWithoutFeedback>
        {/* <View style={styles.descriptionRow}>
          <Ionicons name="md-trash" size={20} color={Colors.primary_variant} />
          <ThaiText style={styles.trashDisposal}>
            {props.wasteDisposal}
          </ThaiText>
        </View>
        <View style={styles.descriptionRow}>
          <ThaiText style={styles.trashAdjustPrice}>
            {props.trashAdjustPrice} บ./กก.
          </ThaiText>
        </View> */}
        {!isSelected ? null : (
          <AdjustAmountOfTrash
            wasteType={props.wasteType}
            amount={props.amount}
            amountForSell={props.amountForSell}
            dispatchAmountTrashsState={props.dispatchAmountTrashsState}
            UI_MinusDisabled={props.UI_MinusDisabled}
            UI_PlusDisabled={props.UI_PlusDisabled}
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
