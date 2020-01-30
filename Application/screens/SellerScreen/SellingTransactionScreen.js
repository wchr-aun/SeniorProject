import React from "react";
import { StyleSheet, FlatList, View, Text, SectionList } from "react-native";
import { useSelector } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Header } from "react-navigation-stack";
import AppVariableSetting from "../../constants/AppVariableSetting";

import CustomStatusBar from "../../components/UI/CustomStatusBar";
import Colors from "../../constants/Colors";
import libary from "../../utils/libary";
import ThaiRegText from "../../components/ThaiRegText";

export default SellingTransactionScreen = props => {
  // Get transactions for initially
  const transactionsSectionListFormat = useSelector(
    state => state.transactions.transactionsSectionListFormat
  );
  const userRole = useSelector(state => state.user.userRole);

  // For looking into transaction detail
  const selectedHandler = transactionItem => {
    props.navigation.navigate({
      routeName: "SellingTransactionDetailScreen",
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
          getStatusBarHeight(),
        paddingTop: getStatusBarHeight()
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          alignSelf: "center",
          alignItems: "center",
          paddingVertical: 10,
          backgroundColor: Colors.primary_bright
        }}
      >
        <SectionList
          sections={transactionsSectionListFormat}
          keyExtractor={(item, index) => item + index}
          renderSectionHeader={({ section: { transactionMode } }) => {
            return <Text>{transactionMode}</Text>;
          }}
          renderItem={({ item }) => (
            <SellTransactionCard
              amountOfType={item.detail.saleList.length}
              imgUrl={""}
              userName={item.detail.buyer}
              userRole={userRole}
              txType={item.detail.txType}
              txStatus={item.detail.txStatus}
              meetDate={libary.formatDate(item.detail.assignedTime[0].toDate())}
              addr={item.detail.addr}
              onPress={() => {
                selectedHandler(item);
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
