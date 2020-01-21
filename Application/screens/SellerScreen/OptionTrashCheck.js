import React, { useState, useReducer } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import ImagePicker from "../../components/ImagePicker";
import { useDispatch, useSelector } from "react-redux";
import * as imgActions from "../../store/actions/imageAction";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Header } from "react-navigation-stack";
import AppVariableSetting from "../../constants/AppVariableSetting";
import CustomStatusBar from "../../components/UI/CustomStatusBar";

export default OptionTrashCheck = props => {
  const dispatch = useDispatch();

  const sellerItemsFromCamera = useSelector(
    state => state.sellerItems.sellerItemsCamera
  );

  const wasteTypesDB = useSelector(state => {
    return state.wasteType.wasteTypes;
  });

  const imageTakenHandler = img => {
    console.log(wasteTypesDB);
    dispatch(imgActions.getPrediction(img, wasteTypesDB));
  };

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height:
            hp("100%") - AppVariableSetting.bottomBarHeight - Header.HEIGHT
        }}
      >
        <Text>OptionTrashCheck</Text>
        <ImagePicker
          onImageTaken={img => {
            imageTakenHandler(img);
          }}
        />
        <View
          style={{
            width: "100%",
            height: "85%",
            paddingHorizontal: 10,
            alignItems: "center"
          }}
        >
          <FlatList
            data={sellerItemsFromCamera ? sellerItemsFromCamera : []}
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
                    wasteTypesDB[item.type][item.subtype]["disposal"]
                  }
                  wasteDescription={
                    wasteTypesDB[item.type][item.subtype]["description"]
                  }
                  // changeAmount={
                  //   trashsState.sellerItems._count[item.type][item.subtype]
                  // }
                  oldAmount={item.amount}
                  trashAdjustPrice={
                    item.adjustedPrice ? item.adjustedPrice : "0.7-0.9"
                  }
                  editingMode={true}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
