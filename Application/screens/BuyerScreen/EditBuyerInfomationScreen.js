import React, { useEffect, useState, useReducer } from "react";
import { StyleSheet, View, SectionList, TextInput } from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";

import * as wasteTypeAction from "../../store/actions/wasteTypeAction";

import ThaiTitleText from "../../components/ThaiTitleText";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AppVariableSetting from "../../constants/AppVariableSetting";
import ThaiText from "../../components/ThaiText";
import CustomButton from "../../components/UI/CustomButton";

const EDIT_PURCHASELIST = "EDIT_PURCHASELIST";
const UPDATE_PURCHASELIST = "UPDATE_PURCHASELIST";
const SET_PURCHASELIST = "SET_PURCHASELIST";

const buyerWasteReducer = (state, action) => {
  let purchaseListObj = state.purchaseList;
  switch (action.type) {
    case SET_PURCHASELIST:
      console.log("SET_PURCHASELSIT Reducer - run");
      return {
        ...state,
        purchaseList: action.purchaseList
      }; //not work initially
    case EDIT_PURCHASELIST:
      console.log("purchaseListObj.getValueBySubtype(action.subtypeName)");
      console.log(purchaseListObj.getValueBySubtype(action.subtypeName));
      return {
        ...state,
        purchaseList
      };
    case UPDATE_PURCHASELIST:
      return state;
    default:
      return state;
  }
};

export default EditBuyerInfomationScreen = props => {
  // initially fetch
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(wasteTypeAction.fetchWasteType());
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const wasteListSectionFormat = useSelector(
    state => state.waste.wasteListSectionFormat
  ); //why its not update. ?
  const purchaseList = useSelector(state => state.waste.purchaseList); //not have
  const [isEditingMode, setIsEditingMode] = useState(false);

  const [buyerWasteState, dispatchBuyerWaste] = useReducer(
    buyerWasteReducer,
    {}
  );

  const toggleModeHandler = () => {
    if (isEditingMode) {
      // done edit
      setIsEditingMode(false);
      dispatch({ type: UPDATE_PURCHASELIST });
    } else {
      // start to edit
      setIsEditingMode(true);
    }
  };

  const editPriceHandler = (type, subtype, price) => {
    dispatchBuyerWaste({ type: EDIT_PURCHASELIST, type, subtype, price });
  };

  // if redux update, local redux update
  useEffect(() => {
    console.log("purchaseList");
    dispatchBuyerWaste({ type: SET_PURCHASELIST, purchaseList });
  }, [purchaseList]);

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight
        }}
      >
        <View style={{ height: "30%", width: "100%", backgroundColor: "red" }}>
          <CustomButton
            style={{
              width: "30%",
              height: "10%",
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
            sections={wasteListSectionFormat}
            refreshing={isLoading}
            keyExtractor={(item, index) => item + index} //item refer to each obj in each seaction
            renderItem={({ item, section: { type } }) => {
              let subtypeName = item[Object.keys(item)[0]].name;
              console.log(buyerWasteState.purchaseList);
              let price = Object.keys(buyerWasteState.purchaseList).length
                ? buyerWasteState.purchaseList[type][Object.keys(item)[0]]
                : purchaseList[type][Object.keys(item)[0]];

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
                  {/* Row 1 */}
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
                          <ThaiText>{price.toString()}</ThaiText> // show price
                        ) : (
                          <TextInput
                            value={price.toString()}
                            onChangeText={price =>
                              editPriceHandler(type, subtypeName, price)
                            }
                            keyboardType="numeric"
                          />
                        )}
                      </View>
                      <ThaiText> บาท/ กก.</ThaiText>
                    </View>
                    {!isEditingMode ? null : (
                      <View style={{ width: "20%" }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            dispatchBuyerWaste();
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
