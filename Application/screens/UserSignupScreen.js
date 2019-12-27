import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  AsyncStorage
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { sha256 } from "js-sha256"

import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Colors from "../constants/Colors";
import firebaseFunctions from "../utils/firebaseFunctions";

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
    for (const key in updatedValidities)
      updatedAllFormIsValid = Boolean(
        updatedAllFormIsValid && updatedValidities[key]
      );

    return {
      ...state,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      allFormIsValid: updatedAllFormIsValid
    };
  }
  return state;
};

export default UserSignupScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // 'formState (state snapshot) will be updated when state changed
  const [formState, dispatchFormState] = useReducer(formReducer, {
    // these are initial-state
    inputValues: {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      name: "",
      surname: "",
      addr: "",
      phoneNo: ""
    },
    inputValidities: {
      username: false,
      email: false,
      password: false,
      confirmpassword: false,
      name: false,
      surname: false,
      addr: false,
      phoneNo: false
    },
    allFormIsValid: false
  });

  useEffect(() => {
    console.log("signup");
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("An error has occurred!(From useEffect error)", error, [
        { text: "OK" }
      ]);
      setError("");
    }
  }, [error]);

  // firebase call cloud function
  const signupHandler = async () => {
    setIsLoading(true);

    if (!formState.allFormIsValid) {
      setError("Please fill all the inputs");
      setIsLoading(false);
      return;
    }

    if (
      formState.inputValues.password !== formState.inputValues.confirmpassword
    ) {
      setIsLoading(false);
      Alert.alert(
        "An error has occurred!",
        "The password and the confirm password don't match",
        [{ text: "OK" }]
      );
      return;
    }

    let user = {
      username: formState.inputValues.username,
      email: formState.inputValues.email,
      password: sha256(formState.inputValues.password),
      name: formState.inputValues.name,
      surname: formState.inputValues.surname,
      addr: formState.inputValues.addr,
      phoneNo: "+66" + formState.inputValues.phoneNo.toString()
    };

    firebaseFunctions
      .createAccount(user)
      .then(() => {
        setIsLoading(false);
        props.navigation.navigate("ConfigAccountScreen");
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert("An error has occurred!", err, [{ text: "OK" }]);
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
          <ScrollView keyboardShouldPersistTaps={"handled"}>
            {/* {error ? <Text style={{ color: "red" }}>{error}</Text> : null} */}
            <Input
              id="username"
              label="Username"
              required
              autoCapitalize="none"
              errorText="Please enter a valid username"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
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
            <Input
              id="confirmpassword"
              label="Confirm Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="name"
              label="First Name"
              keyboardType="default"
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid name."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="surname"
              label="Surname"
              keyboardType="default"
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid surname."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="addr"
              label="Address"
              keyboardType="default"
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="phoneNo"
              label="Phone Number"
              keyboardType="numeric"
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a phoneNo."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title="ลงทะเบียน"
                  color={Colors.primary}
                  onPress={() => {
                    signupHandler();
                  }}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="ย้อนกลับ"
                color={Colors.secondary}
                onPress={() => {
                  props.navigation.navigate("UserSigninScreen");
                }}
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
