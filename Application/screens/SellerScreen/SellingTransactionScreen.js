import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  SectionList,
  ActivityIndicator
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AppVariableSetting from "../../constants/AppVariableSetting";

import Colors from "../../constants/Colors";
import libary from "../../utils/libary";
import ThaiBoldText from "../../components/ThaiBoldText";
import { LinearGradient } from "expo-linear-gradient";
import * as transactionAction from "../../store/actions/transactionAction";
import CustomStatusBar from "../../components/UI/CustomStatusBar";

export default SellingTransactionScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
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

  // --------------- loading section --------------------
  // Callback fn
  const refreshTx = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(transactionAction.fetchTransaction(userRole));
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  // initially
  useEffect(() => {
    // Load sellerItems and wasteType from firebase and store it to redux "initially"
    setIsLoading(true);
    refreshTx()
      .then(() => setIsLoading(false))
      .catch(err => {
        setIsLoading(false);
        setError(err.message);
      });
  }, [refreshTx, dispatch]);

  //add spinner loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        width: wp("100%"),
        height: hp("100%") - AppVariableSetting.bottomBarHeight
      }}
    >
      <CustomStatusBar />
      <LinearGradient
        colors={Colors.linearGradientDark}
        style={{
          width: "100%",
          height: "100%",
          alignSelf: "center",
          alignItems: "center",
          paddingVertical: 10,
          paddingBottom: getStatusBarHeight()
        }}
      >
        <SectionList
          refreshing={isRefreshing}
          onRefresh={refreshTx}
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
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({});
