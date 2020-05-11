import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

import Colors from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import ThaiBoldText from "./ThaiBoldText";
const ImgPicker = (props) => {
  return (
    <TouchableOpacity onPress={props.onClick} style={{ ...props.style }}>
      <View style={{ ...styles.imagePicker }}>
        <View style={styles.imagePreview}>
          {!props.pickedImage ? (
            <View
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <View style={{ marginVertical: 3 }}>
                <FontAwesome
                  name={"camera"}
                  size={60}
                  color={Colors.primary_dark}
                />
              </View>
              <View style={{ marginVertical: 3, width: "60%" }}>
                <ThaiBoldText style={{ fontSize: 18, textAlign: "center" }}>
                  กดตรงนี้เพื่อถ่ายรูป
                </ThaiBoldText>
              </View>
            </View>
          ) : (
            <Image
              style={styles.image}
              source={{ uri: props.pickedImage.uri }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImgPicker;
