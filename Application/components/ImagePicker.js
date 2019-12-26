import React, { useState } from "react";
import { View, Button, Image, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";

import Colors from "../constants/Colors";

const ImgPicker = props => {
  const [pickedImage, setPickedImage] = useState();

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant camera permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      // allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      base64: true
    });

    // console.log("image");
    // console.log(image);
    // console.log(image.width + " " + image.height);

    let resized =
      image.height > image.width
        ? { resize: { width: 600 } }
        : { resize: { height: 600 } };
    // console.log("resized");
    // console.log(resized);
    const resizedImage = await ImageManipulator.manipulateAsync(
      image.uri,
      [resized],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    // console.log("resizedImage");
    // console.log(resizedImage.width + " " + resizedImage.height);
    // console.log(resizedImage);
    setPickedImage(resizedImage);
    props.onImageTaken(resizedImage);
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage.uri }} />
        )}
      </View>
      <Button
        title="Take Image"
        color={Colors.primary}
        onPress={takeImageHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center"
  },
  imagePreview: {
    width: "100%",
    height: 200,
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
