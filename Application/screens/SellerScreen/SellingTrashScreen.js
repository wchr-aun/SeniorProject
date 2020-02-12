import React, { useEffect, useState, useReducer, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  BackHandler,
  KeyboardAvoidingView
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { NavigationEvents } from "react-navigation";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons
} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";

import * as sellerItemsAction from "../../store/actions/sellerItemsAction";
import TrashCardForSell from "../../components/TrashCardForSell";
import CustomButton from "../../components/UI/CustomButton";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import ThaiRegText from "../../components/ThaiRegText";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import { LinearGradient } from "expo-linear-gradient";
import ModalLoading from "../../components/ModalLoading";

const SELECT_ITEM = "SELECT_ITEM";
const ADD_AMOUNT_FORSELL = "ADD_AMOUNT_FORSELL";
const MINUS_AMOUNT_FORSELL = "MINUS_AMOUNT_FORSELL";
const EDIT_AMOUNT_FORSELL = "EDIT_AMOUNT_FORSELL";
const SET_LOCAL_SELLERITEMS = "SET_LOCAL_SELLERITEMS";

const trashSellingReducer = (state, action) => {
  let sellerItemsForSell = state.sellerItemsForSell;

  switch (action.type) {
    case SET_LOCAL_SELLERITEMS:
      let sellerItemsCloned = Object.assign(
        Object.create(action.sellerItemsForSell),
        action.sellerItemsForSell
      );
      return {
        ...state,
        sellerItemsForSell: sellerItemsCloned,
        sellerItemsFlatListFormat: [...action.sellerItemsFlatListFormat]
      };
    case ADD_AMOUNT_FORSELL:
      console.log("ADD_WASTE local Reducer Run");
      if (sellerItemsForSell._count[action.majortype][action.subtype] < 0)
        sellerItemsForSell.incrementalValue(
          action.majortype,
          action.subtype,
          action.addAmount
        );
      return {
        ...state
      };
    case MINUS_AMOUNT_FORSELL:
      console.log("MINUS_WASTE local Reducer Run");
      if (
        sellerItemsForSell[action.majortype][action.subtype] +
          sellerItemsForSell._count[action.majortype][action.subtype] >
        0
      ) {
        sellerItemsForSell.incrementalValue(
          action.majortype,
          action.subtype,
          -action.minusAmount
        );
      }
      return {
        ...state
      };
    case SELECT_ITEM:
      console.log("SELECT_ITEM local Reducer Run");
      sellerItemsForSell.selectedToggle(action.majortype, action.subtype);
      return {
        ...state
      };
    case EDIT_AMOUNT_FORSELL:
      console.log("EDIT_AMOUNT_FORSELL local Reducer Run");
      sellerItemsForSell.editValue(
        action.majortype,
        action.subtype,
        action.value - sellerItemsForSell[action.majortype][action.subtype]
      );
      return {
        ...state
      };
    default:
      return { ...state };
  }
};

export default SellingTrashScreen = props => {
  const [isInOperation, setIsInOperation] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isOperationCompleted = useSelector(
    state => state.navigation.isOperationCompleted
  );

  //add spinner loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary_bright_variant} />
      </View>
    );
  }

  // for refreshing
  const checkIsOperationCompleted = () => {
    if (isOperationCompleted === true) {
      props.navigation.navigate("ShowSellerItemsScreen");
    } else {
      setIsLoading(true);
      refreshSellerItems();
      setIsLoading(false);
    }
  };

  const dispatch = useDispatch();
  // For back behavior
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      props.navigation.navigate("ShowAllUserTrashScreen");
      return true; //Prevent go back to homepage
    });
    return () => {
      BackHandler.removeEventListener();
    };
  });

  // Get data from redux
  const [distance, setDistance] = useState("10");
  const sellerItemsForSell = useSelector(state => {
    return state.sellerItems.sellerItemsForSell;
  });
  const sellerItemsFlatListFormat = useSelector(state => {
    return state.sellerItems.sellerItemsFlatListFormat;
  });
  const wasteTypes = useSelector(state => {
    return state.wasteType.wasteTypes;
  });
  const [trashsState, dispatchAmountTrashsState] = useReducer(
    trashSellingReducer,
    {
      sellerItemsForSell,
      sellerItemsFlatListFormat //becuase these are already loaded in showAllSellerTrash
    }
  );

  // Callback fn
  const refreshSellerItems = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(sellerItemsAction.fetchSellerItems());
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  const setSellerItemsForSell = useCallback(async () => {
    trashsState.sellerItemsForSell.confirmValue();
    setIsInOperation(true);
    await dispatch(
      sellerItemsAction.setSellerItemsForSell(trashsState.sellerItemsForSell)
    );
    setIsInOperation(false);
    props.navigation.navigate({
      routeName: "chooseBuyerForSellScreen",
      params: { distance }
    });
  }, [trashsState.sellerItemsForSell, distance, dispatch]);

  // If redux-data is ready, it will be passed to this local reducer
  useEffect(() => {
    if (sellerItemsForSell && sellerItemsFlatListFormat.length) {
      dispatchAmountTrashsState({
        type: SET_LOCAL_SELLERITEMS,
        sellerItemsForSell,
        sellerItemsFlatListFormat
      });
    }
  }, [sellerItemsForSell, sellerItemsFlatListFormat]);

  return (
    <View style={{ flex: 1 }}>
      <CustomStatusBar />
      <NavigationEvents onWillFocus={checkIsOperationCompleted} />
      <LinearGradient
        colors={Colors.linearGradientBright}
        style={{
          ...styles.screen,
          width: wp("100%"),
          height: hp("100%"),
          alignItems: "center"
        }}
      >
        <ModalLoading modalVisible={isInOperation} userRole="seller" />
        <KeyboardAvoidingView
          style={{ width: "100%", height: "100%" }}
          behavior={"padding"}
        >
          <View
            style={{
              width: "100%",
              height: "10%",
              flexDirection: "row",
              backgroundColor: Colors.soft_primary_dark,
              paddingVertical: 10,
              alignItems: "center"
            }}
          >
            <View
              style={{ width: "100%", height: "100%", alignItems: "center" }}
            >
              <ThaiBoldText
                style={{
                  color: Colors.on_primary_dark.low_constrast,
                  fontSize: 20
                }}
              >
                เลือกขยะที่ต้องการขายพร้อมจำนวน
              </ThaiBoldText>
            </View>
          </View>
          <View
            style={{
              ...styles.allTrashContainer,
              width: "100%",
              height: "70%",
              alignItems: "center"
            }}
          >
            <View style={{ width: "100%", height: "100%" }}>
              <FlatList
                data={trashsState.sellerItemsFlatListFormat}
                refreshing={isRefreshing}
                onRefresh={refreshSellerItems}
                style={{
                  flex: 1
                }}
                keyExtractor={item => item.subtype}
                renderItem={({ item }) => {
                  return (
                    <TrashCardForSell
                      sellingMode={true}
                      imgUrl={wasteTypes[item.type][item.subtype]["imgUrl"]}
                      wasteName={wasteTypes[item.type][item.subtype]["name"]}
                      wasteDisposal={
                        wasteTypes[item.type][item.subtype]["disposal"]
                      }
                      wasteDescription={
                        wasteTypes[item.type][item.subtype]["description"]
                      }
                      selected={
                        trashsState.sellerItemsForSell._selected[item.type]
                          ? trashsState.sellerItemsForSell._selected[item.type][
                              item.subtype
                            ]
                          : false
                      }
                      changeAmount={
                        trashsState.sellerItemsForSell._count[item.type]
                          ? trashsState.sellerItemsForSell._count[item.type][
                              item.subtype
                            ]
                          : 0
                      }
                      oldAmount={item.amount}
                      sellerItemAdjustPrice={
                        wasteTypes[item.type][item.subtype]["price"]
                      }
                      style={styles.eachTrashCard}
                      onIncrease={() =>
                        dispatchAmountTrashsState({
                          type: ADD_AMOUNT_FORSELL,
                          subtype: item.subtype,
                          majortype: item.type,
                          addAmount: 1
                        })
                      }
                      onDecrease={() => {
                        dispatchAmountTrashsState({
                          type: MINUS_AMOUNT_FORSELL,
                          subtype: item.subtype,
                          majortype: item.type,
                          minusAmount: 1
                        });
                      }}
                      onEdit={text => {
                        dispatchAmountTrashsState({
                          type: EDIT_AMOUNT_FORSELL,
                          subtype: item.subtype,
                          majortype: item.type,
                          value: text > 0 ? parseInt(text, 10) : 0 //not positive, Nan
                        });
                      }}
                      onSelected={() => {
                        // put the amouth of this trash into state
                        dispatchAmountTrashsState({
                          type: SELECT_ITEM,
                          majortype: item.type,
                          subtype: item.subtype
                        });
                      }}
                    />
                  );
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: "20%",
              justifyContent: "space-around",
              alignItems: "center",
              paddingBottom: getStatusBarHeight()
            }}
          >
            <View
              style={{
                width: "100%",
                height: "30%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ThaiRegText
                style={{
                  fontSize: 12,
                  color: Colors.on_primary_bright.low_constrast
                }}
              >
                ค้นหาผู้รับซื้อในระยะ{" "}
              </ThaiRegText>
              <TextInput
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  color: Colors.on_primary_bright.low_constrast
                }}
                value={distance}
                selectTextOnFocus={true}
                onChangeText={value => {
                  setDistance(value.toString());
                }}
                keyboardType="number-pad"
              />
              <ThaiRegText
                style={{
                  fontSize: 12,
                  color: Colors.on_primary_bright.low_constrast
                }}
              >
                {" "}
                กิโลเมตร
              </ThaiRegText>
            </View>

            <View
              style={{
                height: "70%",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                padding: 5
              }}
            >
              <CustomButton
                style={{
                  width: "40%",
                  height: "80%",
                  maxHeight: 40,
                  borderRadius: 8
                }}
                btnColor={Colors.button.cancel.btnBackground}
                onPress={() => props.navigation.goBack()}
                btnTitleColor={Colors.button.cancel.btnText}
                btnTitleFontSize={14}
              >
                <Ionicons
                  name={"ios-arrow-back"}
                  size={12}
                  color={Colors.button.cancel.btnText}
                />
                <ThaiRegText
                  style={{
                    fontSize: 12
                  }}
                >
                  {` ย้อนกลับ`}
                </ThaiRegText>
              </CustomButton>

              <CustomButton
                style={{
                  width: "40%",
                  height: "80%",
                  maxHeight: 40,
                  borderRadius: 8
                }}
                btnColor={Colors.button.start_operation_info.btnBackground}
                onPress={setSellerItemsForSell}
                btnTitleColor={Colors.button.start_operation_info.btnText}
                btnTitleFontSize={14}
              >
                <MaterialCommunityIcons
                  name={"account-search"}
                  size={12}
                  color={Colors.button.start_operation_info.btnText}
                />
                <ThaiRegText
                  style={{
                    fontSize: 12
                  }}
                >
                  {` ค้นหาผู้รับซื้อขยะ`}
                </ThaiRegText>
              </CustomButton>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  eachTrashCard: {
    marginBottom: 5,
    width: "100%",
    height: 100
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" }
});
