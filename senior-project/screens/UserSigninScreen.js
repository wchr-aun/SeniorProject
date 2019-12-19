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
import { sha256 } from "js-sha256";

import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import * as authAction from "../store/actions/authAction";
import Colors from "../constants/Colors";
import firebaseUtil from "../firebase";

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
  // Check signupBeforeSignin ?
  const signupBeforeSignin = props.navigation.getParam("signupBeforeSignin");

  // isClick = false;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // For alerting user an signin-signup action
  useEffect(() => {
    console.log("From UserSignin: useEffect" + error);
    if (error) {
      Alert.alert("An Error on firebase occurred!", error, [{ text: "Okay" }]);
    }
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

  const authHandler = async () => {
    setError(null);
    setIsLoading(true);
    // do async task
    firebaseUtil
      .auth()
      .signInWithEmailAndPassword(
        formState.inputValues.email,
        sha256(formState.inputValues.password)
      )
      .then(result => {
        console.log("From userSigninScreen: " + result.user.uid);
        setIsLoading(false);
        props.navigation.navigate("SellerNavigation");
      })
      .catch(err => {
        // throw new Error(err.message);
        setIsLoading(false);
        console.log("From  UserSignin: firebaseUtil catch" + err.message);
        setError(err.message);
      });
    console.log("From UserSignin: firebaseUtil before finish function" + error);
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        inputIdentifier: inputIdentifier
      });
    }
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffffff", "#fafafa"]} style={styles.gradient}>
        <Card style={styles.authContainer} titleVar="title">
          <ScrollView>
            {signupBeforeSignin ? (
              <View>
                <Text style={{ color: "green" }}>
                  Great! Your account is already created.
                </Text>
              </View>
            ) : null}

            <Input
              id="email"
              label="Email"
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
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title="ลงชื่อเข้าใช้"
                  color={Colors.primary}
                  onPress={() => {
                    authHandler();
                  }}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="ลงทะเบียน"
                color={Colors.accent}
                onPress={() => {
                  props.navigation.navigate("UserSignupScreen");
                }}
              />
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
