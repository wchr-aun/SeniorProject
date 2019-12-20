import React from "react";
import { StyleSheet, Text } from "react-native";

export default ThaiButtonText = props => {
  return (
    <Text style={{ ...styles.customStyle, ...props.style }}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  customStyle: {
    fontSize: 26,
    fontFamily: "MD_K2D"
  }
});
