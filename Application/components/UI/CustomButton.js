import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback
} from "react-native";

import ThaiMdText from "./../ThaiMdText";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Colors from "../../constants/Colors";

export default CustomButton = props => {
  let TouchableComp = props.disable
    ? TouchableWithoutFeedback
    : TouchableOpacity;
  return (
    <TouchableComp
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
        <ThaiMdText
          style={{
            color: props.btnTitleColor,
            fontSize: props.btnTitleFontSize,
            padding: wp("1.75%"),
            alignSelf: "center",
            alignContent: "center"
          }}
        >
          {props.children}
        </ThaiMdText>
      </View>
    </TouchableComp>
  );
};

{
  /* <CustomButton btnColor={} onPress={} btnTitleColor={} btnTitleFontSize={} disable={}>
                  
</CustomButton> */
}
