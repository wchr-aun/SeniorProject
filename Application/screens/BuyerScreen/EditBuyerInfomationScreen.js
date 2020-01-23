import React, { useEffect, useState, useReducer, useCallback } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import { MaterialIcons } from "@expo/vector-icons";
import * as buyerAction from "../../store/actions/buyerAction";

import ThaiTitleText from "../../components/ThaiTitleText";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AppVariableSetting from "../../constants/AppVariableSetting";
import ThaiText from "../../components/ThaiText";
import CustomButton from "../../components/UI/CustomButton";

export default EditBuyerInfomationScreen = props => {
  // initially fetch
  const dispatch = useDispatch();

  // load data
  const loadBuyerInfo = async () => {
    setIsLoading(true);
    await dispatch(buyerAction.fetchBuyerInfo());
    setIsLoading(false);
  };
  useEffect(() => {
    loadBuyerInfo();
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  // ------------- DATA ------------- //
  const wasteListSectionFormat = useSelector(
    state => state.buyerInfo.wasteListSectionFormat
  );
  const purchaseList = useSelector(state => state.buyerInfo.purchaseList); // sure data is ready
  const buyerUserInfo = useSelector(state => state.user.userProfile);

  const [isEditingMode, setIsEditingMode] = useState(false);

  const toggleModeHandler = () => {
    if (isEditingMode) {
      // done edit
      let description = "temp";
      purchaseList.confirmValue();

      dispatch(
        buyerAction.updatePurchaseList(
          purchaseList,
          description,
          buyerUserInfo.addr
        )
      );
      setIsEditingMode(false);
    } else {
      // start to edit
      setIsEditingMode(true);
    }
  };

  return (
    <View>
      <CustomStatusBar />
      <KeyboardAvoidingView
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight
        }}
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <View
          style={{
            height: "30%",
            width: "100%",
            backgroundColor: "red",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <CustomButton
            style={{
              width: "30%",
              height: "20%",
              marginHorizontal: 5,
              borderRadius: 5,
              borderColor: Colors.primary,
              borderWidth: 0.75
            }}
            btnColor={Colors.on_primary}
            onPress={toggleModeHandler}
            btnTitleColor={Colors.primary}
            btnTitleFontSize={10}
          >
            {isEditingMode ? "ยืนยันการแก้ไข" : "แก้ไขราคา"}
          </CustomButton>
        </View>
        <View
          style={{
            width: "100%",
            height: "70%",
            paddingBottom: getStatusBarHeight()
          }}
        >
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
                    backgroundColor: Colors.on_primary,
                    padding: 10,
                    borderBottomColor: Colors.lineSeparate,
                    borderBottomWidth: 0.75
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "50%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <View style={{ width: "20%" }}>
                      <ThaiText>{subtypeName}</ThaiText>
                    </View>
                    <View
                      style={{
                        width: "60%",
                        flexDirection: "row"
                      }}
                    >
                      <View
                        style={{
                          borderWidth: 0.75,
                          borderColor: Colors.lineSeparate,
                          width: "50%"
                        }}
                      >
                        {!isEditingMode ? (
                          <ThaiText>
                            {(isDefinedPrice ? price : 0).toString()}
                          </ThaiText> // show price
                        ) : (
                          <TextInput
                            placeholder={price.toString()}
                            clearTextOnFocus={true}
                            selectTextOnFocus={true}
                            onChangeText={price => {
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
                              color: isUpdated
                                ? Colors.primary_variant
                                : "black"
                            }}
                          />
                        )}
                      </View>
                      <ThaiText> บาท/ กก.</ThaiText>
                    </View>
                    {!isEditingMode ? null : (
                      <View style={{ width: "20%" }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            console.log("check click");
                          }}
                        >
                          <MaterialIcons
                            name={
                              price ? "check-box" : "check-box-outline-blank"
                            }
                            size={15}
                            color={Colors.primary_variant}
                          />
                        </TouchableWithoutFeedback>
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
            renderSectionHeader={({ section: { type } }) => {
              return <ThaiTitleText>{type}</ThaiTitleText>;
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8
  },
  header: {
    fontSize: 32
  },
  title: {
    fontSize: 24
  }
});
