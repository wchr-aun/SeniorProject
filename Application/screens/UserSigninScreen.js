import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { sha256 } from "js-sha256";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Animated, { Easing } from "react-native-reanimated";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Colors from "../constants/Colors";
import firebaseUtil from "../firebase";
import CustomButton from "../components/UI/CustomButton";
import ThaiRegText from "../components/ThaiRegText";
import ThaiMdText from "../components/ThaiMdText";
import { updateNotificationToken } from "../utils/firebaseFunctions";

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
      updatedAllFormIsValid = Boolean(
        updatedAllFormIsValid && updatedValidities[key]
      );
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

export default UserAuthenScreen = props => {
  useEffect(() => {
    console.log("login");
  }, []);
  // Use for Showing an text when user signup before signin
  const signupBeforeSignin = props.navigation.getParam("signupBeforeSignin");

  // 'formState (state snapshot) will be updated when state changed
  const [formState, dispatchFormState] = useReducer(formReducer, {
    // these are initial-state
    inputValues: {
      email: "",
      password: ""
    },
    inputValidities: {
      email: false,
      password: false
    },
    allFormIsValid: false
  });

  // isClick = false;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // For alerting user an signin-signup action
  useEffect(() => {
    if (error) {
      Alert.alert("An error has occurred!", error, [{ text: "OK" }]);
      setError("");
    }
  }, [error]);

  const authHandler = async () => {
    setIsLoading(true);
    let email = formState.inputValues.email;
    let password = formState.inputValues.password
      ? sha256(formState.inputValues.password)
      : sha256("sha256");

    // do async task
    await firebaseUtil
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        updateNotificationToken();
      })
      .catch(err => {
        setIsLoading(false);
        setError(err.message);
      });
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        inputIdentifier: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  return (
    <View
      enabled
      style={{
        ...styles.screen,
        flex: 1
      }}
    >
      <LinearGradient colors={Colors.linearGradient} style={styles.gradient}>
        <View style={{ marginVertical: wp("5%") }}>
          <ThaiMdText
            style={{
              color: Colors.on_primary_bright.high_constrast,
              fontSize: 24
            }}
          >
            ลงชื่อเข้าใช้
          </ThaiMdText>
        </View>
        <Card
          style={{
            ...styles.authContainer,
            width: wp("90%"),
            height: hp("70%"),
            paddingHorizontal: wp("5%"),
            paddingVertical: wp("8%")
          }}
        >
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "android" ? -200 : 0}
            style={{ flex: 1 }}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              {signupBeforeSignin ? (
                <View>
                  <Text style={{ color: "green" }}>
                    Great! Your account has been created.
                  </Text>
                </View>
              ) : null}

              <Input
                editable={true}
                id="email"
                label="อีเมล"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Please enter a valid email address."
                onInputChange={inputChangeHandler}
                initialValue=""
                iconName="email"
              />
              <Input
                editable={true}
                id="password"
                label="รหัสผ่าน"
                keyboardType="default"
                secureTextEntry
                required
                minLength={5}
                autoCapitalize="none"
                errorText="Please enter a valid password."
                onInputChange={inputChangeHandler}
                initialValue=""
                iconName="key-variant"
              />
              <View
                style={{
                  ...styles.buttonContainer,
                  marginTop: hp("8%"),
                  alignItems: "center"
                }}
              >
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.on_primary_bright.high_constrast}
                  />
                ) : (
                  <CustomButton
                    style={{
                      width: wp("40%"),
                      height: hp("6%"),
                      borderRadius: 10,
                      margin: wp("1.25%")
                    }}
                    onPress={() => {
                      authHandler();
                    }}
                    btnColor={Colors.button.submit_primary_bright.btnBackground}
                    btnTitleColor={Colors.button.submit_primary_bright.btnText}
                    btnTitleFontSize={14}
                  >
                    ลงชื่อเข้าใช้
                  </CustomButton>
                )}

                <View
                  style={{ marginTop: hp("1.75%"), marginTop: hp("1.25%") }}
                >
                  <ThaiRegText
                    style={{
                      color: Colors.primary,
                      fontSize: 10
                    }}
                  >
                    หรือ "ลงทะเบียน" หากว่ายังไม่มีบัญชีในระบบ
                  </ThaiRegText>
                </View>

                <CustomButton
                  style={{
                    width: wp("40%"),
                    height: hp("6%"),
                    borderRadius: 10,
                    margin: wp("1.25%"),
                    borderWidth: 1,
                    borderColor: Colors.button.submit_primary_dark.btnText
                  }}
                  onPress={() => {
                    props.navigation.navigate("UserSignupScreen");
                  }}
                  btnColor={Colors.button.submit_primary_dark.btnBackground}
                  btnTitleColor={Colors.button.submit_primary_dark.btnText}
                  btnTitleFontSize={14}
                >
                  ลงทะเบียน{" "}
                  <MaterialCommunityIcons
                    name="account-plus"
                    size={14}
                    color={Colors.button.submit_primary_dark.btnText}
                  />
                </CustomButton>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Card>
      </LinearGradient>
    </View>
  );
};

UserAuthenScreen.navigationOptions = {
  headerTitle: "UserAuthenScreen"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
