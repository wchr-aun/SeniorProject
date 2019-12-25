import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SwitchToggle from "@dooboo-ui/native-switch-toggle";

import Card from "../components/UI/Card";
import Colors from "../constants/Colors";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
// for updaing value of variable form
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.inputIdentifier]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.inputIdentifier]: action.isValid
    };
    let updatedAllFormIsValid = true;
    for (const key in updatedValidities) {
      updatedAllFormIsValid = updatedAllFormIsValid && updatedValidities[key];
    }
    return {
      ...state,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      allFormIsValid: updatedAllFormIsValid
    };
  }
  return state;
};

export default ConfigAccountScreen = props => {
  console.log("config");
  const [switchOn1, setSwitchOn1] = useState(false);
  const [switchOn2, setSwitchOn2] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffffff", "#fafafa"]} style={styles.gradient}>
        <Card style={styles.authContainer} titleVar="title">
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>Enable Search </Text>
              <SwitchToggle
                switchOn={switchOn1}
                onPress={() => setSwitchOn1(!switchOn1)}
                duration={150}
                backgroundColorOn="#5fdba7"
                backgroundColorOff="#808080"
                circleColorOff="#ffffff"
                circleColorOn="#ffffff"
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>Show Address </Text>
              <SwitchToggle
                switchOn={switchOn2}
                onPress={() => setSwitchOn2(!switchOn2)}
                uration={150}
                backgroundColorOn="#5fdba7"
                backgroundColorOff="#808080"
                circleColorOff="#ffffff"
                circleColorOn="#ffffff"
              />
            </View>
            <View style={{ flexDirection: "row", alignContent: "center" }}>
              <Button
                title="Seller"
                color={Colors.primary}
                onPress={() => {
                  props.navigation.navigate("SellerNavigator");
                }}
              />
              <Button title="Buyer" color={Colors.primary} />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  }
});
