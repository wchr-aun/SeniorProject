import React, { useEffect, useState, useReducer, useCallback } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as buyerAction from "../../store/actions/buyerAction";

import ThaiRegText from "../../components/ThaiRegText";
import ThaiMdText from "../../components/ThaiMdText";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AppVariableSetting from "../../constants/AppVariableSetting";

import CustomButton from "../../components/UI/CustomButton";
import ThaiBoldText from "../../components/ThaiBoldText";
import { TouchableOpacity } from "react-native-gesture-handler";

export default EditBuyerInfomationScreen = (props) => {
  // initially fetch
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  // ------------- DATA ------------- //
  const wasteListSectionFormat = useSelector(
    (state) => state.buyerInfo.wasteListSectionFormat
  );
  const purchaseList = useSelector((state) => state.buyerInfo.purchaseList); // sure data is ready
  const buyerUserInfo = useSelector((state) => state.user.userProfile);

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [enableSearch, setEnableSearch] = useState(
    useSelector((state) => state.buyerInfo.enableSearch)
  );

  const toggleModeHandler = () => {
    if (isEditingMode) {
      // done edit
      let description = "temp";
      purchaseList.confirmValue();

      dispatch(
        buyerAction.updatePurchaseList(
          purchaseList,
          description,
          buyerUserInfo.addr,
          enableSearch
        )
      );
      setIsEditingMode(false);
    } else {
      // start to edit
      setIsEditingMode(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomStatusBar />
      <KeyboardAvoidingView
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight,
        }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            backgroundColor: Colors.hard_primary_dark,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View style={{ minWidth: "20%", maxWidth: "24%", maxHeight: 50 }}>
            {isEditingMode ? (
              <CustomButton
                onPress={() => setIsEditingMode(false)}
                style={{
                  flex: 1,
                  borderRadius: 5,
                }}
                btnColor={Colors.soft_primary_dark}
                btnTitleColor={Colors.primary_dark}
                btnTitleFontSize={10}
              >
                <ThaiBoldText
                  style={{
                    fontSize: 14,
                  }}
                >
                  ยกเลิกแก้ไข
                </ThaiBoldText>
              </CustomButton>
            ) : null}
          </View>
          <View style={{ alignItems: "center", width: "50%" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_primary_dark.low_constrast,
                fontSize: 18,
              }}
            >
              กำหนดราคารับซื้อขยะ
            </ThaiBoldText>
          </View>

          <CustomButton
            style={{
              width: "20%",
              maxHeight: 50,
              marginHorizontal: 5,
              borderRadius: 5,
              borderColor: isEditingMode
                ? Colors.button.start_operation_info.btnText
                : Colors.button.finish_operation_info.btnText,
              borderWidth: 0.75,
            }}
            onPress={toggleModeHandler}
            btnColor={
              isEditingMode
                ? Colors.button.start_operation_info.btnBackground
                : Colors.button.finish_operation_info.btnBackground
            }
            btnTitleColor={
              isEditingMode
                ? Colors.button.start_operation_info.btnText
                : Colors.button.finish_operation_info.btnText
            }
            btnTitleFontSize={10}
          >
            <ThaiMdText>
              {isEditingMode ? "ยืนยันแก้ไข" : "แก้ไขข้อมูล"}
            </ThaiMdText>
          </CustomButton>
        </View>

        <View
          style={{
            width: "100%",
            height: "90%",
            paddingHorizontal: 10,
            paddingBottom: getStatusBarHeight(),
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "90%",
              height: 50,
              backgroundColor: enableSearch
                ? isEditingMode
                  ? Colors.button.submit_primary_bright.btnBackground
                  : Colors.button.submit_primary_bright.btnBackgroundDisabled
                : isEditingMode
                ? Colors.button.submit_primary_dark.btnBackground
                : Colors.button.submit_primary_dark.btnBackgroundDisabled,
              alignSelf: "center",
              borderRadius: 4,
              padding: 10,
              marginVertical: 10,
            }}
            onPress={
              isEditingMode
                ? () => setEnableSearch((preState) => !preState)
                : null
            }
          >
            <View style={{ justifyContent: "center", marginHorizontal: 3 }}>
              <MaterialCommunityIcons
                name="map-search-outline"
                size={24}
                color={Colors.on_primary_dark.low_constrast}
              />
            </View>
            <View style={{ justifyContent: "center", marginHorizontal: 3 }}>
              <ThaiBoldText
                style={{
                  fontSize: 20,
                  color: Colors.on_primary_dark.low_constrast,
                }}
              >
                {enableSearch ? " ถูกค้นหาได้" : " ถูกค้นหาไม่ได้"}
              </ThaiBoldText>
            </View>
          </TouchableOpacity>

          <SectionList
            sections={wasteListSectionFormat ? wasteListSectionFormat : []}
            refreshing={isLoading}
            keyExtractor={(item, index) => item + index} //item refer to each obj in each seaction
            renderItem={({ item, section: { type } }) => {
              let subtypeIndex = Object.keys(item)[0];
              let subtypeName = item[Object.keys(item)[0]].name;

              // Set price for showing
              let price = 0;
              let isUpdated = false;
              let isDefinedPrice = false;
              if (purchaseList[type]) {
                if (purchaseList[type][subtypeIndex]) {
                  if (purchaseList._count[type][subtypeIndex] != 0) {
                    //have an update
                    price = purchaseList._count[type][subtypeIndex];
                    isUpdated = true;
                  } else {
                    price = purchaseList[type][Object.keys(item)[0]];
                    isUpdated = false;
                  }
                  isDefinedPrice = true;
                } else {
                  isDefinedPrice = false;
                }
              } else {
                isDefinedPrice = false;
              }

              return (
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 5,
                    padding: 10,
                    backgroundColor: Colors.on_primary_dark.low_constrast,
                    borderBottomColor: Colors.hard_secondary,
                    borderBottomWidth: 0.75,
                    marginBottom: 2,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "50%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <ThaiRegText
                        style={{
                          fontSize: 15,
                          color: Colors.soft_primary_bright,
                        }}
                      >
                        {subtypeName}
                      </ThaiRegText>
                    </View>
                    <View
                      style={{
                        width: "50%",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          borderWidth: 0.75,
                          width: "50%",
                          borderRadius: 3,
                          borderColor: Colors.soft_secondary,
                          backgroundColor: Colors.soft_secondary,
                          alignItems: "center",
                        }}
                      >
                        {!isEditingMode ? (
                          <ThaiRegText
                            style={{ textAlign: "center", fontSize: 15 }}
                          >
                            {(isDefinedPrice ? price : 0).toString()}
                          </ThaiRegText> // show price
                        ) : (
                          <TextInput
                            placeholder={price.toString()}
                            clearTextOnFocus={true}
                            selectTextOnFocus={true}
                            onChangeText={(price) => {
                              dispatch(
                                buyerAction.editPurchaseList(
                                  type,
                                  subtypeIndex,
                                  price
                                )
                              );
                            }}
                            keyboardType="numeric"
                            style={{
                              color: !isUpdated
                                ? Colors.primary_bright
                                : "black",
                              textAlign: "center",
                              fontSize: 15,
                            }}
                          />
                        )}
                      </View>
                      <ThaiRegText style={{ fontSize: 15 }}>
                        {" "}
                        บาท/ กก.
                      </ThaiRegText>
                    </View>
                  </View>
                </View>
              );
            }}
            renderSectionHeader={({ section: { type } }) => {
              return (
                <ThaiMdText
                  style={{ fontSize: 18, color: Colors.hard_primary_dark }}
                >
                  {type}
                </ThaiMdText>
              );
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
