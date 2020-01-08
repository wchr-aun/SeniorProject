import React, { useState } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import ImagePicker from "../../components/ImagePicker";
import { useDispatch } from "react-redux";
import * as imgActions from "../../store/actions/imageAction";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Header } from "react-navigation-stack";
import AppVariableSetting from "../../constants/AppVariableSetting";
import CustomStatusBar from "../../components/UI/CustomStatusBar";

export default OptionTrashCheck = props => {
  const [img, setImg] = useState();

  const dispatch = useDispatch();
  imageTakenHandler = () => {
    dispatch(imgActions.getPrediction(img));
  };

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height:
            hp("100%") - AppVariableSetting.bottomBarHeight - Header.HEIGHT
        }}
      >
        <Text>OptionTrashCheck</Text>
        <ImagePicker
          onImageTaken={img => {
            setImg(img);
            imageTakenHandler();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
