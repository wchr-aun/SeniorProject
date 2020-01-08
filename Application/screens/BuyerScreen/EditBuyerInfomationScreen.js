import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  ActivityIndicator,
  SectionList
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import * as wasteTypeAction from "../../store/actions/wasteTypeAction";

import UserInfoCard from "../../components/UserInfoCard";
import ThaiTitleText from "../../components/ThaiTitleText";
import SellTransactionCard from "../../components/SellTransactionCard";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as authAction from "../../store/actions/authAction";
import * as transactionAction from "../../store/actions/transactionAction";
import AppVariableSetting from "../../constants/AppVariableSetting";
import libary from "../../utils/libary";
import ThaiText from "../../components/ThaiText";

const WasteDataTemp = [
  {
    title: "พลาสติก",
    data: ["HDPE", "PETE", "PP"],
    id: 1
  },
  {
    title: "แก้ว",
    data: ["แก้วแดง", "แก้วเขียว", "ขวดน้ำปลา"],
    id: 2
  },
  {
    title: "อันตราย",
    data: ["แผ่น DVD ที่อันตราย", "ถ่านไฟฉาย"],
    id: 3
  }
];

export default BuyerHomepageScreen = props => {
  // initially
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(wasteTypeAction.fetchWasteType());
  }, []);

  const wasteTypesList = useSelector(state => state.waste.wasteTypesList);
  console.log("wasteTypesList");
  console.log(wasteTypesList);

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight
        }}
      >
        <View style={{ width: "100%", height: "50%" }}>
          {/* <SectionList
            sections={WasteDataTemp}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => {
              return (
                <View>
                  <ThaiText> {item}</ThaiText>
                </View>
              );
            }}
            renderSectionHeader={({ section: { title } }) => {
              return <ThaiTitleText>{title}</ThaiTitleText>;
            }}
          /> */}
          <SectionList
            sections={wasteTypesList}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => {
              return (
                <View>
                  <ThaiText>{item.value}</ThaiText>
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
