import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  AsyncStorage
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { toggleSearch, editBuyerInfo } from "../utils/firebaseFunctions";
import SwitchToggle from "@dooboo-ui/native-switch-toggle";
import { useDispatch, useSelector } from "react-redux";
import * as authAction from "../store/actions/authAction";

import Card from "../components/UI/Card";
import Colors from "../constants/Colors";

export default ConfigAccountScreen = props => {
  const [switchSearch, setSwitchSearch] = useState(false);
  const dispatch = useDispatch();
  const addr = useSelector(state => state.user.userProfile.addr)

  const configHandler = role => {
    toggleSearch(switchSearch)
      .then(async () => {
        dispatch(authAction.changeRole(role)).then(() => {
          if (role == "buyer")
            editBuyerInfo({addr: addr, enableSearch: true}).then(() => {
              props.navigation.navigate("StartupScreen");
            })
          else
            props.navigation.navigate("StartupScreen");
        })
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffffff", "#fafafa"]} style={styles.gradient}>
        <Card style={styles.authContainer} titleVar="title">
          <ScrollView keyboardShouldPersistTaps="handled">
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "space-around"
              }}
            >
              <Button
                title="Seller"
                color={Colors.primary}
                onPress={() => configHandler("seller")}
              />
              <Button
                title="Buyer"
                color={Colors.primary}
                onPress={() => configHandler("buyer")}
              />
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
