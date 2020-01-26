import React, { useEffect, useCallback } from "react";
import { StyleSheet, FlatList, View, Text, SectionList } from "react-native";
import { useSelector } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Header } from "react-navigation-stack";
import AppVariableSetting from "../../constants/AppVariableSetting";
import * as buyerActions from "../../store/actions/buyerAction";

import { useDispatch } from "react-redux";

import CustomStatusBar from "../../components/UI/CustomStatusBar";
import Colors from "../../constants/Colors";
import libary from "../../utils/libary";
import ThaiText from "../../components/ThaiText";
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
  const loadSeller = useCallback(async () => {
    console.log("LoadSeller run");
    // setIsRefreshing(true);
    // await dispatch(sellerItemsAction.getBuyerList(TEMP_QUERY_BUYER));
    await dispatch(
      buyerActions.getSellerList({
        // distance: parseInt(props.navigation.getParam("distance"), 10),
        distance: parseInt(1000, 10),
        saleList: purchaseList.getObject(),
        addr: buyerAddr
      })
    );
    // setIsRefreshing(false);
  }, [dispatch, buyerAddr]);
  const sellerList = useSelector(state => state.buyerInfo.sellerList); // sure data is ready

  // For looking into transaction detail
  const selectedHandler = transactionItem => {
    props.navigation.navigate({
      routeName: "BuyingQuickTransactionDetailScreen",
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
          backgroundColor: Colors.primary_variant
        }}
      >
        <FlatList
          data={sellerList ? sellerList : []}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            console.log("item.assignedTime[0].seconds * 1000");
            console.log(item.assignedTime[0]);
            console.log(item.assignedTime[0].seconds);
            console.log(item.assignedTime[0].seconds * 1000);
            console.log(item);
            return (
              <SellTransactionCard
                amountOfType={item.saleList.length}
                imgUrl={
                  "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/393181_101079776715663_1713951835_n.jpg?_nc_cat=107&_nc_eui2=AeEfWDFdtSlGFFjF6BoDJHuxELzTu9FOooinuAkIpIjHImVL2HwARq_OuEI4p63j_X6uN7Pe8CsdOxkg9MFPW9owggtWs3f23aW46Lbk_7ahHw&_nc_oc=AQnoUrFNQsOv1dtrGlQO9cJdPhjxF0yXadmYTrwMAXz2C3asf9CIw59tbNDL8jPKHhI&_nc_ht=scontent.fbkk17-1.fna&oh=4b6bbf9f1d83cffd20a9e028d3967bdd&oe=5E65C748"
                }
                txStatus={item.txStatus}
                userName={item.seller}
                addr={item.addr}
                onPress={() => {
                  selectedHandler(item);
                }}
                meetDate={libary.formatDate(
                  new Date(item.assignedTime[0]._seconds * 1000)
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
