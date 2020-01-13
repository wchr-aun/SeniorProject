import React, { useEffect, useState, useReducer, useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  FlatList,
  BackHandler
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";

import * as sellerItemsAction from "../../store/actions/sellerItemsAction";
import TrashCardForSell from "../../components/TrashCardForSell";
import TrashCard from "../../components/TrashCard";

const SELECT_ITEM = "SELECT_ITEM";
const ADD_AMOUNT_FORSELL = "ADD_AMOUNT_FORSELL";
const MINUS_AMOUNT_FORSELL = "MINUS_AMOUNT_FORSELL";
const EDIT_AMOUNT_FORSELL = "EDIT_AMOUNT_FORSELL";
const SET_LOCAL_SELLERITEMS = "SET_LOCAL_SELLERITEMS";

const trashSellingReducer = (state, action) => {
  let sellerItems = state.sellerItems;

  switch (action.type) {
    case SET_LOCAL_SELLERITEMS:
      return {
        ...state,
        sellerItems: action.sellerItems,
        sellerItemsFlatListFormat: [...action.sellerItemsFlatListFormat]
      };
    // case SELECT_ITEM:
    //   console.log("action.preIsSelected");
    //   return {
    //     ...state
    //   };
    case ADD_AMOUNT_FORSELL:
      console.log("ADD_WASTE local Reducer Run");
      sellerItems.incrementalValue(
        action.majortype,
        action.subtype,
        action.addAmount
      );
      return {
        ...state
      };
    case MINUS_AMOUNT_FORSELL:
      console.log("MINUS_WASTE local Reducer Run");
      sellerItems.incrementalValue(
        action.majortype,
        action.subtype,
        -action.minusAmount
      );
      return {
        ...state
      };
    case EDIT_AMOUNT_FORSELL:
      console.log("EDIT_AMOUNT_FORSELL local Reducer Run");
      sellerItems.editValue(
        action.majortype,
        action.subtype,
        action.value - sellerItems[action.majortype][action.subtype]
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
    trashSellingReducer,
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

  const [isRefreshing, setIsRefreshing] = useState(false);
  // Callback fn
  const loadSellerItems = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(sellerItemsAction.fetchSellerItems());
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  const dispatch = useDispatch();

  return (
    <View
      style={{
        ...styles.screen,
        flex: 1,
        alignItems: "center"
      }}
    >
      <View
        style={{
          ...styles.allTrashContainer,
          width: "100%",
          height: "80%",
          padding: 10,
          alignItems: "center"
        }}
      >
        <View style={{ width: "100%", height: "100%" }}>
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
                  wasteDisposal={
                    wasteTypes[item.type][item.subtype]["disposal"]
                  }
                  wasteDescription={
                    wasteTypes[item.type][item.subtype]["description"]
                  }
                  changeAmount={sellerItems._count[item.type][item.subtype]}
                  oldAmount={item.amount}
                  trashAdjustPrice={
                    item.adjustedPrice ? item.adjustedPrice : "0.7-0.9"
                  }
                  style={styles.eachTrashCard}
                  editingMode={true}
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
                />
              );
            }}
          />
          <View>
            <Button
              title={"Sell"}
              onPress={() => {
                console.log(trashsState.sellerItems);
                dispatch(
                  sellerItemsAction.setSellerItemsForSell(
                    trashsState.sellerItems
                  )
                );
                props.navigation.navigate("chooseBuyerForSellScreen");
              }}
            ></Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.screen
  },
  allTrashContainer: {
    backgroundColor: Colors.primary_variant,
    borderRadius: 10
  },
  eachTrashCard: {
    marginBottom: 5,
    width: "100%",
    height: 100,
    backgroundColor: Colors.on_primary,
    borderRadius: 10
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" }
});
