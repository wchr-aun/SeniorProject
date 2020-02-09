import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  ActivityIndicator,
  Alert
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import UserInfoCard from "../../components/UserInfoCard";
import ThaiMdText from "../../components/ThaiMdText";
import SellTransactionCard from "../../components/SellTransactionCard";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as buyerAction from "../../store/actions/buyerAction";
import * as transactionAction from "../../store/actions/transactionAction";
import AppVariableSetting from "../../constants/AppVariableSetting";
import libary from "../../utils/libary";
import { LinearGradient } from "expo-linear-gradient";

export default BuyerHomepageScreen = props => {
  // Loading effect
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);

  // error handling
  const [error, setError] = useState("");
  useEffect(() => {
    if (error) {
      Alert.alert("การแจ้งเตือน", error, [{ text: "OK" }]);
    }
  }, [error]);

  // Get user profile
  const userProfile = useSelector(state => state.user.userProfile);
  const userRole = useSelector(state => state.user.userRole);

  const dispatch = useDispatch();
  // load Callback fn
  const refreshTxAndBuyerInfo = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(transactionAction.fetchTransaction(userRole));
    await dispatch(buyerAction.fetchBuyerInfo());
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  // initially
  useEffect(() => {
    // Load sellerItems and wasteType from firebase and store it to redux "initially"
    setIsLoading(true);
    refreshTxAndBuyerInfo()
      .then(() => setIsLoading(false))
      .catch(err => {
        setIsLoading(false);
        setError(err.message);
      });
  }, [refreshTxAndBuyerInfo, dispatch]);

  const transactions = useSelector(state => state.transactions.transactions);

  // For looking into transaction detail
  const selectedHandler = transactionItem => {
    props.navigation.navigate({
      routeName: "BuyingTransactionDetailScreen",
      params: {
        transactionItem: transactionItem
      }
    });
  };

  useEffect(() => {
    console.log("Buyer homepage!!!");
  });

  //add spinner loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight,
          backgroundColor: Colors.primary_dark
        }}
      >
        {isLoading ? (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: Colors.primary_bright,
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator size="large" color={Colors.primary_dark} />
          </View>
        ) : (
          <>
            <UserInfoCard
              userRole={userRole}
              numberOfIncompleteTx={transactions ? transactions[0].length : 0}
              avariableWidth={wp("100%")}
              style={{
                ...styles.userInfoCard,
                height: "40%",
                width: "100%"
              }}
              imgUrl={userProfile.imgUrl ? userProfile.imgUrl : ""}
              userName={userProfile.name + " " + userProfile.surname}
              meetTime={"18 มกรา 15.00 น."}
              address={userProfile.addr.readable}
              onSignout={() => {
                props.navigation.navigate("EditingUserprofileScreen");
              }}
            />
            <LinearGradient
              colors={Colors.linearGradientBright}
              style={{
                width: "100%",
                height: "60%",
                alignSelf: "center",
                alignItems: "center",
                paddingVertical: 10,
                backgroundColor: Colors.primary_bright,
                paddingBottom: getStatusBarHeight(),
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  paddingLeft: Dimensions.get("window").width * 0.03
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    setGoToUITestingScreen(preState => preState + 1);
                  }}
                >
                  <ThaiMdText
                    style={{
                      color: Colors.primary_dark,
                      fontSize: 18
                    }}
                  >
                    คำขอขายขยะที่ส่งหาคุณ
                  </ThaiMdText>
                </TouchableWithoutFeedback>
              </View>

              <View style={{ width: "100%", height: "90%" }}>
                {isLoading ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <ActivityIndicator size="large" color={Colors.primary} />
                  </View>
                ) : (
                  <FlatList
                    onRefresh={refreshTxAndBuyerInfo}
                    refreshing={isRefreshing}
                    data={transactions ? transactions[0] : []}
                    keyExtractor={item => item.txId}
                    renderItem={({ item }) => {
                      return (
                        <SellTransactionCard
                          amountOfType={item.detail.saleList.length}
                          userName={item.detail.seller}
                          userRole={userRole}
                          txType={item.detail.txType}
                          txStatus={item.detail.txStatus}
                          imgUrl={item.imgUrl ? item.imgUrl : ""}
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
                )}
              </View>
            </LinearGradient>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
