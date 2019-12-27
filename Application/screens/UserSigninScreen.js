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
  heightPercentageToDP as hp,
  listenOrientationChange,
  removeOrientationListener
} from "react-native-responsive-screen";
import { Entypo } from "@expo/vector-icons";

import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Colors from "../constants/Colors";
import firebaseUtil from "../firebase";
import ThaiText from "../components/ThaiText";
import CustomButton from "../components/UI/CustomButton";

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

export default UserAuthenScreen = props => {
  useEffect(() => {
    console.log("login");
  }, []);
  // Use for Showing an text when user signup before signin
  const signupBeforeSignin = props.navigation.getParam("signupBeforeSignin");

  // For responsive orientation listen
  useEffect(() => {
    listenOrientationChange();
    return () => {
      removeOrientationListener();
    };
  });

  // isClick = false;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // For alerting user an signin-signup action
  useEffect(() => {
    if (error) Alert.alert("An Error has occurred!", error, [{ text: "OK" }]);
  }, [error]);

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

  const authHandler = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    let email = formState.inputValues.email;
    let password = formState.inputValues.password
      ? sha256(formState.inputValues.password)
      : sha256("sha256");

    // do async task
    firebaseUtil
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(false);
        props.navigation.navigate("StartupScreen");
      })
      .catch(err => {
        setIsLoading(false);
        setError(err.message);
      });
  }, [formState]);

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
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={{
        ...styles.screen,
        flex: 1
      }}
    >
      <LinearGradient colors={Colors.linearGradient} style={styles.gradient}>
        <View style={{ marginVertical: wp("5%") }}>
          <ThaiText style={{ color: Colors.on_primary }}>
            ลงชื่อเข้าใช้
          </ThaiText>
        </View>
        <Card
          style={{
            ...styles.authContainer,
            width: wp("90%"),
            height: hp("50%"),
            paddingHorizontal: wp("5%"),
            paddingVertical: wp("8%")
          }}
          titleVar="title"
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            {signupBeforeSignin ? (
              <View>
                <Text style={{ color: "green" }}>
                  Great! Your account is already created.
                </Text>
              </View>
            ) : null}

            <Input
              id="email"
              label="อีเมล"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
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
            />
            <View
              style={{
                ...styles.buttonContainer,
                marginTop: wp("5%"),
                alignItems: "center"
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
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
                  btnColor={Colors.primary}
                  btnTitleColor={Colors.on_primary}
                  btnTitleFontSize={14}
                >
                  ลงชื่อเข้าใช้
                </CustomButton>
              )}

              <View>
                <ThaiText
                  style={{
                    color: Colors.primary,
                    fontSize: 14
                  }}
                >
                  หรือ
                </ThaiText>
              </View>

              <CustomButton
                style={{
                  width: wp("40%"),
                  height: hp("6%"),
                  borderRadius: 10,
                  margin: wp("1.25%")
                }}
                onPress={() => {
                  props.navigation.navigate("UserSignupScreen");
                }}
                btnColor={Colors.lineSeparate}
                btnTitleColor={Colors.primary}
                btnTitleFontSize={14}
              >
                ลงทะเบียน{" "}
                <Entypo name="squared-plus" size={14} color={Colors.primary} />
              </CustomButton>
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
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
