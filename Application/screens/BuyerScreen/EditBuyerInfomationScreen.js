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
const buyerWasteReducer = (state, action) => {
  switch (action.type) {
    case EDIT_PURCHASELIST:
      console.log("---> EDIT ---> action");
      console.log(action);
      return {
        ...state,
        purchaseListTemp: {
          ...state.purchaseListTemp,
          [action.index]: parseInt(action.value, 10)
        }
      };
    case UPDATE_PURCHASELIST:
      return state;
    default:
      return state;
  }
};

export default BuyerHomepageScreen = props => {
  // initially fetch
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(wasteTypeAction.fetchWasteType());
  }, []);

  const wasteTypesList = useSelector(state => state.waste.wasteTypesList);
  const purchaseList = useSelector(state => state.waste.purchaseList);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const [buyerWasteState, dispatchBuyerWaste] = useReducer(buyerWasteReducer, {
    purchaseList,
    purchaseListTemp: { ...purchaseList }
  });

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

  const editPriceHandler = (text, index) => {
    console.log("Edit Price");
    console.log(text);
    dispatchBuyerWaste({ type: EDIT_PURCHASELIST, index, value: text });
    console.log(buyerWasteState);
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
            แก้ไขราคา
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
            sections={
              isEditingMode ? buyerWasteState.purchaseListTemp : wasteTypesList
            }
            keyExtractor={(item, index) => item + index} //item refer to each obj in each seaction
            renderItem={({ item, section: { value } }) => {
              return (
                <View
                  style={{
                    width: "100%",
                    height: 100,
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
                    <View style={{ width: "80%" }}>
                      <ThaiText>{item.value}</ThaiText>
                    </View>
                    <View style={{ width: "20%" }}>
                      <MaterialIcons
                        // name={
                        //   isSelected ? "check-box" : "check-box-outline-blank"
                        // }
                        name="check-box"
                        size={15}
                        color={Colors.primary}
                      />
                    </View>
                  </View>

                  {/* Row 2 */}
                  <View
                    style={{
                      width: "100%",
                      height: "50%",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                        flexDirection: "row"
                      }}
                    >
                      <View
                        style={{
                          borderWidth: 0.75,
                          borderColor: Colors.lineSeparate
                        }}
                      >
                        <TextInput
                          value={buyerWasteState.purchaseList[
                            item.value
                          ].toString()}
                          onChangeText={text =>
                            editPriceHandler(text, item.value)
                          }
                          keyboardType="numeric"
                        />
                      </View>
                      <ThaiText> บาท/ กก.</ThaiText>
                    </View>

                    <CustomButton
                      style={{
                        width: "30%",
                        height: "100%",
                        borderRadius: 5
                      }}
                      btnColor={Colors.error}
                      onPress={null}
                      btnTitleColor={Colors.on_primary}
                      btnTitleFontSize={10}
                    >
                      ลบออก
                    </CustomButton>
                  </View>
                </View>
              );
            }}
            renderSectionHeader={({ section: { value } }) => {
              return <ThaiTitleText>{value}</ThaiTitleText>;
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
