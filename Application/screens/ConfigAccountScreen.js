import React, { useReducer, useCallback, useState, useEffect } from "react";
import { View, KeyboardAvoidingView, StyleSheet, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import * as authAction from "../store/actions/authAction";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import Card from "../components/UI/Card";
import Colors from "../constants/Colors";
import ThaiBoldText from "../components/ThaiBoldText";

export default ConfigAccountScreen = props => {
  const dispatch = useDispatch();

  const configHandler = async role => {
    dispatch(authAction.changeRole(role));
  };

  const userRole = useSelector(state => state.user.userRole);
  useEffect(() => {
    if (userRole) {
      if (userRole == "seller") props.navigation.navigate("SellerNavigator");
      else if (userRole == "buyer") props.navigation.navigate("BuyerNavigator");
    }
  }, [userRole]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={Colors.linearGradientB} style={styles.gradient}>
        <Card style={styles.authContainer} titleVar="title">
          <View style={{ width: "100%", height: "50%", alignItems: "center" }}>
            <ThaiBoldText style={{ fontSize: 18, color: Colors.primary_dark }}>
              คุณเป็นผู้ใช้ประเภทใด
            </ThaiBoldText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
              height: "50%"
            }}
          >
            <View
              style={{ width: "50%", height: "100%", alignItems: "center" }}
            >
              <MaterialCommunityIcons
                name="account"
                color={Colors.primary_bright_variant}
                size={36}
              />
              <Button
                title="ผู้ขาย"
                color={Colors.primary_bright_variant}
                onPress={() => configHandler("seller")}
              />
            </View>

            <View
              style={{ width: "50%", height: "100%", alignItems: "center" }}
            >
              <MaterialCommunityIcons
                name="car-pickup"
                color={Colors.primary_bright}
                size={36}
              />
              <Button
                title="ผู้รับซื้อ"
                color={Colors.primary_bright}
                onPress={() => configHandler("buyer")}
              />
            </View>
          </View>
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
    height: "50%",
    maxWidth: 300,
    maxHeight: 300,
    padding: 20,
    justifyContent: "center"
  },
  buttonContainer: {
    marginTop: 10
  }
});
