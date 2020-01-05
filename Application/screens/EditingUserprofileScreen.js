import React, { useEffect, useState, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Button,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { sha256 } from "js-sha256";
import { useDispatch, useSelector } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Header } from "react-navigation-stack";
import AppVariableSetting from "../constants/AppVariableSetting";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as authAction from "../store/actions/authAction";

import Input from "../components/UI/Input";
import Colors from "../constants/Colors";
import ThaiTitleText from "../components/ThaiTitleText";
import ThaiText from "../components/ThaiText";
import { getCurrentLocation } from "../utils/libary";
import SwitchToggle from "@dooboo-ui/native-switch-toggle";

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
      addrFormIsValide: updatedAddrFormIsValid
    };
  }
  return state;
};

export default EditingUserprofileScreen = props => {
  useEffect(() => {
    console.log("signup");
  }, []);

  // get all user data
  const userProfile = useSelector(state => state.userProfile.user);

  // 'formState (state snapshot) will be updated when state changed
  const [formState, dispatchFormState] = useReducer(formReducer, {
    // these are initial-state
    inputValues: {
      name: userProfile.name,
      surname: userProfile.surname,
      shallowAddr: "",
      subdistrict: "",
      district: "",
      province: "กรุงเทพมหานครฯ",
      postalCode: ""
    },
    inputValidities: {
      name: true,
      surname: true,
      shallowAddr: false,
      subdistrict: false,
      district: false,
      province: true,
      postalCode: false
    },
    allFormIsValid: false,
    addrFormIsValide: false
  });

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Error handling
  useEffect(() => {
    if (error) {
      Alert.alert("An error has occurred!", error, [{ text: "OK" }]);
      setError("");
    }
  }, [error]);

  const [isCurrentAddr, setIsCurrentAddr] = useState(false);
  const [isAddrModalVisible, setIsAddrModalVisible] = useState(false);
  const [addrReadable, setAddrReadable] = useState(""); // readable
  const [addrCord, setAddrCord] = useState(""); //la, long
  const [sellerAddr, setSellerAddr] = useState(""); // la, long, readable

  const getCurrentLocationHandler = useCallback(async () => {
    let sellerAddrResult = await getCurrentLocation();
    // set all addr form valid
    dispatchFormState({
      type: "CHOOSE_CURRENT_TIME",
      prestateIsCur: isCurrentAddr
    });
    setSellerAddr({ ...sellerAddrResult });
  }, [isCurrentAddr]);

  // Search map from user input form
  const searchMapHandler = async () => {
    // do async task
    if (!formState.addrFormIsValide) {
      setError("Please fill all the addresses");
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
    setIsAddrModalVisible(true);
  };

  const [switchSearch, setSwitchSearch] = useState(false);
  const [isSeller, setIsSeller] = useState(true);

  const configHandler = role => {
    setIsSeller(role === "seller" ? true : false);
  };

  // firebase call cloud function
  const editHandler = async () => {
    setIsLoading(true);

    console.log("------> formState");
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

    let notificationToken = await Notifications.getExpoPushTokenAsync();

    let user = {
      username: formState.inputValues.username,
      email: formState.inputValues.email,
      password: sha256(formState.inputValues.password),
      name: formState.inputValues.name,
      surname: formState.inputValues.surname,
      addr: sellerAddr,
      phoneNo: "+66" + formState.inputValues.phoneNo.toString(),
      notificationToken
    };

    console.log(
      "--------> Submit ! ----> user that is passed to createAccount "
    );
    console.log(user);

    createAccount(user)
      .then(() => {
        AsyncStorage.clear()
          .then(() => {
            setIsLoading(false);
            props.navigation.navigate("ConfigAccountScreen");
          })
          .catch(err => {
            setIsLoading(false);
            setError(err.message);
          });
      })
      .catch(err => {
        setIsLoading(false);
        setError(err.message);
      });
  };

  if (isAddrModalVisible) {
    return (
      <ModalShowInteractMap
        setModalVisible={setIsAddrModalVisible}
        modalVisible={isAddrModalVisible}
        latitude={addrCord.latitude}
        longitude={addrCord.longitude}
        setSellerAddr={setSellerAddr}
        addrReadable={addrReadable}
      />
    );
  }

  // For User signout
  const dispatch = useDispatch();
  const signOutHandler = async () => {
    setIsLoading(true);
    let result = await dispatch(authAction.signout());

    /* Maybe clear redux storing in the ram
    Look at this thread, might be useful, probably:
    https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store */

    if (result) props.navigation.navigate("StartupScreen");
    else {
      setIsLoading(false);
      /* Make an alert or something, I don't know. */
    }
  };

  return (
    <View
      style={{
        height: hp("100%") + getStatusBarHeight(),
        width: wp("100%")
      }}
    >
      <LinearGradient colors={Colors.linearGradientB} style={styles.gradient}>
        <View
          style={{
            padding: wp("3%"),
            height: "10%",
            paddingTop: getStatusBarHeight(),
            alignSelf: "center"
          }}
        >
          <ThaiTitleText style={{ color: Colors.on_primary, fontSize: 14 }}>
            ตั้งค่าข้อมูลผู้ใช้งาน
          </ThaiTitleText>
        </View>
        <View
          style={{
            ...styles.authContainer,
            width: "100%",
            height: "75%",
            paddingHorizontal: wp("5%"),
            paddingVertical: wp("8%"),
            borderRadius: 3,
            backgroundColor: "white"
          }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "android" ? -200 : 0}
          >
            <ScrollView keyboardShouldPersistTaps={"handled"}>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "space-around"
                }}
              >
                <TouchableOpacity
                  onPress={() => configHandler("seller")}
                  style={{ alignItems: "center" }}
                >
                  <MaterialCommunityIcons
                    name="account"
                    color={
                      isSeller ? Colors.primary_variant : Colors.lineSeparate
                    }
                    size={36}
                  />
                  <ThaiText>คนขาย</ThaiText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => configHandler("buyer")}
                  style={{ alignItems: "center" }}
                >
                  <MaterialCommunityIcons
                    name="car-pickup"
                    color={
                      !isSeller ? Colors.primary_variant : Colors.lineSeparate
                    }
                    size={36}
                  />
                  <ThaiText>คนขาย</ThaiText>
                </TouchableOpacity>
              </View>
              <Input
                editable={true}
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
                minLength={5}
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
                  marginTop: 15,
                  marginBottom: 10,
                  alignSelf: "center"
                }}
              >
                <ThaiText style={{ textAlign: "center", fontSize: 16 }}>
                  ที่อยู่ในการจัดส่ง
                </ThaiText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
              >
                <SwitchToggle
                  switchOn={switchSearch}
                  onPress={() => setSwitchSearch(!switchSearch)}
                  duration={150}
                  backgroundColorOn="#5fdba7"
                  backgroundColorOff="#808080"
                  circleColorOff="#ffffff"
                  circleColorOn="#ffffff"
                  // containerStyle={{ marginHorizontal: 5 }}
                />
                <ThaiText>ใช้งานตำแหน่งที่ตั้ง</ThaiText>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setIsCurrentAddr(preState => !preState);
                  getCurrentLocationHandler();
                }}
              >
                <View
                  style={{
                    width: "100%",
                    marginVertical: 3,
                    alignSelf: "center",
                    flexDirection: "row"
                  }}
                >
                  {/* <MaterialIcons
                    name={
                      isCurrentAddr ? "check-box" : "check-box-outline-blank"
                    }
                    size={15}
                    color={Colors.primary}
                  /> */}
                  <SwitchToggle
                    switchOn={isCurrentAddr}
                    onPress={() => setIsCurrentAddr(!isCurrentAddr)}
                    duration={150}
                    backgroundColorOn="#5fdba7"
                    backgroundColorOff="#808080"
                    circleColorOff="#ffffff"
                    circleColorOn="#ffffff"
                    // containerStyle={{ marginHorizontal: 5 }}
                  />
                  <ThaiText style={{ textAlign: "center" }}>
                    ใช้ที่อยู่ปัจจุบันเป็นที่อยู่ในการจัดส่ง
                  </ThaiText>
                </View>
              </TouchableOpacity>

              <Input
                editable={!isCurrentAddr}
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
                editable={!isCurrentAddr}
                id="subdistrict"
                label="ตำบล"
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
                editable={!isCurrentAddr}
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
                initialValid={
                  formState.inputValidities.district
                    ? formState.inputValidities.district
                    : false
                }
                iconName="account-card-details"
              />
              <Input
                editable={!isCurrentAddr}
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
                editable={!isCurrentAddr}
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
              <ThaiText
                style={{
                  fontSize: 12,
                  color:
                    isCurrentAddr === true ? Colors.on_primary : Colors.primary
                }}
              >
                กดปุ่ม 'ค้นหาสถานที่' หลังจากกรอกข้อมูลที่อยู่
              </ThaiText>
              <CustomButton
                disable={isCurrentAddr}
                style={{
                  width: wp("40%"),
                  height: hp("6%"),
                  borderRadius: 10,
                  margin: wp("1.25%"),
                  alignSelf: "center"
                }}
                onPress={searchMapHandler}
                btnColor={Colors.on_primary}
                btnTitleColor={Colors.primary}
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
                      editHandler();
                    }}
                    btnColor={Colors.primary}
                    btnTitleColor={Colors.on_primary}
                    btnTitleFontSize={14}
                  >
                    ยืนยันการแก้ไข้
                  </CustomButton>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <View
          style={{
            width: wp("90%"),
            height: "15%",
            justifyContent: "space-around",
            flexDirection: "row",
            paddingBottom: getStatusBarHeight()
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              height: "60%",
              borderRadius: 10,
              margin: wp("1.25%"),
              borderWidth: 1,
              borderColor: Colors.on_secondary
            }}
            onPress={() => {
              props.navigation.navigate("EditingUserprofileScreen");
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
          <CustomButton
            style={{
              width: "40%",
              height: "60%",
              borderRadius: 10,
              margin: wp("1.25%"),
              borderWidth: 1,
              borderColor: Colors.on_secondary
            }}
            onPress={signOutHandler}
            btnColor={Colors.primary}
            btnTitleColor={Colors.on_primary}
            btnTitleFontSize={14}
          >
            ลงชื่อออก
          </CustomButton>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({});
