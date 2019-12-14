import React from "react";
import { StyleSheet, Text } from "react-native";

export default ThaiTitleText = props => {
  return (
    <Text style={{ ...styles.customStyle, ...props.style }}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  customStyle: {
    fontSize: 26,
    fontFamily: "BOLD_K2D"
  }
});
