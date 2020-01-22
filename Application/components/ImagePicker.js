import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

import Colors from "../constants/Colors";

const ImgPicker = props => {
  return (
    <View style={{ ...styles.imagePicker, ...props.style }}>
      <View style={styles.imagePreview}>
        {!props.pickedImage ? (
          <Text>No image picked yet.</Text>
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
