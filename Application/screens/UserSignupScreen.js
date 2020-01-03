import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Button
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { sha256 } from "js-sha256";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Colors from "../constants/Colors";
import firebaseFunctions from "../utils/firebaseFunctions";
import ThaiTitleText from "../components/ThaiTitleText";
import ThaiText from "../components/ThaiText";
import {
  getCurrentLocation,
  getManualStringLocation
} from "../utils/locationFunctions";
import ModalShowInteractMap from "../components/ModalShowInteractMap";

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
  const [currentAddr, setCurrentAddr] = useState(false);

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
      shallowAddr: "",
      tumbon: "",
      district: "",
      province: "",
      provinceNumber: "",
      phoneNo: ""
    },
    inputValidities: {
      username: false,
      email: false,
      password: false,
      confirmpassword: false,
      name: false,
      surname: false,
      shallowAddr: false,
      tumbon: false,
      district: false,
      province: false,
      provinceNumber: false,
      phoneNo: false
    },
    allFormIsValid: false
  });

  useEffect(() => {
    console.log("signup");
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("An error has occurred!", error, [{ text: "OK" }]);
      setError("");
    }
  }, [error]);

  // firebase call cloud function
  const signupHandler = async () => {
    setIsLoading(true);

    console.log(formState);
    if (!formState.allFormIsValid) {
      setError("Please fill all the inputs");
      setIsLoading(false);
      return;
    }

    if (
      formState.inputValues.password !== formState.inputValues.confirmpassword
    ) {
      setIsLoading(false);
      setError("The password and the confirm password don't match");
      return;
    }

    let user = {
      username: formState.inputValues.username,
      email: formState.inputValues.email,
      password: sha256(formState.inputValues.password),
      name: formState.inputValues.name,
      surname: formState.inputValues.surname,
      // addr: formState.inputValues.addr,
      addr: addrUserObj,
      phoneNo: "+66" + formState.inputValues.phoneNo.toString()
    };

    firebaseFunctions
      .createAccount(user)
      .then(() => {
        AsyncStorage.clear()
          .then(() => {
            setIsLoading(false);
            props.navigation.navigate("ConfigAccountScreen");
          })
          .catch(err => {
            setIsLoading(false);
            setError(err);
          });
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
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

  const [addrModalVisible, setAddrModalVisible] = useState(false);
  const [addrUserObj, setAddrUserObj] = useState(""); // really used
  const [addrUserInput, setAddrUserInput] = useState("");
  const getCurrentLocationHandler = async () => {
    let userAddrObj = await getCurrentLocation();
    setAddrUserObj(userAddrObj);
  };

  // Check user addr
  useEffect(() => {
    console.log("This is an user address before sending signup form");
    console.log(addrUserObj);
  }, [addrUserObj]);

  // Search map from user input form
  const searchMapHandler = async () => {
    // do async task
    let userAddrString =
      formState.inputValues.shallowAddr +
      " ตำบล " +
      formState.inputValues.tumbon +
      " อำเภอ " +
      formState.inputValues.district +
      " จังหวัด " +
      formState.inputValues.province +
      " " +
      formState.inputValues.provinceNumber;
    let result = await getManualStringLocation(userAddrString);
    setAddrUserInput(result);
    setAddrModalVisible(true);
  };

  if (addrModalVisible) {
    return (
      <ModalShowInteractMap
        setModalVisible={setAddrModalVisible}
        modalVisible={addrModalVisible}
        latitude={addrUserInput.latitude}
        longitude={addrUserInput.longitude}
        setAddrUserObj={setAddrUserObj}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ ...styles.screen, flex: 1 }}
    >
      <LinearGradient colors={Colors.linearGradientB} style={styles.gradient}>
        <View style={{ marginVertical: wp("5%") }}>
          <ThaiTitleText style={{ color: Colors.on_primary }}>
            สร้างบัญชีผู้ใช้
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
          titleVar="title"
        >
          <ScrollView keyboardShouldPersistTaps={"handled"}>
            {/* {error ? <Text style={{ color: "red" }}>{error}</Text> : null} */}
            <Input
              id="username"
              label="ชื่อผู้ใช้"
              required
              autoCapitalize="none"
              errorText="Please enter a valid username"
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.username
                  ? formState.inputValues.username
                  : ""
              }
              iconName="account"
            />
            <Input
              id="email"
              label="อีเมล"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.email ? formState.inputValues.email : ""
              }
              iconName="email"
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
              initialValue={
                formState.inputValues.password
                  ? formState.inputValues.password
                  : ""
              }
              iconName="key-variant"
            />
            <Input
              id="confirmpassword"
              label="ยืนยันรหัสผ่าน"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.confirmpassword
                  ? formState.inputValues.confirmpassword
                  : ""
              }
              iconName="key-variant"
            />
            <Input
              id="name"
              label="ชื่อจริง"
              keyboardType="default"
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid name."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.name ? formState.inputValues.name : ""
              }
              iconName="account"
            />
            <Input
              id="surname"
              label="นามสกุล"
              keyboardType="default"
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid surname."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.surname
                  ? formState.inputValues.surname
                  : ""
              }
              iconName="account-multiple"
            />
            <View
              style={{ width: "100%", marginVertical: 3, alignSelf: "center" }}
            >
              <ThaiText style={{ fontSize: 14, textAlign: "center" }}>
                ที่อยู่ในการจัดส่ง
              </ThaiText>
            </View>
            <TouchableOpacity
              onPress={() => {
                setCurrentAddr(preState => !preState);
                getCurrentLocationHandler();
              }}
              style={{ flexDirection: "row" }}
            >
              <MaterialIcons
                name={currentAddr ? "check-box" : "check-box-outline-blank"}
                size={15}
                color={Colors.primary}
              />
              <View style={{ marginHorizontal: 4 }}>
                <ThaiText style={{ fontSize: 10 }}>
                  ใช้ที่อยู่ปัจจุบัน?
                </ThaiText>
              </View>
            </TouchableOpacity>
            <Input
              id="shallowAddr"
              label="ที่อยู่"
              keyboardType="default"
              errorText="Please enter a valid address."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.shallowAddr
                  ? formState.inputValues.shallowAddr
                  : ""
              }
              iconName="account-card-details"
            />
            <Input
              id="tumbon"
              label="ตำบล"
              keyboardType="default"
              errorText="Please enter a valid address."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.tumbon ? formState.inputValues.tumbon : ""
              }
              iconName="account-card-details"
            />
            <Input
              id="district"
              label="อำเภอ"
              keyboardType="default"
              errorText="Please enter a valid address."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.district
                  ? formState.inputValues.district
                  : ""
              }
              iconName="account-card-details"
            />
            <Input
              id="province"
              label="จังหวัด"
              keyboardType="default"
              errorText="Please enter a valid address."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.province
                  ? formState.inputValues.province
                  : ""
              }
              iconName="account-card-details"
            />
            <Input
              id="provinceNumber"
              label="รหัสไปรษณีย์"
              keyboardType="default"
              errorText="Please enter a valid address."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.provinceNumber
                  ? formState.inputValues.provinceNumber
                  : ""
              }
              iconName="account-card-details"
            />
            <Button onPress={searchMapHandler} title="Search Map" />
            <Input
              id="phoneNo"
              label="เบอร์โทรศัพท์"
              keyboardType="numeric"
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a phoneNo."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.phoneNo
                  ? formState.inputValues.phoneNo
                  : ""
              }
              iconName="cellphone-android"
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <CustomButton
                  style={{
                    width: wp("40%"),
                    height: hp("6%"),
                    borderRadius: 10,
                    margin: wp("1.25%"),
                    alignSelf: "center"
                  }}
                  onPress={() => {
                    signupHandler();
                  }}
                  btnColor={Colors.primary}
                  btnTitleColor={Colors.on_primary}
                  btnTitleFontSize={14}
                >
                  ยืนยันลงทะเบียน
                </CustomButton>
              )}
            </View>
          </ScrollView>
        </Card>
        <View style={{ width: wp("90%") }}>
          <CustomButton
            style={{
              width: wp("40%"),
              height: hp("6%"),
              borderRadius: 10,
              marginVertical: hp("1.25%"),
              alignSelf: "flex-start",
              borderWidth: 1,
              borderColor: Colors.on_secondary
            }}
            onPress={() => {
              props.navigation.navigate("UserSigninScreen");
            }}
            btnColor={Colors.on_primary}
            btnTitleColor={Colors.primary}
            btnTitleFontSize={14}
          >
            <MaterialIcons
              name="chevron-left"
              size={12}
              color={Colors.primary}
            />{" "}
            ย้อนกลับ
          </CustomButton>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    marginTop: 10
  }
});
