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
import { Dropdown } from "react-native-material-dropdown";

import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import * as authAction from "../store/actions/authAction";
import Colors from "../constants/Colors";

export default AddingTrashForSellerScreen = props => {
  //     const getUid = () => {
  //     let user = await firebaseUtil.auth().currentUser; // get uid
  //   }
  let 

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffffff", "#fafafa"]} style={styles.gradient}>
        <Dropdown />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AddingTrashForSellerScreen.navigationOptions = {
  headerTitle: "AddingTrashForSellerScreen"
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
