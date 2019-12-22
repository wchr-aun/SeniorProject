import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput
} from "react-native";

import { Entypo, Ionicons } from "@expo/vector-icons";
import ThaiTitleText from "./ThaiTitleText";
import ThaiText from "./ThaiText";
import Colors from "../constants/Colors";

const AdjustAmountOfTrash = props => {
  return (
    <View style={styles.adjustAmountView}>
      <ThaiText style={{ ...styles.amountOfTrash }}>จำนวน</ThaiText>
      <TouchableWithoutFeedback style={styles.plusAndMinusCircel}>
        <Entypo name="circle-with-minus" size={24} color={Colors.primary} />
      </TouchableWithoutFeedback>
      <TextInput keyboardType="numeric" value={props.amountOfTrash}></TextInput>
      <TouchableWithoutFeedback>
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

  const [amountOfTrash, setAmountOfTrash] = useState(
    props.amountOfTrash.toString()
  );

  return (
    <View
      style={{
        ...styles.trashCard,
        ...props.style,
        width: availableDeviceWidth * 0.8,
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
          alignSelf: "center"
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
          width: availableDeviceWidth * 0.55, // width --> 0.8(all) - 0.55(this) = 0.55 (img container)
          height: "100%",
          padding: 10
        }}
      >
        <View style={{ ...styles.descriptionRow, flexWrap: "wrap" }}>
          <ThaiTitleText style={styles.trashName}>
            {props.trashName}
          </ThaiTitleText>
        </View>
        <View style={styles.descriptionRow}>
          <Ionicons name="md-trash" size={20} color={Colors.primary_variant} />
          <ThaiText style={styles.trashDisposal}>
            {props.trashDisposal ? props.trashDisposal : "ขยะรีไซเคิล"}
          </ThaiText>
        </View>
        <View style={styles.descriptionRow}>
          <ThaiText style={styles.trashAdjustPrice}>
            {props.trashAdjustPrice} บ./กก.
          </ThaiText>
        </View>
        {!props.editingMode ? null : (
          <View
            style={{
              ...styles.descriptionRow,
              flexDirection: "row",
              justifyContent: "center",
              padding: 5
            }}
          >
            {/* <View style={styles.adjustAmountView}>
              <ThaiText style={{ ...styles.amountOfTrash }}>จำนวน</ThaiText>
              <TouchableWithoutFeedback style={styles.plusAndMinusCircel}>
                <Entypo
                  name="circle-with-minus"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableWithoutFeedback>
              <TextInput
                keyboardType="numeric"
                value={amountOfTrash}
              ></TextInput>
              <TouchableWithoutFeedback>
                <Entypo
                  name="circle-with-plus"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableWithoutFeedback>
            </View> */}
            <AdjustAmountOfTrash amountOfTrash={amountOfTrash} />
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
    padding: 5
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
  adjustAmountView: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  plusAndMinusCircel: {
    marginHorizontal: 5
  }
});
