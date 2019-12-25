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

import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ThaiTitleText from "./ThaiTitleText";
import ThaiText from "./ThaiText";
import Colors from "../constants/Colors";
import { useDispatch } from "react-redux";

const SELECT_ITEM = "SELECT_ITEM";
const ADD_TRASH = "ADD_TRASH";
const MINUS_TRASH = "MINUS_TRASH";
const EDIT_TRASH = "EDIT_TRASH";
const SET_TRASH = "SET_TRASH";

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
        onPress={() => {
          console.log("minus");
          props.dispatchAmountTrashsState({
            type: MINUS_TRASH,
            wasteType: props.wasteType
          });
        }}
      >
        <Entypo name="circle-with-minus" size={24} color={Colors.primary} />
      </TouchableWithoutFeedback>
      <View style={{ width: 30 }}>
        <TextInput
          keyboardType="numeric"
          onChangeText={text => {
            props.dispatchAmountTrashsState({
              type: EDIT_TRASH,
              wasteType: props.wasteType,
              value: parseInt(text, 10)
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
            type: ADD_TRASH,
            wasteType: props.wasteType
          });
        }}
      >
        <Entypo name="circle-with-plus" size={24} color={Colors.primary} />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TrashCard = props => {
  // Resolve change vertical and horizontal affect to width
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );
  useEffect(() => {
    const updateScreen = () => {
      setAvailableDeviceWidth(Dimensions.get("window").width);
      setAvailableDeviceHeight(Dimensions.get("window").height);
    };
    Dimensions.addEventListener("change", updateScreen);
    return () => {
      Dimensions.removeEventListener("change", updateScreen);
    };
  });

  // Selected Trasition
  const [isSelected, setIsSelected] = useState(false);

  return (
    <View
      style={{
        ...styles.trashCard,
        ...props.style,
        width: availableDeviceWidth * 0.9,
        height: availableDeviceHeight * 0.28,
        alignSelf: "center"
      }}
    >
      <View // image need to config exactly number
        style={{
          ...styles.imgContainer,
          width: availableDeviceWidth * 0.25, // width --> 0.8(all) - 0.25(this) = 0.55 (description container)
          height: availableDeviceWidth * 0.25,
          borderRadius: (availableDeviceWidth * 0.25) / 2, // divide 2 to make circle
          overflow: "hidden",
          alignSelf: "center",
          borderWidth: 1,
          borderColor: "red",
          marginHorizontal: 10
        }}
      >
        <Image
          source={{
            uri: props.imgUrl
          }}
          style={{
            ...styles.trashImg,
            width: availableDeviceWidth * 0.25,
            height: availableDeviceWidth * 0.25
          }}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          ...styles.descriptionContainer,
          flex: 1,
          padding: 10,
          borderWidth: 1,
          borderColor: "yellow"
        }}
      >
        <View
          style={{
            ...styles.descriptionRow,
            flexWrap: "wrap",
            backgroundColor: "skyblue"
          }}
        >
          {/* Trash Name */}
          <View style={{ width: "70%", height: "100%" }}>
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
                alignSelf: "flex-end",
                backgroundColor: "green"
              }}
              onPress={() => {
                console.log("setIsSelected clicked");
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
  imgContainer: {
    backgroundColor: "blue"
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
