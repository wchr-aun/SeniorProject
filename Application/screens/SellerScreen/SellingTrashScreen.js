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
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";

import * as sellerItemsAction from "../../store/actions/sellerItemsAction";
import TrashCardForSell from "../../components/TrashCardForSell";
import CustomButton from "../../components/UI/CustomButton";
import { TextInput } from "react-native-gesture-handler";
import ThaiRegText from "../../components/ThaiRegText";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import { LinearGradient } from "expo-linear-gradient";
import AppVariableSetting from "../../constants/AppVariableSetting";

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
  // Get User trash
  // Get sellerItems and wasteTyp from redux
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

  const [isRefreshing, setIsRefreshing] = useState(false);
  // Callback fn
  const refreshSellerItems = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(sellerItemsAction.fetchSellerItems());
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  const setSellerItemsForSell = useCallback(() => {
    trashsState.sellerItemsForSell.confirmValue();
    dispatch(
      sellerItemsAction.setSellerItemsForSell(trashsState.sellerItemsForSell)
    );
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
  const dispatch = useDispatch();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
      behavior={"padding"}
    >
      <CustomStatusBar />
      <LinearGradient
        colors={Colors.linearGradient}
        style={{
          ...styles.screen,
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight,
          alignItems: "center"
        }}
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
          <View style={{ width: "70%", height: "100%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_primary_dark.low_constrast,
                fontSize: 26
              }}
            >
              จำนวนขยะที่คุณมี
            </ThaiBoldText>
          </View>
        </View>
        <View
          style={{
            ...styles.allTrashContainer,
            width: "100%",
            height: "70%",
            padding: 10,
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
                    imgUrl={
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8jHyAAAAAbFxhYVVXV1dUYExXa2tpraWlcWVkgHB3x8fEvLCwNBAegn58FAAAVDxFvbW3i4eG3traJiIimpaW9vLx6eHmcm5vp6eljYWFCP0Dz8/Ovra4qJidOTEyGhYXIyMhST1A3MzRJRkd1c3PEw8SAf3+TGW0NAAAEd0lEQVR4nO2df1uyMBSGgykqSpBp+as0s/r+3/CN94qNUhiDeTwbz/2vwLWbPZwxQXd3BwAAAAAAAHCcx3stq/WtG9mJTZjoCIe3bmQnxlGgI4Uhb2AIQ/70yDA7GyVivwyzxfIv29grwwvD+kTA0AlgCEP+wBCG/JEj/uHv1N63Ed//u7YaYMgcGMKQPz0y9H60wBzfXWAIQ/7AEIb8gSEM+TMQnhs+hoHWMNrcoGG22GVxtWHRvUH4coOmWWKc/UjEyfTsw+ek+DB19p0hmdEgfDz/dCeKDo4G9G2zwvS1UMguXmpP6gQ4mtMPmdHscgwf5AaxkznVd9FO08nMUXW0+jJzO6fajObUFlvmfDbqHtXRzuVUXWL1tyzu5lQN59m8dkNVTwOn6umb6ppl/ZZTOe5nY5q2WWEXy4weddvW3/hwpXFGczYyp6Ez9fQtld1yr996GruX0/diXiT2TTZ3L6cyo0HYrDyOHbs/LdXRBhnNca2eqoyemu5SyunTNZtmh4Oso8mo8U6qnka7K7bNCiqj6ar5XmtVTx+u1zY7tMhozoszOV2ooVA/1pfZFA/841fW4/6wVUZzpqkb9XTbLqM5buR0oeqo+Vf1qp6+sq2npYwuzPdeRzKnH/bbZgdVR7dtduef01Idbfc4aaLqKcucjqRgm4zmrGUn8hz3T90ymlPK6afNptlhpcpM+0eeE1VP2Y37KqNJy4zmzOU8Knm21zY7yLE+DrocZsk2pyqjHf9A4CjrqWBVT0fyfdjk0O1I65TnuC/PvHjveuZ55vReteqt88EGMqczNjmdS8Hky8LRIn71tDR7tXG4Uk6bf9NzXdSbMd0zmnMqzhibP3YpDDMLGc2ZJ1wNrYWq5n2/2wBDY2BIDgyNgSE5MDQGhuTA0BgYkgNDY2BIDgyNgSE5MDQGhuT0yNDsRa9qHrgaiuOkir2+ewdq61nM1DAQlTRoaxrJrWt+W3sbpGE1DdqatdqLhv70of/Xof+1tAfjIQybAkNyYGgMDMmBoTEwJKdHht7fl4r9ZKDQvQL2NaiC79zi1/ww0f010iCpnE2ynR/+QugMJ1a+GaDhYh9mPvah/9eh/7W0B+MhDJsCQ3JgaAwMyYGhMTAkp0eG3t+X+v/80P9nwDXgOf43qRNz/Mpp+0l/HR7V1myvQ/9raQ/GQxg2BYbkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0Bobk+G/4UTTI1pIbR9svWXVl9fNP/5GtdVOKV/dCLkt4yIVSLa2XVqw8z2dxsmlhGEdWFrgoVlaK+Kz1KH/wGqeLzmsWz4/Fu7SpZl12Qj7luilBFnZGnq6I0QrPcl0/m2RsFtL5ZhTG+habwmas+I9ad9qeYMNVvalY2e7FZHNrpb+8pPrfJBgQ8hkpJMOZvW4UoaWFlSyznKWZEHFHhEiSLZdb7jOGh81p1pHTZsFlMbIKdtNOcLkVBQAAADzjH4W+XbnKuWNsAAAAAElFTkSuQmCC"
                    }
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
                    trashAdjustPrice={
                      item.adjustedPrice ? item.adjustedPrice : "0.7-0.9"
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
              height: "50%",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <ThaiRegText>ค้นหาผู้รับซื้อในระยะ </ThaiRegText>
            <TextInput
              value={distance}
              selectTextOnFocus={true}
              onChangeText={value => {
                setDistance(value.toString());
              }}
              keyboardType="number-pad"
            />
            <ThaiRegText> กิโลเมตร</ThaiRegText>
          </View>

          <CustomButton
            style={{ width: "60%", height: "50%", borderRadius: 8 }}
            btnColor={Colors.button.start_operation_info.btnBackground}
            onPress={setSellerItemsForSell}
            btnTitleColor={Colors.button.start_operation_info.btnText}
            btnTitleFontSize={14}
          >
            <MaterialCommunityIcons
              name={"account-search"}
              size={12}
              color={Colors.button.submit_primary_bright.btnBackground}
            />
            <ThaiRegText
              style={{
                fontSize: 12,
                color: Colors.button.submit_primary_bright.btnText
              }}
            >
              ค้นหาผู้รับซื้อขยะ
            </ThaiRegText>
          </CustomButton>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  eachTrashCard: {
    marginBottom: 5,
    width: "100%",
    height: 100,
    borderRadius: 10
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" }
});
