import React from "react";
import { StyleSheet, Text } from "react-native";

export default ThaiSemiBoldText = props => {
  return (
    <Text style={{ ...styles.customStyle, ...props.style }}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  customStyle: {
    fontSize: 10,
    fontFamily: "SEMI_BOLD_NOTO"
  }
});
