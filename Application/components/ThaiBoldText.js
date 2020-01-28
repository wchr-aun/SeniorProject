import React from "react";
import { StyleSheet, Text } from "react-native";

export default ThaiBoldText = props => {
  return (
    <Text style={{ ...styles.customStyle, ...props.style }}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  customStyle: {
    fontSize: 10,
    fontFamily: "BOLD_K2D"
  }
});
