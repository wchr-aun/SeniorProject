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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { sha256 } from "js-sha256";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Input from "../components/UI/Input";
import Colors from "../constants/Colors";
import { createAccount, editBuyerInfo } from "../utils/firebaseFunctions";
import ThaiMdText from "../components/ThaiMdText";
import ThaiRegText from "../components/ThaiRegText";
import { getCurrentLocation, getManualStringLocation } from "../utils/libary";
import ModalShowInteractMap from "../components/ModalShowInteractMap";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Notifications } from "expo";
import firebaseUtil from "../firebase";
import CustomStatusBar from "../components/UI/CustomStatusBar";

// CHOOSE_CURRENT_ADDR
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
// for updaing value of variable form
const formReducer = (state, action) => {
  const updatedValues = {
    ...state.inputValues,
    [action.inputIdentifier]: action.value,
  };
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedValidities = {
        ...state.inputValidities,
        [action.inputIdentifier]: action.isValid,
      };
      let updatedAllFormIsValid = true;
      for (const key in updatedValidities)
        updatedAllFormIsValid = Boolean(
          updatedAllFormIsValid && updatedValidities[key]
        );
      let updatedAddrFormIsValid = Boolean(
        updatedValidities["shallowAddr"] &&
          updatedValidities["subdistrict"] &&
          updatedValidities["district"] &&
          updatedValidities["province"] &&
          updatedValidities["postalCode"]
      );

      return {
        ...state,
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        allFormIsValid: updatedAllFormIsValid,
        addrFormIsValid: updatedAddrFormIsValid,
      };
    case "CHOOSE_CURRENT_ADDR":
      return {
        ...state,
        inputValidities: {
          ...state.inputValidities,
          shallowAddr:
            action.prestateIsCur || Boolean(updatedValues["shallowAddr"]),
          subdistrict:
            action.prestateIsCur || Boolean(updatedValues["subdistrict"]),
          district: action.prestateIsCur || Boolean(updatedValues["district"]),
          province: action.prestateIsCur || Boolean(updatedValues["province"]),
          postalCode:
            action.prestateIsCur || Boolean(updatedValues["postalCode"]),
        },
      };
  }
  return state;
};

export default UserSignupScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentAddr, setCurrentAddr] = useState(false);
  const [addrModalVisible, setAddrModalVisible] = useState(false);
  const [addrReadable, setAddrReadable] = useState("");
  const [addrCord, setAddrCord] = useState("");
  const [sellerAddr, setSellerAddr] = useState("");

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
      subdistrict: "",
      district: "",
      province: "กรุงเทพมหานครฯ",
      postalCode: "",
      phoneNo: "",
    },
    inputValidities: {
      username: false,
      email: false,
      password: false,
      confirmpassword: false,
      name: false,
      surname: false,
      shallowAddr: false,
      subdistrict: false,
      district: false,
      province: true,
      postalCode: false,
      phoneNo: false,
    },
    allFormIsValid: false,
    addrFormIsValid: false,
  });

  useEffect(() => {
    console.log("signup");
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("มีข้อผิดพลาดบางอย่างเกิดขึ้น!", error, [{ text: "OK" }]);
      setError("");
    }
  }, [error]);

  // firebase call cloud function
  const signupHandler = async () => {
    setIsLoading(true);
    if (!formState.allFormIsValid) {
      setError("โปรดเติมข้อมูลให้ครบสมบูรณ์");
      setIsLoading(false);
      return;
    }

    if (
      formState.inputValues.password !== formState.inputValues.confirmpassword
    ) {
      setIsLoading(false);
      setError("รหัสผ่านกับการยืนยันรหัสผ่านต้องเหมือนกัน");
      return;
    }

    let notificationToken = await Notifications.getExpoPushTokenAsync();

    let user = {
      username: formState.inputValues.username,
      email: formState.inputValues.email,
      password: sha256(formState.inputValues.password),
      name: formState.inputValues.name,
      surname: formState.inputValues.surname,
      addr: sellerAddr,
      zipcode: sellerAddr.zipcode,
      phoneNo: "+66" + formState.inputValues.phoneNo.toString(),
      notificationToken,
    };
    createAccount(user)
      .then(() => {
        AsyncStorage.clear()
          .then(() => {
            firebaseUtil
              .auth()
              .signInWithEmailAndPassword(user.email, user.password)
              .then(() => {
                AsyncStorage.setItem("RECENT_LOGIN", user.email).then(() => {
                  editBuyerInfo({ addr: user.addr, enableSearch: false });
                });
                setIsLoading(false);
                props.navigation.navigate({
                  routeName: "UserSigninScreen",
                  params: {
                    signupBeforeSignin: true,
                  },
                });
              });
          })
          .catch((err) => {
            setIsLoading(false);
            setError(err.message);
          });
      })
      .catch((err) => {
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
        inputIdentifier: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const getCurrentLocationHandler = useCallback(async () => {
    let sellerAddrResult = await getCurrentLocation();
    console.log(sellerAddrResult);
    // set all addr form valid
    dispatchFormState({
      type: "CHOOSE_CURRENT_ADDR",
      prestateIsCur: !currentAddr,
    });
    setSellerAddr({ ...sellerAddrResult });
  }, [currentAddr]);

  // Search map from user input form
  const searchMapHandler = async () => {
    // do async task
    if (!formState.addrFormIsValid) {
      setError("โปรดเติมข้อมูลที่อยู่ข้างต้น ให้สมบูรณ์");
      return;
    }

    let userAddrString;
    if (formState.inputValues.province === "กรุงเทพมหานคร")
      userAddrString =
        formState.inputValues.shallowAddr +
        " แขวง " +
        formState.inputValues.subdistrict +
        " เขต " +
        formState.inputValues.district +
        " " +
        formState.inputValues.province +
        " " +
        formState.inputValues.postalCode;
    else
      userAddrString =
        formState.inputValues.shallowAddr +
        " ตำบล " +
        formState.inputValues.subdistrict +
        " อำเภอ " +
        formState.inputValues.district +
        " จังหวัด " +
        formState.inputValues.province +
        " " +
        formState.inputValues.postalCode;
    setAddrReadable(userAddrString);
    let result = await getManualStringLocation(userAddrString);
    setAddrCord(result);
    setAddrModalVisible(true);
  };

  if (addrModalVisible) {
    return (
      <ModalShowInteractMap
        setModalVisible={setAddrModalVisible}
        modalVisible={addrModalVisible}
        origin={{ latitude: addrCord.latitude, longitude: addrCord.longitude }}
        setSellerAddr={setSellerAddr}
        addrReadable={addrReadable}
        zipcode={formState.inputValues.postalCode}
        signupMode={true}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <CustomStatusBar />
      <LinearGradient colors={Colors.linearGradientB} style={styles.gradient}>
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            backgroundColor: Colors.secondary,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View style={{ width: "20%" }}>
            <CustomButton
              style={{ borderRadius: 5 }}
              btnColor={Colors.button.submit_primary_dark.btnBackground}
              btnTitleColor={Colors.button.submit_primary_dark.btnText}
              onPress={() => {
                props.navigation.navigate("UserSigninScreen");
              }}
              btnTitleFontSize={14}
            >
              <ThaiRegText style={{ fontSize: 10 }}>ย้อนกลับ</ThaiRegText>
            </CustomButton>
          </View>
          <View style={{ width: "50%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_secondary.high_constrast,
                fontSize: 18,
              }}
            >
              สร้างบัญชีผู้ใช้
            </ThaiBoldText>
          </View>
          <View
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </View>

        <View
          style={{
            width: "100%",
            height: "90%",
            backgroundColor: "white",
            paddingHorizontal: wp("5%"),
            paddingVertical: wp("8%"),
          }}
        >
          {/* <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={-200}
          > */}
          <ScrollView
            keyboardShouldPersistTaps={"handled"}
            style={{ width: "100%", height: "100%" }}
          >
            <Input
              editable={true}
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
              initialValid={
                formState.inputValidities.username
                  ? formState.inputValidities.username
                  : false
              }
              iconName="account"
            />
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
              initialValue={
                formState.inputValues.email ? formState.inputValues.email : ""
              }
              initialValid={
                formState.inputValidities.email
                  ? formState.inputValidities.email
                  : false
              }
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
              initialValue={
                formState.inputValues.password
                  ? formState.inputValues.password
                  : ""
              }
              initialValid={
                formState.inputValidities.password
                  ? formState.inputValidities.password
                  : false
              }
              iconName="key-variant"
            />
            <Input
              editable={true}
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
              initialValid={
                formState.inputValidities.confirmpassword
                  ? formState.inputValidities.confirmpassword
                  : false
              }
              iconName="key-variant"
            />
            <Input
              editable={true}
              id="name"
              label="ชื่อจริง"
              keyboardType="default"
              required
              minLength={2}
              autoCapitalize="none"
              errorText="Please enter a valid name."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.name ? formState.inputValues.name : ""
              }
              initialValid={
                formState.inputValidities.name
                  ? formState.inputValidities.name
                  : false
              }
              iconName="account"
            />
            <Input
              editable={true}
              id="surname"
              label="นามสกุล"
              keyboardType="default"
              required
              minLength={2}
              autoCapitalize="none"
              errorText="Please enter a valid surname."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.surname
                  ? formState.inputValues.surname
                  : ""
              }
              initialValid={
                formState.inputValidities.surname
                  ? formState.inputValidities.surname
                  : false
              }
              iconName="account-multiple"
            />
            <View
              style={{
                width: "100%",
                marginVertical: 3,
                alignSelf: "center",
              }}
            >
              <ThaiRegText style={{ fontSize: 14, textAlign: "center" }}>
                ที่อยู่ในการจัดส่ง
              </ThaiRegText>
            </View>
            <TouchableOpacity
              onPress={() => {
                setCurrentAddr((preState) => !preState);
                getCurrentLocationHandler();
              }}
            >
              <View
                style={{
                  width: "100%",
                  marginVertical: 3,
                  alignSelf: "center",
                  flexDirection: "row",
                }}
              >
                <MaterialIcons
                  name={currentAddr ? "check-box" : "check-box-outline-blank"}
                  size={15}
                  color={Colors.primary_dark}
                />
                <ThaiRegText style={{ fontSize: 10, textAlign: "center" }}>
                  ใช้ที่อยู่ปัจจุบันเป็นที่อยู่ในการจัดส่ง
                </ThaiRegText>
              </View>
            </TouchableOpacity>
            <Input
              editable={!currentAddr}
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
              initialValid={
                formState.inputValidities.shallowAddr
                  ? formState.inputValidities.shallowAddr
                  : false
              }
              iconName="account-card-details"
            />
            <Input
              editable={!currentAddr}
              id="subdistrict"
              label="ตำบล/แขวง"
              keyboardType="default"
              errorText="Please enter a valid address."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.subdistrict
                  ? formState.inputValues.subdistrict
                  : ""
              }
              initialValid={
                formState.inputValidities.subdistrict
                  ? formState.inputValidities.subdistrict
                  : false
              }
              iconName="account-card-details"
            />
            <Input
              editable={!currentAddr}
              id="district"
              label="อำเภอ/เขต"
              keyboardType="default"
              errorText="Please enter a valid address."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.district
                  ? formState.inputValues.district
                  : ""
              }
              initialValid={
                formState.inputValidities.district
                  ? formState.inputValidities.district
                  : false
              }
              iconName="account-card-details"
            />
            <Input
              editable={!currentAddr}
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
              initialValid={
                formState.inputValidities.province
                  ? formState.inputValidities.province
                  : false
              }
              iconName="account-card-details"
            />
            <Input
              editable={!currentAddr}
              id="postalCode"
              label="รหัสไปรษณีย์"
              keyboardType="numeric"
              errorText="Please enter a valid address."
              onInputChange={inputChangeHandler}
              initialValue={
                formState.inputValues.postalCode
                  ? formState.inputValues.postalCode
                  : ""
              }
              initialValid={
                formState.inputValidities.postalCode
                  ? formState.inputValidities.postalCode
                  : false
              }
              iconName="account-card-details"
            />
            <ThaiRegText
              style={{
                fontSize: 12,
                color:
                  currentAddr === true ? Colors.secondary : Colors.primary_dark,
              }}
            >
              กดปุ่ม 'ค้นหาสถานที่' หลังจากกรอกข้อมูลที่อยู่
            </ThaiRegText>
            <CustomButton
              // disable={currentAddr}
              style={{
                width: wp("40%"),
                height: hp("6%"),
                borderRadius: 10,
                margin: wp("1.25%"),
                alignSelf: "center",
              }}
              onPress={searchMapHandler}
              btnColor={
                currentAddr
                  ? Colors.button.disabled.btnBackground
                  : Colors.button.start_operation_info.btnBackground
              }
              btnTitleColor={
                currentAddr
                  ? Colors.button.disabled.btnText
                  : Colors.button.start_operation_info.btnText
              }
              btnTitleFontSize={14}
            >
              ค้นหาสถานที่
            </CustomButton>
            <Input
              editable={true}
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
              initialValid={
                formState.inputValidities.phoneNo
                  ? formState.inputValidities.phoneNo
                  : false
              }
              iconName="cellphone-android"
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary_dark} />
              ) : (
                <CustomButton
                  style={{
                    width: wp("40%"),
                    height: hp("6%"),
                    borderRadius: 10,
                    margin: wp("1.25%"),
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    signupHandler();
                  }}
                  btnColor={Colors.button.submit_primary_dark.btnBackground}
                  btnTitleColor={Colors.button.submit_primary_dark.btnText}
                  btnTitleFontSize={14}
                >
                  ยืนยันลงทะเบียน
                </CustomButton>
              )}
            </View>
          </ScrollView>
          {/* </KeyboardAvoidingView> */}
        </View>
        {/* <View
          style={{
            width: "90%",
            height: "15%",
            justifyContent: "center",
            paddingBottom: getStatusBarHeight(),
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              height: "60%",
              borderRadius: 10,
              margin: wp("1.25%"),
              alignSelf: "flex-start",
              borderWidth: 1,
              borderColor: Colors.button.cancel.btnText,
            }}
            onPress={() => {
              props.navigation.navigate("UserSigninScreen");
            }}
            btnColor={Colors.button.cancel.btnBackground}
            btnTitleColor={Colors.button.cancel.btnText}
            btnTitleFontSize={14}
          >
            <MaterialIcons
              name="chevron-left"
              size={12}
              color={Colors.button.cancel.btnText}
            />{" "}
            ย้อนกลับ
          </CustomButton>
        </View> */}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
