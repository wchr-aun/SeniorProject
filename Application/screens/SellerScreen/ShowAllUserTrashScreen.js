import React, { useEffect, useState, useReducer } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  FlatList,
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView
} from "react-native";

import Colors from "../../constants/Colors";
import TrashCard from "../../components/TrashCard";
import queryFunctions from "../../utils/queryFunctions";
import cloudFunctions from "../../utils/cloudFunctions";

const ADD_TRASH = "ADD_TRASH";
const MINUS_TRASH = "MINUS_TRASH";
const SET_TRASH = "SET_TRASH";
const EDIT_TRASH = "EDIT_TRASH";

const trashsModifyingReducer = (state, action) => {
  let founded = false;
  let updatedItems = [...state.items];

  switch (action.type) {
    case SET_TRASH:
      return {
        items: [...action.items]
      };
    case ADD_TRASH:
      // change or add
      updatedItems.forEach((item, index) => {
        if (item.wasteType === action.wasteType) {
          founded = true;
          updatedItems[index].amount = updatedItems[index].amount + 1;
        }
      });
      if (!founded) {
        updatedItems.push({
          wasteType: action.wasteType,
          amount: 1
        });
      }
      return {
        items: updatedItems
      };
    case MINUS_TRASH:
      // change or add
      updatedItems.forEach((item, index) => {
        if (item.wasteType === action.wasteType) {
          founded = true;
          updatedItems[index].amount = updatedItems[index].amount - 1;
          if (updatedItems[index].amount === 0) updatedItems.splice(index, 1);
        }
      });
      return {
        items: updatedItems
      };
    case EDIT_TRASH:
      // edit from text-input
      updatedItems.forEach((item, index) => {
        if (item.wasteType === action.wasteType) {
          updatedItems[index].amount = action.value;
        }
      });
      return {
        items: updatedItems
      };
  }
};

export default ShowAllUserTrashScreen = props => {
  // trash user snapshot
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [trashsState, dispatchAmountTrashsState] = useReducer(
    trashsModifyingReducer,
    {
      items: []
    }
  );

  // Mode setting
  const [editingMode, setEditingMode] = useState(false);

  // load data from firebase
  const loadUserTrash = async () => {
    setIsRefreshing(true);
    queryFunctions.getSellerList().then(itemsReturned => {
      new Promise((resolve, reject) => {
        itemsReturned.forEach((item, index) => {
          queryFunctions
            .getWasteTypeDetail(item.wasteType)
            .then(wasteTypeDetail => {
              itemsReturned[index].wasteDisposal = wasteTypeDetail.disposal;
              itemsReturned[index].wasteDescription =
                wasteTypeDetail.description;
              if (index === itemsReturned.length - 1) {
                resolve();
              }
            });
        });
      }).then(() => {
        console.log(itemsReturned);
        dispatchAmountTrashsState({
          type: SET_TRASH,
          items: [...itemsReturned]
        });
        setIsRefreshing(false);
      });
    });
  };

  // Load trash data for initial
  useEffect(() => {
    setIsLoading(true);
    loadUserTrash().then(setIsLoading(false));
    return () => {
      setItems(null);
    };
  }, []);

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

  //add spinner loading
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={{ flex: 1 }}
    >
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
              refreshing={isRefreshing}
              onRefresh={loadUserTrash}
              style={{
                flex: 1
              }}
              keyExtractor={item => item.wasteType}
              data={trashsState.items}
              renderItem={itemData => (
                <TrashCard
                  imgUrl={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8jHyAAAAAbFxhYVVXV1dUYExXa2tpraWlcWVkgHB3x8fEvLCwNBAegn58FAAAVDxFvbW3i4eG3traJiIimpaW9vLx6eHmcm5vp6eljYWFCP0Dz8/Ovra4qJidOTEyGhYXIyMhST1A3MzRJRkd1c3PEw8SAf3+TGW0NAAAEd0lEQVR4nO2df1uyMBSGgykqSpBp+as0s/r+3/CN94qNUhiDeTwbz/2vwLWbPZwxQXd3BwAAAAAAAHCcx3stq/WtG9mJTZjoCIe3bmQnxlGgI4Uhb2AIQ/70yDA7GyVivwyzxfIv29grwwvD+kTA0AlgCEP+wBCG/JEj/uHv1N63Ed//u7YaYMgcGMKQPz0y9H60wBzfXWAIQ/7AEIb8gSEM+TMQnhs+hoHWMNrcoGG22GVxtWHRvUH4coOmWWKc/UjEyfTsw+ek+DB19p0hmdEgfDz/dCeKDo4G9G2zwvS1UMguXmpP6gQ4mtMPmdHscgwf5AaxkznVd9FO08nMUXW0+jJzO6fajObUFlvmfDbqHtXRzuVUXWL1tyzu5lQN59m8dkNVTwOn6umb6ppl/ZZTOe5nY5q2WWEXy4weddvW3/hwpXFGczYyp6Ez9fQtld1yr996GruX0/diXiT2TTZ3L6cyo0HYrDyOHbs/LdXRBhnNca2eqoyemu5SyunTNZtmh4Oso8mo8U6qnka7K7bNCiqj6ar5XmtVTx+u1zY7tMhozoszOV2ooVA/1pfZFA/841fW4/6wVUZzpqkb9XTbLqM5buR0oeqo+Vf1qp6+sq2npYwuzPdeRzKnH/bbZgdVR7dtduef01Idbfc4aaLqKcucjqRgm4zmrGUn8hz3T90ymlPK6afNptlhpcpM+0eeE1VP2Y37KqNJy4zmzOU8Knm21zY7yLE+DrocZsk2pyqjHf9A4CjrqWBVT0fyfdjk0O1I65TnuC/PvHjveuZ55vReteqt88EGMqczNjmdS8Hky8LRIn71tDR7tXG4Uk6bf9NzXdSbMd0zmnMqzhibP3YpDDMLGc2ZJ1wNrYWq5n2/2wBDY2BIDgyNgSE5MDQGhuTA0BgYkgNDY2BIDgyNgSE5MDQGhuT0yNDsRa9qHrgaiuOkir2+ewdq61nM1DAQlTRoaxrJrWt+W3sbpGE1DdqatdqLhv70of/Xof+1tAfjIQybAkNyYGgMDMmBoTEwJKdHht7fl4r9ZKDQvQL2NaiC79zi1/ww0f010iCpnE2ynR/+QugMJ1a+GaDhYh9mPvah/9eh/7W0B+MhDJsCQ3JgaAwMyYGhMTAkp0eG3t+X+v/80P9nwDXgOf43qRNz/Mpp+0l/HR7V1myvQ/9raQ/GQxg2BYbkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0Bobk+G/4UTTI1pIbR9svWXVl9fNP/5GtdVOKV/dCLkt4yIVSLa2XVqw8z2dxsmlhGEdWFrgoVlaK+Kz1KH/wGqeLzmsWz4/Fu7SpZl12Qj7luilBFnZGnq6I0QrPcl0/m2RsFtL5ZhTG+habwmas+I9ad9qeYMNVvalY2e7FZHNrpb+8pPrfJBgQ8hkpJMOZvW4UoaWFlSyznKWZEHFHhEiSLZdb7jOGh81p1pHTZsFlMbIKdtNOcLkVBQAAADzjH4W+XbnKuWNsAAAAAElFTkSuQmCC"
                  }
                  wasteType={itemData.item.wasteType.replace("wasteType/", "")}
                  wasteDisposal={itemData.item.wasteDisposal}
                  wasteDescription={itemData.item.wasteDescription}
                  trashDisposal={null} //pro
                  amountOfTrash={itemData.item.amount}
                  trashAdjustPrice={
                    itemData.item.adjustedPrice
                      ? itemData.item.adjustedPrice
                      : "0.7-0.9"
                  }
                  style={styles.eachTrashCard}
                  editingMode={editingMode}
                  dispatchAmountTrashsState={dispatchAmountTrashsState}
                />
              )}
            />
          </View>
        </View>

        {editingMode ? (
          <View style={{ ...styles.btnContainer, width: "90%", height: "10%" }}>
            <View style={styles.navigateBtn}>
              <Button
                title="Confirm Amount"
                color={Colors.primary}
                onPress={() => {
                  setEditingMode(false);
                  cloudFunctions.addTrashHandler({ items: trashsState.items });
                  dispatchAmountTrashsState({
                    type: SET_TRASH,
                    items: trashsState.items
                  });
                }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.btnContainer}>
            <View style={styles.navigateBtn}>
              <Button
                title="Edit Trash infomation"
                color={Colors.primary}
                onPress={() => {
                  setEditingMode(true);
                }}
              />
            </View>
            <View style={styles.navigateBtn}>
              <Button
                title="Selling Trash infomation"
                color={Colors.secondary}
                onPress={() => {
                  props.navigation.navigate({
                    routeName: "SellingTrashScreen",
                    params: { items: trashsState.items }
                  });
                }}
              />
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.screen
  },
  allTrashContainer: {
    backgroundColor: Colors.primary_variant
  },
  eachTrashCard: {
    marginBottom: 5,
    backgroundColor: Colors.on_primary
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  btnContainer: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "center"
  },
  navigateBtn: {
    width: "50%",
    height: "100%",
    padding: 5,
    borderRadius: 5
  }
});
