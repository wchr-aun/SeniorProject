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

const SELECT_ITEM = "SELECT_ITEM";
const ADD_AMOUNT_FORSELL = "ADD_AMOUNT_FORSELL";
const MINUS_AMOUNT_FORSELL = "MINUS_AMOUNT_FORSELL";
const EDIT_AMOUNT_FORSELL = "EDIT_AMOUNT_FORSELL";
const SET_WASTE = "SET_WASTE";

const trashSellingReducer = (state, action) => {
  let sellerItems = [...state.sellerItems];
  let sellerItem = "";
  let targetIndex = "";

  switch (action.type) {
    case SET_WASTE:
      console.log("SET WASTE local Reducer Run");
      const updatedSellerItems = [...action.sellerItems];
      updatedSellerItems.forEach((item, index) => {
        updatedSellerItems[index].amountForSell = 0;
        updatedSellerItems[index].UI_PlusDisabled = false; //because initially, amountForSell equal to
        updatedSellerItems[index].UI_MinusDisabled = false;
      });
      return {
        ...state,
        sellerItems: [...action.sellerItems]
      };
    case SELECT_ITEM:
      console.log("action.preIsSelected");
      console.log(action.preIsSelected);
      sellerItem = sellerItems.filter(
        item => item.wasteType === action.wasteType
      )[0];

      if (action.preIsSelected) {
        sellerItem.amountForSell = 0;
        sellerItem.UI_PlusDisabled = false;
        sellerItem.UI_PlusDisabled = false;
      } else {
        sellerItem.amountForSell = sellerItem.amount;
        sellerItem.UI_PlusDisabled = true;
      }

      return {
        ...state,
        sellerItems: [...sellerItems]
      };

    case ADD_AMOUNT_FORSELL:
      console.log("ADD_WASTE local Reducer Run");
      sellerItem = sellerItems.filter(
        item => item.wasteType === action.wasteType
      )[0];

      // add + 1 to amount for selling
      sellerItem.amountForSell = sellerItem.amountForSell + 1;
      sellerItem.UI_MinusDisabled = false;

      // if amountForSell = amount, plus btn can't be press
      if (sellerItem.amountForSell === sellerItem.amount)
        sellerItem.UI_PlusDisabled = true;

      return {
        ...state,
        sellerItems: sellerItems
      };
    case MINUS_AMOUNT_FORSELL:
      console.log("MINUS_WASTE local Reducer Run");
      sellerItem = sellerItems.filter(
        item => item.wasteType === action.wasteType
      )[0];

      // add + 1 to amount for selling
      sellerItem.amountForSell = sellerItem.amountForSell - 1;
      sellerItem.UI_PlusDisabled = false;

      // if amountForSell = amount, plus btn can't be press
      if (sellerItem.amountForSell - 1 === -1)
        //if amount for sell --> 0
        sellerItem.UI_MinusDisabled = true;
      return {
        ...state,
        sellerItems: sellerItems
      };
    case EDIT_AMOUNT_FORSELL:
      // edit from text-input
      console.log("EDIT_AMOUNT_FORSELL local Reducer Run");
      sellerItem = sellerItems.filter(
        item => item.wasteType === action.wasteType
      )[0];

      if (action.value <= sellerItem.amount)
        sellerItem.amountForSell = action.value;
      else sellerItem.amountForSell = sellerItem.amount;

      sellerItem.UI_MinusDisabled =
        sellerItem.amountForSell - 1 === -1 ? true : false;

      sellerItem.UI_PlusDisabled =
        sellerItem.amountForSell === sellerItem.amount ? true : false;

      return {
        ...state,
        sellerItems: [...sellerItems]
      };
  }
  return state;
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
  // Get User
  const userProfile = useSelector(state => {
    return state.userProfile.user;
  });
  // Get User trash
  const userTrashsFromRedux = useSelector(reducers => {
    return reducers.sellerItems.sellerItems;
  });

  const [trashsState, dispatchAmountTrashsState] = useReducer(
    trashSellingReducer,
    {
      sellerItems: []
    }
  );

  // initially, get data from redux and store it to local redux
  useEffect(() => {
    dispatchAmountTrashsState({
      type: SET_WASTE,
      sellerItems: userTrashsFromRedux
    });
  }, [userTrashsFromRedux, dispatchAmountTrashsState]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  // Callback fn
  const loadSellerItems = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(sellerItemsAction.fetchSellerItems());
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  const dispatch = useDispatch();

  // When redux updated, this local redux also be updated
  useEffect(() => {
    dispatchAmountTrashsState({
      type: SET_WASTE,
      sellerItems: [...userTrashsFromRedux]
    });
  }, [userTrashsFromRedux]);

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
            style={{
              flex: 1
            }}
            refreshing={isRefreshing}
            onRefresh={loadSellerItems}
            data={trashsState.sellerItems}
            keyExtractor={item => item.wasteType}
            renderItem={itemData => (
              <TrashCardForSell
                imgUrl={
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8jHyAAAAAbFxhYVVXV1dUYExXa2tpraWlcWVkgHB3x8fEvLCwNBAegn58FAAAVDxFvbW3i4eG3traJiIimpaW9vLx6eHmcm5vp6eljYWFCP0Dz8/Ovra4qJidOTEyGhYXIyMhST1A3MzRJRkd1c3PEw8SAf3+TGW0NAAAEd0lEQVR4nO2df1uyMBSGgykqSpBp+as0s/r+3/CN94qNUhiDeTwbz/2vwLWbPZwxQXd3BwAAAAAAAHCcx3stq/WtG9mJTZjoCIe3bmQnxlGgI4Uhb2AIQ/70yDA7GyVivwyzxfIv29grwwvD+kTA0AlgCEP+wBCG/JEj/uHv1N63Ed//u7YaYMgcGMKQPz0y9H60wBzfXWAIQ/7AEIb8gSEM+TMQnhs+hoHWMNrcoGG22GVxtWHRvUH4coOmWWKc/UjEyfTsw+ek+DB19p0hmdEgfDz/dCeKDo4G9G2zwvS1UMguXmpP6gQ4mtMPmdHscgwf5AaxkznVd9FO08nMUXW0+jJzO6fajObUFlvmfDbqHtXRzuVUXWL1tyzu5lQN59m8dkNVTwOn6umb6ppl/ZZTOe5nY5q2WWEXy4weddvW3/hwpXFGczYyp6Ez9fQtld1yr996GruX0/diXiT2TTZ3L6cyo0HYrDyOHbs/LdXRBhnNca2eqoyemu5SyunTNZtmh4Oso8mo8U6qnka7K7bNCiqj6ar5XmtVTx+u1zY7tMhozoszOV2ooVA/1pfZFA/841fW4/6wVUZzpqkb9XTbLqM5buR0oeqo+Vf1qp6+sq2npYwuzPdeRzKnH/bbZgdVR7dtduef01Idbfc4aaLqKcucjqRgm4zmrGUn8hz3T90ymlPK6afNptlhpcpM+0eeE1VP2Y37KqNJy4zmzOU8Knm21zY7yLE+DrocZsk2pyqjHf9A4CjrqWBVT0fyfdjk0O1I65TnuC/PvHjveuZ55vReteqt88EGMqczNjmdS8Hky8LRIn71tDR7tXG4Uk6bf9NzXdSbMd0zmnMqzhibP3YpDDMLGc2ZJ1wNrYWq5n2/2wBDY2BIDgyNgSE5MDQGhuTA0BgYkgNDY2BIDgyNgSE5MDQGhuT0yNDsRa9qHrgaiuOkir2+ewdq61nM1DAQlTRoaxrJrWt+W3sbpGE1DdqatdqLhv70of/Xof+1tAfjIQybAkNyYGgMDMmBoTEwJKdHht7fl4r9ZKDQvQL2NaiC79zi1/ww0f010iCpnE2ynR/+QugMJ1a+GaDhYh9mPvah/9eh/7W0B+MhDJsCQ3JgaAwMyYGhMTAkp0eG3t+X+v/80P9nwDXgOf43qRNz/Mpp+0l/HR7V1myvQ/9raQ/GQxg2BYbkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0Bobk+G/4UTTI1pIbR9svWXVl9fNP/5GtdVOKV/dCLkt4yIVSLa2XVqw8z2dxsmlhGEdWFrgoVlaK+Kz1KH/wGqeLzmsWz4/Fu7SpZl12Qj7luilBFnZGnq6I0QrPcl0/m2RsFtL5ZhTG+habwmas+I9ad9qeYMNVvalY2e7FZHNrpb+8pPrfJBgQ8hkpJMOZvW4UoaWFlSyznKWZEHFHhEiSLZdb7jOGh81p1pHTZsFlMbIKdtNOcLkVBQAAADzjH4W+XbnKuWNsAAAAAElFTkSuQmCC"
                }
                wasteType={itemData.item.wasteType}
                wasteDisposal={itemData.item.wasteDisposal}
                wasteDescription={itemData.item.wasteDescription}
                amount={itemData.item.amount}
                amountForSell={itemData.item.amountForSell}
                style={styles.eachTrashCard}
                UI_MinusDisabled={itemData.item.UI_MinusDisabled}
                UI_PlusDisabled={itemData.item.UI_PlusDisabled}
                dispatchAmountTrashsState={dispatchAmountTrashsState}
              />
            )}
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
