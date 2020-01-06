import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
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

export default SellingTransactionScreen = props => {
  // Get transactions for initially
  const transactions = useSelector(state => state.transactions.transactions);

  return (
    <View
      style={{
        width: wp("100%"),
        height: hp("100%") - AppVariableSetting.bottomBarHeight - Header.HEIGHT
      }}
    >
      <View
        style={{
          width: "100%",
          height: "70%",
          alignSelf: "center",
          alignItems: "center",
          paddingVertical: 10,
          backgroundColor: Colors.primary_variant
        }}
      >
        <FlatList
          // data={SELLINGTRANSACTION}
          data={transactions}
          keyExtractor={item => item.txId}
          renderItem={itemData => (
            <SellTransactionCard
              amountOfType={itemData.item.detail.items.length}
              imgUrl={
                "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/393181_101079776715663_1713951835_n.jpg?_nc_cat=107&_nc_eui2=AeEfWDFdtSlGFFjF6BoDJHuxELzTu9FOooinuAkIpIjHImVL2HwARq_OuEI4p63j_X6uN7Pe8CsdOxkg9MFPW9owggtWs3f23aW46Lbk_7ahHw&_nc_oc=AQnoUrFNQsOv1dtrGlQO9cJdPhjxF0yXadmYTrwMAXz2C3asf9CIw59tbNDL8jPKHhI&_nc_ht=scontent.fbkk17-1.fna&oh=4b6bbf9f1d83cffd20a9e028d3967bdd&oe=5E65C748"
              }
              userName={itemData.item.detail.buyer}
              meetDate={libary.formatDate(
                itemData.item.detail.assignedTime.toDate()
              )}
              meetTime={libary.formatTime(
                itemData.item.detail.assignedTime.toDate()
              )}
              onPress={() => {
                selectedHandler(itemData.item);
              }}
            />
          )}
        />
      </View>
      <View
        style={{
          width: "100%",
          height: "30%",
          paddingBottom: getStatusBarHeight()
        }}
      >
        <View>
          <ThaiText>สำหรับใส่ Transaction [3,1,0]</ThaiText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
