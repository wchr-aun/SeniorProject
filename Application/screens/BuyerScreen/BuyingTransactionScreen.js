import React, { useEffect, useCallback, useState } from "react";
import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AppVariableSetting from "../../constants/AppVariableSetting";
import * as transactionAction from "../../store/actions/transactionAction";

import Colors from "../../constants/Colors";
import libary from "../../utils/libary";
import SellTransactionCard from "../../components/SellTransactionCard";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "react-navigation-stack";
import ThaiRegText from "../../components/ThaiRegText";

export default BuyingTransactionScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  // Get transactions for initially
  const transactionsDropdownFormat = useSelector(
    state => state.transactions.transactionsDropdownFormat
  );
  const userRole = useSelector(state => state.user.userRole);

  // For looking into transaction detail
  const selectedHandler = transactionItem => {
    props.navigation.navigate({
      routeName: "BuyingTransactionDetailScreen",
      params: {
        transactionItem,
        haveHeaderHight: true
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

  const [txStatus, setTxStatus] = useState(transactionsDropdownFormat[0].value);
  const [txShow, setTxShow] = useState(
    transactionsDropdownFormat[0].transactions
  );
  const onTxStatusDropdownChange = txStatus => {
    setTxStatus(txStatus);

    targetDropdownSection = transactionsDropdownFormat.filter(
      eachDropdownSection => eachDropdownSection.value === txStatus
    )[0];
    setTxShow(targetDropdownSection.transactions);
  };

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
        height:
          hp("100%") -
          AppVariableSetting.bottomBarHeight -
          Header.HEIGHT +
          getStatusBarHeight()
      }}
    >
      {/* <CustomStatusBar /> */}
      <LinearGradient
        colors={Colors.linearGradientBright}
        style={{
          width: "100%",
          height: "100%",
          alignSelf: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            backgroundColor: Colors.soft_primary_dark,
            alignItems: "center"
          }}
        >
          <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_primary_dark.low_constrast,
                fontSize: 26
              }}
            >
              การรับซื้อขยะของคุณ
            </ThaiBoldText>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: "20%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              ...styles.firstDropdown,
              width: "60%",
              height: 80
            }}
          >
            <Dropdown
              label="ประเภทของรายการ"
              value={txStatus}
              data={transactionsDropdownFormat} //Plastic, Glass --- [{value: Plastic}, {value: Glass},]
              onChangeText={thisValue => {
                onTxStatusDropdownChange(thisValue);
              }}
              animationDuration={50}
              dropdownPosition={1}
            />
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: "70%",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: getStatusBarHeight() * 2
          }}
        >
          {txShow.length > 0 ? (
            <FlatList
              refreshing={isRefreshing}
              onRefresh={refreshTx}
              data={txShow}
              keyExtractor={(item, index) => item.txId}
              renderItem={({ item }) => (
                <SellTransactionCard
                  amountOfType={item.detail.saleList.length}
                  imgUrl={""}
                  userName={item.detail.buyer}
                  userRole={userRole}
                  txType={item.detail.txType}
                  txStatus={item.detail.txStatus}
                  meetDate={libary.formatDate(
                    item.detail.assignedTime[0].toDate()
                  )}
                  addr={item.detail.addr}
                  onPress={() => {
                    selectedHandler(item);
                  }}
                />
              )}
            />
          ) : (
            <ThaiRegText>ยังไม่มีรายการในประเภทนี้</ThaiRegText>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({});
