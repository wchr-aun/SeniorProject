import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

import ThaiButtonText from "./../ThaiButtonText";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default CustomButton = props => {
  return (
    <TouchableOpacity
      style={{
        ...props.style,
        backgroundColor: props.btnColor,
        justifyContent: "center"
      }}
      onPress={props.onPress}
    >
      <View
        style={{
          alignSelf: "center",
          justifyContent: "center",
          alignContent: "center"
        }}
      >
        <ThaiButtonText
          style={{
            color: props.btnTitleColor,
            fontSize: props.btnTitleFontSize,
            padding: wp("1.75%"),
            alignSelf: "center"
          }}
        >
          {props.children}
        </ThaiButtonText>
      </View>
    </TouchableOpacity>
  );
};
