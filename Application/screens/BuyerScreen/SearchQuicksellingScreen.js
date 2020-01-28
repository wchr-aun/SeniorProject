import React, { useEffect, useCallback, useState } from "react";
import { StyleSheet, FlatList, View, Text, SectionList } from "react-native";
import { useSelector } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Header } from "react-navigation-stack";
import AppVariableSetting from "../../constants/AppVariableSetting";
import * as transactionAction from "../../store/actions/transactionAction";

import { useDispatch } from "react-redux";

import CustomStatusBar from "../../components/UI/CustomStatusBar";
import Colors from "../../constants/Colors";
import libary from "../../utils/libary";
import ThaiRegText from "../../components/ThaiRegText";
import SellTransactionCard from "../../components/SellTransactionCard";

export default SearchQuicksellingScreen = props => {
  const dispatch = useDispatch();
  const purchaseList = useSelector(state => state.buyerInfo.purchaseList); // sure data is ready
  const buyerAddr = useSelector(state => state.user.userProfile.addr);

  useEffect(() => {
    if (purchaseList != undefined)
      if (Object.keys(purchaseList).length > 0 && buyerAddr) loadSeller();
  }, [purchaseList, buyerAddr]);

  // Callback fn
  const [isRefreshing, setIsRefreshing] = useState(true);
  const loadSeller = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(
      transactionAction.fetchQuickTransaction({
        // distance: parseInt(props.navigation.getParam("distance"), 10),
        distance: parseInt(1000, 10),
        saleList: purchaseList.getObject(),
        addr: buyerAddr
      })
    );
    setIsRefreshing(false);
  }, [dispatch, buyerAddr]);
  const quickTransactions = useSelector(
    state => state.transactions.quickTransactions
  ); // sure data is ready

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
        <FlatList
          refreshing={isRefreshing}
          onRefresh={loadSeller}
          data={quickTransactions ? quickTransactions : []}
          keyExtractor={item => item.txId}
          renderItem={({ item }) => {
            return (
              <SellTransactionCard
                amountOfType={item.detail.saleList.length}
                imgUrl={
                  "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/393181_101079776715663_1713951835_n.jpg?_nc_cat=107&_nc_eui2=AeEfWDFdtSlGFFjF6BoDJHuxELzTu9FOooinuAkIpIjHImVL2HwARq_OuEI4p63j_X6uN7Pe8CsdOxkg9MFPW9owggtWs3f23aW46Lbk_7ahHw&_nc_oc=AQnoUrFNQsOv1dtrGlQO9cJdPhjxF0yXadmYTrwMAXz2C3asf9CIw59tbNDL8jPKHhI&_nc_ht=scontent.fbkk17-1.fna&oh=4b6bbf9f1d83cffd20a9e028d3967bdd&oe=5E65C748"
                }
                txStatus={item.detail.txStatus}
                userName={item.detail.seller}
                addr={item.detail.addr}
                onPress={() => {
                  selectedHandler(item);
                }}
                meetDate={libary.formatDate(
                  item.detail.assignedTime[0].toDate()
                )}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
