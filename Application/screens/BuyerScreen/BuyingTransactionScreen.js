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

import CustomStatusBar from "../../components/UI/CustomStatusBar";
import Colors from "../../constants/Colors";
import libary from "../../utils/libary";
import ThaiText from "../../components/ThaiText";

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
          hp("100%") - AppVariableSetting.bottomBarHeight + getStatusBarHeight()
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
        <SectionList
          sections={transactionsSectionListFormat}
          keyExtractor={(item, index) => item + index}
          renderSectionHeader={({ section: { transactionMode } }) => {
            return <Text>{transactionMode}</Text>;
          }}
          renderItem={({ item }) => (
            <SellTransactionCard
              userRole={userRole}
              amountOfType={item.detail.saleList.length}
              imgUrl={
                "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/393181_101079776715663_1713951835_n.jpg?_nc_cat=107&_nc_eui2=AeEfWDFdtSlGFFjF6BoDJHuxELzTu9FOooinuAkIpIjHImVL2HwARq_OuEI4p63j_X6uN7Pe8CsdOxkg9MFPW9owggtWs3f23aW46Lbk_7ahHw&_nc_oc=AQnoUrFNQsOv1dtrGlQO9cJdPhjxF0yXadmYTrwMAXz2C3asf9CIw59tbNDL8jPKHhI&_nc_ht=scontent.fbkk17-1.fna&oh=4b6bbf9f1d83cffd20a9e028d3967bdd&oe=5E65C748"
              }
              userName={item.detail.buyer}
              txStatus={item.detail.txStatus}
              meetDate={libary.formatDate(item.detail.assignedTime[0].toDate())}
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
