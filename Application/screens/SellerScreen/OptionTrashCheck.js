import React, { useState } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import ImagePicker from "../../components/ImagePicker";
import * as imgActions from "../../store/actions/places-actions";
import { useDispatch } from "react-redux";

export default OptionTrashCheck = props => {
  const [img, setImg] = useState();

  const dispatch = useDispatch();
  imageTakenHandler = () => {
    dispatch(imgActions.getPrediction(img));
  };

  return (
    <View>
      <Text>OptionTrashCheck</Text>
      <ImagePicker
        onImageTaken={img => {
          setImg(img);
          imageTakenHandler();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
