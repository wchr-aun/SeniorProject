import React, { useEffect, useState, useReducer } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  FlatList,
  ActivityIndicator,
  Text,
  BackHandler
} from "react-native";

import Colors from "../../constants/Colors";
import ThaiTitleText from "../../components/ThaiTitleText";
import TrashCard from "../../components/TrashCard";
import queryFunctions from "../../utils/queryFunctions";
import firebaseUtil from "../../firebase";

const ADD_TRASH = "ADD_TRASH";
const MINUS_TRASH = "MINUS_TRASH";
const INITIAL_TRASH = "INITIAL_TRASH";

const addTrashHandler = items => {
  let addWaste = firebaseUtil.functions().httpsCallable("addWaste");
  // Call firebase cloud functio
  return addWaste(items)
    .then(function(result) {
      // Read result of the Cloud Function.
      console.log("From EditTrashForSeller: addWaste added");
      console.log(result);
    })
    .catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.log("From EditTrashForSeller: error code :" + code);
      console.log("From EditTrashForSeller: error message :" + message);
      console.log("From EditTrashForSeller: error details :" + details);
    });
};

const amoutOfTrashsReducer = (state, action) => {
  let founded = false;
  let updatedItems = [...state.items];

  switch (action.type) {
    case INITIAL_TRASH:
      let initialItems = [...action.items];
      updatedItems = [];
      initialItems.forEach((item, index) => {
        updatedItems.push({
          amount: item.amount,
          wasteType: item.wasteType
        });
      });
      return {
        items: updatedItems
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
  }
};

export default ShowAllUserTrashScreen = props => {
  // trash user snapshot
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [amountTrashsState, dispatchAmountTrashsState] = useReducer(
    amoutOfTrashsReducer,
    {
      items: []
    }
  );

  // Mode setting
  const [editingMode, setEditingMode] = useState(false);

  // load data
  const loadUserTrash = async () => {
    setIsRefreshing(true);
    queryFunctions.getSellerList().then(itemsReturned => {
      // must 'then' for waiting itemRetured completedc
      itemsReturned.forEach((item, index) => {
        itemsReturned[index].wasteType = "wasteType/" + item.wasteType.id;
      });
      setItems([...itemsReturned]);
      dispatchAmountTrashsState({
        type: INITIAL_TRASH,
        items: [...itemsReturned]
      });
      setIsRefreshing(false);
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
        return true;
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
    <View style={styles.screen}>
      <View style={styles.titleScreen}>
        <ThaiTitleText>ขยะที่เก็บไว้</ThaiTitleText>
      </View>
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
            data={items}
            renderItem={itemData => (
              <TrashCard
                imgUrl={
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEX///8jHyAAAAAbFxhYVVXV1dUYExXa2tpraWlcWVkgHB3x8fEvLCwNBAegn58FAAAVDxFvbW3i4eG3traJiIimpaW9vLx6eHmcm5vp6eljYWFCP0Dz8/Ovra4qJidOTEyGhYXIyMhST1A3MzRJRkd1c3PEw8SAf3+TGW0NAAAEd0lEQVR4nO2df1uyMBSGgykqSpBp+as0s/r+3/CN94qNUhiDeTwbz/2vwLWbPZwxQXd3BwAAAAAAAHCcx3stq/WtG9mJTZjoCIe3bmQnxlGgI4Uhb2AIQ/70yDA7GyVivwyzxfIv29grwwvD+kTA0AlgCEP+wBCG/JEj/uHv1N63Ed//u7YaYMgcGMKQPz0y9H60wBzfXWAIQ/7AEIb8gSEM+TMQnhs+hoHWMNrcoGG22GVxtWHRvUH4coOmWWKc/UjEyfTsw+ek+DB19p0hmdEgfDz/dCeKDo4G9G2zwvS1UMguXmpP6gQ4mtMPmdHscgwf5AaxkznVd9FO08nMUXW0+jJzO6fajObUFlvmfDbqHtXRzuVUXWL1tyzu5lQN59m8dkNVTwOn6umb6ppl/ZZTOe5nY5q2WWEXy4weddvW3/hwpXFGczYyp6Ez9fQtld1yr996GruX0/diXiT2TTZ3L6cyo0HYrDyOHbs/LdXRBhnNca2eqoyemu5SyunTNZtmh4Oso8mo8U6qnka7K7bNCiqj6ar5XmtVTx+u1zY7tMhozoszOV2ooVA/1pfZFA/841fW4/6wVUZzpqkb9XTbLqM5buR0oeqo+Vf1qp6+sq2npYwuzPdeRzKnH/bbZgdVR7dtduef01Idbfc4aaLqKcucjqRgm4zmrGUn8hz3T90ymlPK6afNptlhpcpM+0eeE1VP2Y37KqNJy4zmzOU8Knm21zY7yLE+DrocZsk2pyqjHf9A4CjrqWBVT0fyfdjk0O1I65TnuC/PvHjveuZ55vReteqt88EGMqczNjmdS8Hky8LRIn71tDR7tXG4Uk6bf9NzXdSbMd0zmnMqzhibP3YpDDMLGc2ZJ1wNrYWq5n2/2wBDY2BIDgyNgSE5MDQGhuTA0BgYkgNDY2BIDgyNgSE5MDQGhuT0yNDsRa9qHrgaiuOkir2+ewdq61nM1DAQlTRoaxrJrWt+W3sbpGE1DdqatdqLhv70of/Xof+1tAfjIQybAkNyYGgMDMmBoTEwJKdHht7fl4r9ZKDQvQL2NaiC79zi1/ww0f010iCpnE2ynR/+QugMJ1a+GaDhYh9mPvah/9eh/7W0B+MhDJsCQ3JgaAwMyYGhMTAkp0eG3t+X+v/80P9nwDXgOf43qRNz/Mpp+0l/HR7V1myvQ/9raQ/GQxg2BYbkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0BobkwNAYGJIDQ2NgSA4MjYEhOTA0Bobk+G/4UTTI1pIbR9svWXVl9fNP/5GtdVOKV/dCLkt4yIVSLa2XVqw8z2dxsmlhGEdWFrgoVlaK+Kz1KH/wGqeLzmsWz4/Fu7SpZl12Qj7luilBFnZGnq6I0QrPcl0/m2RsFtL5ZhTG+habwmas+I9ad9qeYMNVvalY2e7FZHNrpb+8pPrfJBgQ8hkpJMOZvW4UoaWFlSyznKWZEHFHhEiSLZdb7jOGh81p1pHTZsFlMbIKdtNOcLkVBQAAADzjH4W+XbnKuWNsAAAAAElFTkSuQmCC"
                }
                wasteName={itemData.item.wasteType.replace("wasteType/", "")}
                wasteType={itemData.item.wasteType}
                amountOfTrash={itemData.item.amount}
                trashAdjustPrice={"0.7-0.9"}
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
                addTrashHandler(amountTrashsState);
                loadUserTrash();
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
                  params: { items }
                });
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Dimensions.get("window").height * 0.05,
    backgroundColor: Colors.screen,
    alignItems: "center"
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
