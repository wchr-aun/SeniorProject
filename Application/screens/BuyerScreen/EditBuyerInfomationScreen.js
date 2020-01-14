import React, { useEffect, useState, useReducer, useCallback } from "react";
import { StyleSheet, View, SectionList, TextInput } from "react-native";
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
      purchaseList.confirmValue();
      // done edit
      let description = "temp";
      dispatch(
        buyerAction.updatePurchaseList(
          purchaseList.getObject(),
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

  const editPurchaseList = (majortype, subtype, price) => {
    console.log(majortype);
    console.log(subtype);
    console.log(price);
    purchaseList.editValue(majortype, subtype, price);
  };

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight
        }}
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

              // Set price
              let price = "";
              let isUpdated = false;
              if (purchaseList[type]) {
                if (purchaseList[type][subtypeIndex]) {
                  if (purchaseList._count[type][subtypeIndex] != 0) {
                    price = purchaseList._count[type][subtypeIndex]; //have an update
                    isUpdated = true;
                  } else {
                    price = purchaseList[type][Object.keys(item)[0]];
                    isUpdated = false;
                  }
                } else {
                  price = "ยังไม่กำหนดราคา";
                }
              } else {
                price = "ยังไม่กำหนดราคา";
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
                          <ThaiText>{(price ? price : 0).toString()}</ThaiText> // show price
                        ) : (
                          <TextInput
                            value={(price ? price : 0).toString()}
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
      </View>
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
