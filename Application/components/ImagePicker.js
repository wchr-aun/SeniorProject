import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

import Colors from "../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ThaiBoldText from "./ThaiBoldText";
const ImgPicker = props => {
  return (
    <View style={{ ...styles.imagePicker, ...props.style }}>
      <View style={styles.imagePreview}>
        {!props.pickedImage ? (
          <View
            style={{
              width: "100%",
              height: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <MaterialCommunityIcons
              name={"camera-off"}
              size={40}
              color={Colors.primary_dark}
            />
            <ThaiBoldText style={{ fontSize: 20 }}>
              ยังไม่มีการถ่ายรูป
            </ThaiBoldText>
          </View>
        ) : (
          <Image style={styles.image} source={{ uri: props.pickedImage.uri }} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center"
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1
  },
  image: {
    width: "100%",
    height: "100%"
  }
});

export default ImgPicker;
