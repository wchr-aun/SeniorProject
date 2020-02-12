import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  TouchableHighlight,
  Alert
} from "react-native";
import Colors from "../constants/Colors";
import ThaiBoldText from "./ThaiBoldText";

export default ModalLoading = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)"
        }}
      >
        <View
          style={{
            width: 150,
            height: 120,
            backgroundColor:
              props.userRole === "seller" ? "white" : Colors.primary_dark,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View
            style={{
              width: "100%",
              height: "50%",
              justifyContent: "flex-end",
              alignItems: "center",
              ...styles.shadow,
              paddingBottom: 3
            }}
          >
            <ActivityIndicator size="large" color={Colors.primary_bright} />
          </View>
          <View
            style={{
              width: "100%",
              height: "50%",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: 3
            }}
          >
            <ThaiBoldText
              style={{
                color:
                  props.userRole === "seller" ? Colors.primary_bright : "white"
              }}
            >
              กำลังดำเนินการ
            </ThaiBoldText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  infoContainerCard: {
    backgroundColor: Colors.primary_dark,
    alignSelf: "center"
  },
  userInfo: {
    alignItems: "center"
  },
  userImg: {
    width: "100%",
    height: "100%"
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  }
});
