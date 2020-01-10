import React, { useEffect, useState, useReducer, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Header } from "react-navigation-stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import * as sellerItemsAction from "../../store/actions/sellerItemsAction";
import ModalShowSellerItemsScreen from "../../components/ModalShowSellerItemsScreen";
import ThaiText from "../../components/ThaiText";
import AppVariableSetting from "../../constants/AppVariableSetting";
import TrashCard from "../../components/TrashCard";
import Colors from "../../constants/Colors";

import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import CustomButton from "../../components/UI/CustomButton";

const ADD_SELLERITEMS_AMOUNT = "ADD_SELLERITEMS_AMOUNT";
const MINUS_SELLERITEMS_AMOUNT = "MINUS_SELLERITEMS_AMOUNT";
const SET_LOCAL_SELLERITEMS = "SET_LOCAL_SELLERITEMS";
const EDIT_SELLERITEMS_AMOUNT = "EDIT_SELLERITEMS_AMOUNT";
const CANCEL = "CANCEL";
const UPDATE_LOCAL_SELLERITEMS = "UPDATE_LOCAL_SELLERITEMS";

const trashsModifyingReducer = (state, action) => {
  let sellerItems = state.sellerItems;

  switch (action.type) {
    case SET_LOCAL_SELLERITEMS:
      return {
        ...state,
        sellerItems: action.sellerItems,
        sellerItemsFlatListFormat: [...action.sellerItemsFlatListFormat]
      };
    case ADD_SELLERITEMS_AMOUNT:
      console.log("ADD_SELLERITEMS_AMOUNT Run");
      sellerItems.editCount(
        action.majortype,
        action.subtype,
        1 + sellerItems.getCountValueBySubtype(action.majortype, action.subtype)
      );
      return {
        ...state
      };
    case MINUS_SELLERITEMS_AMOUNT:
      console.log("MINUS_SELLERITEMS_AMOUNT Run");
      sellerItems.decreaseCount(action.majortype, action.subtype, 1);
      return {
        ...state
      };
    case EDIT_SELLERITEMS_AMOUNT:
      console.log("EDIT_SELLERITEMS_AMOUNT Run");
      sellerItems.editCount(action.majortype, action.subtype, action.value);
      return {
        ...state
      };
    case CANCEL:
      return {
        ...state
      };
    case UPDATE_LOCAL_SELLERITEMS:
      // sellerItems.confirm();
      // console.log(sellerItems);
      return {
        ...state,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat()
      };
    default:
      return { ...state };
  }
};

const ShowAllUserTrashScreen = props => {
  // For back behavior
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (editingMode) {
        setEditingMode(false);
        return true; //Prevent go back to homepage
      }
    });
    return () => {
      BackHandler.removeEventListener();
    };
  });

  /*-------------------- DATA -----------------*/
  // trash user snapshot
  const dispatch = useDispatch();
  // Callback fn
  const loadSellerItems = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(sellerItemsAction.fetchSellerItems());
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  // Load sellerItems and wasteType from firebase and store it to redux "initially"
  useEffect(() => {
    setIsLoading(true);
    loadSellerItems()
      .then(() => setIsLoading(false))
      .catch(err => {
        setIsLoading(false);
        setError(err.message);
      });
  }, [loadSellerItems]);

  // Get sellerItems and wasteTyp from redux
  const sellerItems = useSelector(state => {
    return state.sellerItems.sellerItems;
  });
  const sellerItemsFlatListFormat = useSelector(state => {
    return state.sellerItems.sellerItemsFlatListFormat;
  });
  const wasteTypes = useSelector(state => {
    return state.wasteType.wasteTypes;
  });

  const [trashsState, dispatchAmountTrashsState] = useReducer(
    trashsModifyingReducer,
    {
      sellerItems: {},
      sellerItemsFlatListFormat: []
    }
  );

  // If redux-data is ready, it will be passed to this local reducer
  useEffect(() => {
    if (sellerItems) {
      dispatchAmountTrashsState({
        type: SET_LOCAL_SELLERITEMS,
        sellerItems,
        sellerItemsFlatListFormat
      });
    }
  }, [sellerItems]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // error alert handling
  const [error, setError] = useState("");
  useEffect(() => {
    if (error) {
      Alert.alert("An error has occurred!", error, [{ text: "OK" }]);
      setError("");
    }
  }, [error]);

  const confirmHandlerTricker = useCallback(() => {
    confirmHandler();
  }, [trashsState, dispatchAmountTrashsState]);

  // For 'addWaste' handler
  const confirmHandler = useCallback(async () => {
    setEditingMode(false);
    setIsRefreshing(true);

    trashsState.sellerItems.confirm();
    // update new wasteData on local redux
    dispatchAmountTrashsState({
      type: UPDATE_LOCAL_SELLERITEMS
    });
    // update new wasteData on redux
    await dispatch(
      sellerItemsAction.updateSellerItems(trashsState.sellerItems) //getObject will be run in sellerItemsAction instead
    );
    setIsRefreshing(false);
  }, [trashsState, dispatchAmountTrashsState]);

  // provide for editing button when operation mode is changed to editing mode
  const [editingMode, setEditingMode] = useState(false);
  useEffect(() => {
    props.navigation.setParams({ editingMode });
    props.navigation.setParams({ setEditingMode });
    props.navigation.setParams({ confirmHandlerTricker });
  }, [editingMode, setEditingMode, confirmHandlerTricker]);

  //add spinner loading
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // if (modalVisible) {
  //   return (
  //     <ModalShowSellerItemsScreen
  //       setModalVisible={setModalVisible}
  //       data={wasteTypesRedux}
  //       modalVisible={modalVisible}
  //       addNewWasteHandler={(
  //         wasteType,
  //         wasteDescription,
  //         wasteDisposal,
  //         amount
  //       ) => {
  //         dispatchAmountTrashsState({
  //           type: ADD_WASTE,
  //           wasteType,
  //           wasteDescription,
  //           wasteDisposal,
  //           amount
  //         });
  //         setModalVisible(false);
  //       }}
  //     />
  //   );
  // }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <LinearGradient
        colors={Colors.linearGradientB}
        style={{
          ...styles.screen,
          width: wp("100%"),
          height:
            hp("100%") - Header.HEIGHT - AppVariableSetting.bottomBarHeight,
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: "100%",
            height: "85%",
            paddingHorizontal: 10,
            alignItems: "center"
          }}
        >
          <FlatList
            data={trashsState.sellerItemsFlatListFormat}
            refreshing={isRefreshing}
            onRefresh={loadSellerItems}
            style={{
              flex: 1
            }}
            keyExtractor={item => item.subtype}
            renderItem={({ item }) => {
              return (
                <TrashCard
                  imgUrl={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8jHyAAAAAbFxhYVVXV1dUYExXa2tpraWlcWVkgHB3x8fEvLCwNBAegn58FAAAVDxFvbW3i4eG3traJiIimpaW9vLx6eHmcm5vp6eljYWFCP0Dz8/Ovra4qJidOTEyGhYXIyMhST1A3MzRJRkd1c3PEw8SAf3+TGW0NAAAEd0lEQVR4nO2df1uyMBSGgykqSpBp+as0s/r+3/CN94qNUhiDeTwbz/2vwLWbPZwxQXd3BwAAAAAAAHCcx3stq/WtG9mJTZjoCIe3bmQnxlGgI4Uhb2AIQ/70yDA7GyVivwyzxfIv29grwwvD+kTA0AlgCEP+wBCG/JEj/uHv1N63Ed//u7YaYMgcGMKQPz0y9H60wBzfXWAIQ/7AEIb8gSEM+TMQnhs+hoHWMNrcoGG22GVxtWHRvUH4coOmWWKc/UjEyfTsw+ek+DB19p0hmdEgfDz/dCeKDo4G9G2zwvS1UMguXmpP6gQ4mtMPmdHscgwf5AaxkznVd9FO08nMUXW0+jJzO6fajObUFlvmfDbqHtXRzuVUXWL1tyzu5lQN59m8dkNVTwOn6umb6ppl/ZZTOe5nY5q2WWEXy4weddvW3/hwpXFGczYyp6Ez9fQtld1yr996GruX0/diXiT2TTZ3L6cyo0HYrDyOHbs/LdXRBhnNca2eqoyemu5SyunTNZtmh4Oso8mo8U6qnka7K7bNCiqj6ar5XmtVTx+u1zY7tMhozoszOV2ooVA/1pfZFA/841fW4/6wVUZzpqkb9XTbLqM5buR0oeqo+Vf1qp6+sq2npYwuzPdeRzKnH/bbZgdVR7dtduef01Idbfc4aaLqKcucjqRgm4zmrGUn8hz3T90ymlPK6afNptlhpcpM+0eeE1VP2Y37KqNJy4zmzOU8Knm21zY7yLE+DrocZsk2pyqjHf9A4CjrqWBVT0fyfdjk0O1I65TnuC/PvHjveuZ55vReteqt88EGMqczNjmdS8Hky8LRIn71tDR7tXG4Uk6bf9NzXdSbMd0zmnMqzhibP3YpDDMLGc2ZJ1wNrYWq5n2/2wBDY2BIDgyNgSE5MDQGhuTA0BgYkgNDY2BIDgyNgSE5MDQGhuT0yNDsRa9qHrgaiuOkir2+ewdq61nM1DAQlTRoaxrJrWt+W3sbpGE1DdqatdqLhv70of/Xof+1tAfjIQybAkNyYGgMDMmBoTEwJKdHht7fl4r9ZKDQvQL2NaiC79zi1/ww0f010iCpnE2ynR/+QugMJ1a+GaDhYh9mPvah/9eh/7W0B+MhDJsCQ3JgaAwMyYGhMTAkp0eG3t+X+v/80P9nwDXgOf43qRNz/Mpp+0l/HR7V1myvQ/9raQ/GQxg2BYbkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0Bobk+G/4UTTI1pIbR9svWXVl9fNP/5GtdVOKV/dCLkt4yIVSLa2XVqw8z2dxsmlhGEdWFrgoVlaK+Kz1KH/wGqeLzmsWz4/Fu7SpZl12Qj7luilBFnZGnq6I0QrPcl0/m2RsFtL5ZhTG+habwmas+I9ad9qeYMNVvalY2e7FZHNrpb+8pPrfJBgQ8hkpJMOZvW4UoaWFlSyznKWZEHFHhEiSLZdb7jOGh81p1pHTZsFlMbIKdtNOcLkVBQAAADzjH4W+XbnKuWNsAAAAAElFTkSuQmCC"
                  }
                  type={item.type}
                  subtype={item.subtype}
                  wasteDisposal={wasteTypes[item.type][item.subtype].disposal}
                  wasteDescription={
                    wasteTypes[item.type][item.subtype].description
                  }
                  amountShowing={
                    item.amount +
                    sellerItems.getCountValueBySubtype(item.type, item.subtype)
                  }
                  amountAdjust={sellerItems.getCountValueBySubtype(
                    item.type,
                    item.subtype
                  )}
                  trashAdjustPrice={
                    item.adjustedPrice ? item.adjustedPrice : "0.7-0.9"
                  }
                  style={styles.eachTrashCard}
                  editingMode={editingMode}
                  onIncrease={() =>
                    dispatchAmountTrashsState({
                      type: ADD_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type,
                      addAmount: 1
                    })
                  }
                  onDecrease={() => {
                    dispatchAmountTrashsState({
                      type: MINUS_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type,
                      minusAmount: 1
                    });
                  }}
                  onEdit={text => {
                    dispatchAmountTrashsState({
                      type: EDIT_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type,
                      value: text > 0 ? parseInt(text, 10) : 0 //not positive, Nan
                    });
                  }}
                />
              );
            }}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "15%",
            paddingBottom: getStatusBarHeight()
          }}
        >
          {editingMode ? (
            <View
              style={{
                width: "100%",
                height: "100%",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              <CustomButton
                btnColor={Colors.primary}
                onPress={() => {
                  setEditingMode(false);
                  dispatchAmountTrashsState({ type: "CANCEL" });
                }}
                btnTitleColor={Colors.on_primary}
                btnTitleFontSize={14}
                style={{ ...styles.navigateBtn }}
              >
                ยกเลิก
              </CustomButton>

              <CustomButton
                btnColor={Colors.on_primary}
                onPress={() => {
                  setModalVisible(true);
                }}
                btnTitleColor={Colors.on_primary}
                btnTitleFontSize={14}
                style={{
                  ...styles.navigateBtn
                }}
              >
                <ThaiText
                  style={{ fontSize: 12, color: Colors.primary_variant }}
                >
                  เพิ่มขยะ{"   "}
                </ThaiText>
                <AntDesign
                  name="plussquareo"
                  size={14}
                  color={Colors.primary_variant}
                />
              </CustomButton>
            </View>
          ) : (
            <CustomButton
              btnColor={Colors.primary_variant}
              onPress={() => {
                props.navigation.navigate({
                  routeName: "SellingTrashScreen",
                  params: { sellerItemsNew: trashsState.sellerItems }
                });
              }}
              btnTitleColor={Colors.on_primary}
              btnTitleFontSize={14}
              style={{ ...styles.navigateBtn }}
            >
              ขายขยะ
            </CustomButton>
          )}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

ShowAllUserTrashScreen.navigationOptions = navData => {
  let setEditingMode = navData.navigation.getParam("setEditingMode");
  let editingMode = navData.navigation.getParam("editingMode");
  let confirmHandlerTricker = navData.navigation.getParam(
    "confirmHandlerTricker"
  );

  return {
    headerTitle: "ขยะที่สะสมไว้",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        {editingMode ? (
          <Item
            title="Cart"
            iconName={"check"}
            onPress={confirmHandlerTricker}
          />
        ) : (
          <Item
            title="Cart"
            iconName={"square-edit-outline"}
            onPress={() => {
              setEditingMode(true);
            }}
          />
        )}
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.screen
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  navigateBtn: {
    width: "40%",
    height: "80%",
    borderRadius: 5,
    marginVertical: 5
  }
});

export default ShowAllUserTrashScreen;
