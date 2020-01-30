import React, { useEffect } from "react";
import { StyleSheet, FlatList, View, Text, SectionList } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Header } from "react-navigation-stack";
import AppVariableSetting from "../../constants/AppVariableSetting";
import * as transactionAction from "../../store/actions/transactionAction";

import Colors from "../../constants/Colors";
import libary from "../../utils/libary";
import SellTransactionCard from "../../components/SellTransactionCard";
import { LinearGradient } from "expo-linear-gradient";

export default BuyingTransactionScreen = props => {
  // Get transactions for initially
  const dispatch = useDispatch();
  const userRole = useSelector(state => state.user.userRole);
  useEffect(() => {
    try {
      dispatch(transactionAction.fetchTransaction(userRole));
    } catch (err) {
      setError(err.message);
    }
  }, []);
  const transactionsSectionListFormat = useSelector(
    state => state.transactions.transactionsSectionListFormat
  );

  // For looking into transaction detail
  const selectedHandler = transactionItem => {
    props.navigation.navigate({
      routeName: "BuyingTransactionDetailScreen",
      params: {
        transactionItem
      }
    });
  };

  return (
    <View
      style={{
        width: wp("100%"),
        height:
          hp("100%") -
          AppVariableSetting.bottomBarHeight +
          getStatusBarHeight() -
          Header.HEIGHT
      }}
    >
      <LinearGradient
        colors={Colors.linearGradientB}
        style={{
          width: "100%",
          height: "100%",
          alignSelf: "center",
          alignItems: "center",
          paddingVertical: 10,
          backgroundColor: Colors.primary_bright,
          paddingBottom: getStatusBarHeight()
        }}
      >
        <SectionList
          sections={transactionsSectionListFormat}
          keyExtractor={(item, index) => item + index}
          renderSectionHeader={({ section: { transactionMode } }) => {
            return (
              <View style={{ width: "100%", height: 40, alignItems: "center" }}>
                <ThaiBoldText
                  style={{
                    color: Colors.on_primary_bright.high_constrast,
                    fontSize: 18
                  }}
                >
                  {transactionMode}
                </ThaiBoldText>
                <View
                  style={{
                    width: "15%",
                    borderBottomColor: Colors.soft_primary_bright,
                    borderBottomWidth: 2
                  }}
                ></View>
              </View>
            );
          }}
          renderItem={({ item }) => {
            return (
              <SellTransactionCard
                userRole={userRole}
                amountOfType={item.detail.saleList.length}
                imgUrl={""}
                userName={item.detail.seller}
                txStatus={item.detail.txStatus}
                txType={item.detail.txType}
                addr={item.detail.addr}
                meetDate={libary.formatDate(
                  item.detail.assignedTime[0].toDate()
                )}
                onPress={() => {
                  selectedHandler(item);
                }}
              />
            );
          }}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({});
