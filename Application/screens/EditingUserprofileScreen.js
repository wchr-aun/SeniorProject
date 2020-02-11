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
import { toggleSearch, editUserInfo } from "../utils/firebaseFunctions";
import ModalShowInteractMap from "../components/ModalShowInteractMap";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as authAction from "../store/actions/authAction";

import Input from "../components/UI/Input";
import Colors from "../constants/Colors";
import ThaiMdText from "../components/ThaiMdText";
import ThaiRegText from "../components/ThaiRegText";
import libary, {
  getCurrentLocation,
  getManualStringLocation
} from "../utils/libary";
import SwitchToggle from "@dooboo-ui/native-switch-toggle";
import ImageCircle from "../components/UI/ImageCircle";
import CustomButton from "../components/UI/CustomButton";

// CHOOSE_CURRENT_TIME
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
// for updaing value of variable form
const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
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
    case "CHOOSE_CURRENT_TIME":
      return {
        ...state,
        inputValidities: {
          ...state.inputValidities,
          shallowAddr: !action.prestateIsCur,
          subdistrict: !action.prestateIsCur,
          district: !action.prestateIsCur,
          province: !action.prestateIsCur,
          postalCode: !action.prestateIsCur
        }
      };
  }
  return state;
};

export default EditingUserprofileScreen = props => {
  useEffect(() => {
    console.log("Edit");
  }, []);

  // get all user data
  const userProfile = useSelector(state => state.user.userProfile);
  // Role
  const [userRole, setUserRole] = useState(
    useSelector(state => state.user.userRole)
  );
  // User Address
  const [isCurrentAddr, setIsCurrentAddr] = useState(true);
  const [addrReadable, setAddrReadable] = useState(""); // readable
  const [addrCord, setAddrCord] = useState(""); //la, long
  const [userAddrObj, setUserAddrObj] = useState(userProfile.addr); // la, long, readable
  const [isEnableSearch, setIsEnableSearch] = useState(
    userProfile.enableSearch
  );
  const [isAddrModalVisible, setIsAddrModalVisible] = useState(false);

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
      postalCode: "",
      photoURL: userProfile.photoURL,
      phoneNo: userProfile.phoneNo
        ? userProfile.phoneNo.replace("+66", "0")
        : userProfile.phoneNo
    },
    inputValidities: {
      name: true,
      surname: true,
      shallowAddr: true,
      subdistrict: true,
      district: true,
      province: true,
      postalCode: true,
      photoURL: true,
      phoneNo: true
    },
    allFormIsValid: true,
    addrFormIsValide: true
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
      Alert.alert("มีข้อผิดพลาดบางอย่างเกิดขึ้น", error.message, [
        { text: "OK" }
      ]);
      setError("");
    }
  }, [error]);

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
    console.log("result");
    console.log(result);
    setAddrCord(result);
    setIsAddrModalVisible(true);
  };

  const changeRoleHandler = role => {
    // UI
    setUserRole(role);
    // dispatch(authAction.changeRole(role));
  };

  // firebase call cloud function
  const editConfirmHandler = async () => {
    setIsLoading(true);

    if (!formState.allFormIsValid) {
      setError("โปรดกรอกข้อมูลให้ครบถ้วน");
      setIsLoading(false);
      return;
    }
    console.log("------> formState");
    console.log(formState);

    // passed to toggleSearch
    console.log("isEnableSearch");
    console.log(isEnableSearch);

    // passed to editUserInfo()
    let user = {
      name: formState.inputValues.name,
      surname: formState.inputValues.surname,
      addr: userAddrObj,
      photoURL: formState.inputValues.photoURL,
      phoneNo: formState.inputValues.phoneNo.replace("0", "+66")
    };

    dispatch(authAction.changeRole(role));
    editUserInfo(user)
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
        origin={{ latitude: addrCord.latitude, longitude: addrCord.longitude }}
        setUserAddrObj={setUserAddrObj}
        addrReadable={addrReadable}
        zipcode={formState.inputValues.postalCode}
        signupMode={false}
      />
    );
  }

  // For User signout
  const dispatch = useDispatch();
  const signOutHandler = () => {
    setIsLoading(true);
    dispatch(authAction.signout());
  };

  //User image
  const [userImg, setUserImg] = useState("");
  useEffect(() => {
    loadUserImg();
  }, []);
  const loadUserImg = async () => {
    let imgUri = await libary.downloadingImg(
      [`${userProfile.uid}.jpg`],
      "user"
    );
    setUserImg(imgUri[0]);
  };

  const pickImage = async () => {
    let img = await libary.pickedAnImg();
    setUserImg(img.uri);
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
            height: "15%",
            paddingTop: getStatusBarHeight(),
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ThaiMdText
            style={{
              color: Colors.on_primary_bright.high_constrast,
              fontSize: 20
            }}
          >
            ตั้งค่าข้อมูลผู้ใช้งาน
          </ThaiMdText>
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
            keyboardVerticalOffset={Platform.OS === "android" ? 100 : 0}
          >
            <ScrollView keyboardShouldPersistTaps={"handled"}>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <ImageCircle avariableWidth={120} imgUrl={userImg} />
                <CustomButton
                  style={{
                    width: "40%",
                    height: "100%",
                    maxHeight: 40,
                    borderRadius: 5
                  }}
                  onPress={pickImage}
                  btnTitleFontSize={18}
                  btnColor={Colors.hard_secondary}
                  btnTitleColor={Colors.primary_dark}
                >
                  เลือกรูปภ่าพ
                </CustomButton>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "space-around"
                }}
              >
                <TouchableOpacity
                  onPress={() => changeRoleHandler("seller")}
                  style={{
                    alignItems: "center",
                    width: wp("20%"),
                    height: wp("20%"),
                    borderRadius: wp("20%"),
                    borderWidth: 3,
                    borderColor:
                      userRole === "seller"
                        ? Colors.primary_bright
                        : Colors.secondary
                  }}
                >
                  <MaterialCommunityIcons
                    name="account"
                    color={
                      userRole === "seller"
                        ? Colors.primary_bright
                        : Colors.secondary
                    }
                    size={36}
                  />
                  <ThaiRegText>คนขาย</ThaiRegText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => changeRoleHandler("buyer")}
                  style={{
                    alignItems: "center",
                    width: wp("20%"),
                    height: wp("20%"),
                    borderRadius: wp("20%"),
                    borderWidth: 3,
                    borderColor:
                      userRole === "buyer"
                        ? Colors.primary_bright
                        : Colors.secondary
                  }}
                >
                  <MaterialCommunityIcons
                    name="car-pickup"
                    color={
                      userRole === "buyer"
                        ? Colors.primary_bright
                        : Colors.secondary
                    }
                    size={36}
                  />
                  <ThaiRegText>คนซื้อ</ThaiRegText>
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
              <View
                style={{
                  width: "100%",
                  marginTop: 15,
                  marginBottom: 10,
                  alignSelf: "center"
                }}
              >
                <ThaiRegText style={{ textAlign: "center", fontSize: 16 }}>
                  ที่อยู่ในการจัดส่ง
                </ThaiRegText>
              </View>

              <View
                style={{
                  width: "100%",
                  marginTop: 15,
                  marginBottom: 10,
                  alignSelf: "center"
                }}
              >
                <ThaiRegText
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: isCurrentAddr
                      ? Colors.primary_bright
                      : Colors.secondary
                  }}
                >
                  {userProfile.addr.readable}
                </ThaiRegText>
              </View>

              <TouchableOpacity
                onPress={() => {
                  console.log(isCurrentAddr);
                  setIsCurrentAddr(preState => !preState);
                  // getCurrentLocationHandler();
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
                  <SwitchToggle
                    switchOn={isCurrentAddr}
                    duration={150}
                    backgroundColorOn="#5fdba7"
                    backgroundColorOff="#808080"
                    circleColorOff="#ffffff"
                    circleColorOn="#ffffff"
                    onPress={() => setIsCurrentAddr(preState => !preState)}
                  />
                  <ThaiRegText style={{ textAlign: "center", fontSize: 12 }}>
                    ใช้ที่อยู่ปัจจุบันเป็นที่อยู่ในการจัดส่ง
                  </ThaiRegText>
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
              <ThaiRegText
                style={{
                  fontSize: 12,
                  color:
                    isCurrentAddr === true
                      ? Colors.secondary
                      : Colors.primary_dark
                }}
              >
                กดปุ่ม 'ค้นหาสถานที่' หลังจากกรอกข้อมูลที่อยู่
              </ThaiRegText>
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
                btnColor={Colors.secondary}
                btnTitleColor={
                  !isCurrentAddr ? Colors.primary_dark : Colors.secondary
                }
                btnTitleFontSize={14}
              >
                ค้นหาสถานที่
              </CustomButton>
              <View style={styles.buttonContainer}>
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.primary_bright_variant}
                  />
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
                      editConfirmHandler();
                    }}
                    btnColor={Colors.button.submit_primary_bright.btnBackground}
                    btnTitleColor={Colors.button.submit_primary_bright.btnText}
                    btnTitleFontSize={14}
                  >
                    ยืนยันการแก้ไข
                  </CustomButton>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <View
          style={{
            width: wp("100%"),
            height: "10%",
            justifyContent: "center",
            flexDirection: "row",
            paddingBottom: getStatusBarHeight()
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              height: "80%",
              borderRadius: 10,
              margin: wp("1.25%"),
              borderWidth: 1,
              borderColor: Colors.secondary
            }}
            onPress={() => {
              props.navigation.navigate("StartupScreen");
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
          <CustomButton
            style={{
              width: "40%",
              height: "80%",
              borderRadius: 10,
              margin: wp("1.25%"),
              borderWidth: 1,
              borderColor: Colors.button.submit_primary_dark.btnText
            }}
            onPress={signOutHandler}
            btnColor={Colors.button.submit_primary_dark.btnBackground}
            btnTitleColor={Colors.button.submit_primary_dark.btnText}
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
