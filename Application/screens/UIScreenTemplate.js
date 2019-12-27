import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { sha256 } from "js-sha256";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Colors from "../constants/Colors";
import firebaseUtil from "../firebase";
import ThaiText from "../components/ThaiText";
import CustomButton from "../components/UI/CustomButton";
import ThaiTitleText from "../components/ThaiTitleText";

export default UserAuthenScreen = props => {
  useEffect(() => {
    console.log("Template");
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={{
        ...styles.screen,
        flex: 1
      }}
    >
      <View
        style={{
          paddingTop: getStatusBarHeight(),
          width: wp("100%"),
          height: hp("100%") + getStatusBarHeight(),
          backgroundColor: Colors.secondary,
          borderRadius: 10
        }}
      >
        <View style={{ alignSelf: "center", justifyContent: "center" }}>
          <Text>Content Here</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

UserAuthenScreen.navigationOptions = {
  headerTitle: "UserAuthenScreen"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});
