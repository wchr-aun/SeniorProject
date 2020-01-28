import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  Platform,
  Dimensions,
  Image,
  TextInput
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
import { shadow } from "react-native-paper";

const { width, height } = Dimensions.get("window");
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat
} = Animated;
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

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position
  ]);
}

export default UserAuthenScreen = props => {
  this.buttonOpacity = new Value(1);
  this.onStateChange = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
          )
        ])
    }
  ]);

  this.buttonY = interpolate(this.buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [100, 0],
    extrapolate: Extrapolate.CLAMP
  });

  this.bgY = interpolate(this.buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-height / 3, 0],
    extrapolate: Extrapolate.CLAMP
  });

  this.textInputZindex = interpolate(this.buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, -1],
    extrapolate: Extrapolate.CLAMP
  });

  this.textInputY = interpolate(this.buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [0, 1000],
    extrapolate: Extrapolate.CLAMP
  });

  this.textInputOpacity = interpolate(this.buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
  });

  this.rotateCross = interpolate(this.buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [180, 360],
    extrapolate: Extrapolate.CLAMP
  });

  this.onCloseState = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
          )
        ])
    }
  ]);

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
        flex: 1,
        justifyContent: "flex-end"
      }}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFill,
          transform: [{ translateY: this.bgY }]
        }}
      >
        <LinearGradient
          colors={Colors.linearGradient}
          style={styles.gradient}
        ></LinearGradient>
      </Animated.View>
      <View style={{ height: height / 3, justifyContent: "center" }}>
        <TapGestureHandler onHandlerStateChange={this.onStateChange}>
          <Animated.View
            style={{
              ...styles.button,
              opacity: this.buttonOpacity,
              transform: [{ translateY: this.buttonY }]
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>SIGN IN</Text>
          </Animated.View>
        </TapGestureHandler>

        <Animated.View
          style={{
            ...styles.button,
            backgroundColor: "#2E71DC",
            opacity: this.buttonOpacity,
            transform: [{ translateY: this.buttonY }]
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            SIGN UP
          </Text>
        </Animated.View>
      </View>
      <Animated.View
        style={{
          zIndex: this.textInputZindex,
          opacity: this.textInputOpacity,
          transform: [{ translateY: this.textInputY }],
          height: height / 3,
          ...StyleSheet.absoluteFill,
          top: null,
          justifyContent: "center"
        }}
      >
        <TapGestureHandler onHandlerStateChange={this.onCloseState}>
          <Animated.View style={styles.closeButton}>
            <Animated.Text
              style={{
                fontSize: 15,
                transform: [{ rotate: concat(this.rotateCross, "deg") }]
              }}
            >
              X
            </Animated.Text>
          </Animated.View>
        </TapGestureHandler>
        <TextInput
          placeholder="EMAIL"
          style={styles.TextInput}
          placeholderTextColor="black"
        />
        <TextInput
          placeholder="PASSWORD"
          style={styles.TextInput}
          placeholderTextColor="black"
        />
        <Animated.View style={styles.button}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>SIGNIN</Text>
        </Animated.View>
      </Animated.View>

      {/* {<View style={{ marginVertical: wp("5%") }}>
          <ThaiTitleText style={{ color: Colors.on_primary }}>
            ลงชื่อเข้าใช้
          </ThaiTitleText>
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

                <View
                  style={{ marginTop: hp("1.75%"), marginTop: hp("1.25%") }}
                >
                  <ThaiText
                    style={{
                      color: Colors.primary,
                      fontSize: 10
                    }}
                  >
                    หรือ "ลงทะเบียน" หากว่ายังไม่มีบัญชีในระบบ
                  </ThaiText>
                </View>

                <CustomButton
                  style={{
                    width: wp("40%"),
                    height: hp("6%"),
                    borderRadius: 10,
                    margin: wp("1.25%"),
                    borderWidth: 1,
                    borderColor: Colors.primary
                  }}
                  onPress={() => {
                    props.navigation.navigate("UserSignupScreen");
                  }}
                  btnColor={Colors.screen}
                  btnTitleColor={Colors.primary}
                  btnTitleFontSize={14}
                >
                  ลงทะเบียน{" "}
                  <MaterialCommunityIcons
                    name="account-plus"
                    size={14}
                    color={Colors.primary}
                  />
                </CustomButton>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Card> */}
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
    alignItems: "center"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    backgroundColor: "white",
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowColor: "black",
    elevation: 5
  },
  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -20,
    left: width / 2 - 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  TextInput: {
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    marginHorizontal: 20,
    paddingLeft: 10,
    marginVertical: 2,
    borderColor: "rgba(0,0,0,0.2)"
  }
});
