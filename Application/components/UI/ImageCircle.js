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
import ThaiTitleText from "../ThaiTitleText";
import ThaiText from "../ThaiText";
import Colors from "../../constants/Colors";

const SELECT_ITEM = "SELECT_ITEM";
const ADD_WASTE = "ADD_WASTE";
const MINUS_WASTE = "MINUS_WASTE";
const EDIT_WASTE = "EDIT_WASTE";
const SET_WASTE = "SET_WASTE";

export default ImageCircle = props => {
  return (
    <View // image need to config exactly number
      style={{
        width: props.avariableWidth * 0.25, // width --> 0.8(all) - 0.25(this) = 0.55 (description container)
        height: props.avariableWidth * 0.25,
        borderRadius: (props.avariableWidth * 0.25) / 2, // divide 2 to make circle
        overflow: "hidden",
        alignSelf: "center",
        marginHorizontal: 10
      }}
    >
      <Image
        source={{
          uri: props.imgUrl
        }}
        style={{
          width: props.avariableWidth * 0.25,
          height: props.avariableWidth * 0.25
        }}
        resizeMode="contain"
      />
    </View>
  );
};
