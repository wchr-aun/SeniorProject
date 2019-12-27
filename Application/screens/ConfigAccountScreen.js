import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text,
  AsyncStorage
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import firebaseFunctions from "../utils/firebaseFunctions"
import SwitchToggle from "@dooboo-ui/native-switch-toggle";

import Card from "../components/UI/Card";
import Colors from "../constants/Colors";

export default ConfigAccountScreen = props => {
  console.log('config')
  const [switchSearch, setSwitchSearch] = useState(false);
  const [switchAddr, setSwitchAddr] = useState(false);

  const configHandler = (role) => {
    firebaseFunctions.toggleSwitches(switchSearch, switchAddr).then(() => {
      AsyncStorage.setItem('CONFIG_ROLE', role).then(() => {
        props.navigation.navigate("StartupScreen")
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffffff", "#fafafa"]} style={styles.gradient}>
        <Card style={styles.authContainer} titleVar="title">
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-around"}}>
              <Text>Enable Search</Text>
              <SwitchToggle
                switchOn={switchSearch}
                onPress={() => setSwitchSearch(!switchSearch)}
                duration={150}
                backgroundColorOn="#5fdba7"
                backgroundColorOff="#808080"
                circleColorOff="#ffffff"
                circleColorOn="#ffffff"
              />
            </View>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-around"}}>
              <Text>Enable Address</Text>
              <SwitchToggle
                switchOn={switchAddr}
                onPress={() => setSwitchAddr(!switchAddr)}
                uration={150}
                backgroundColorOn="#5fdba7"
                backgroundColorOff="#808080"
                circleColorOff="#ffffff"
                circleColorOn="#ffffff"
              />
            </View>
            <View style={{flexDirection:"row", alignContent:"center", justifyContent:"space-around"}}>
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
