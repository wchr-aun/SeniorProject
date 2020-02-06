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
import ThaiTitleText from "../../components/ThaiBoldText";
import SellTransactionCard from "../../components/SellTransactionCard";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AppVariableSetting from "../../constants/AppVariableSetting";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import * as transactionAction from "../../store/actions/transactionAction";

import libary from "../../utils/libary";
import { LinearGradient } from "expo-linear-gradient";

export default SellerHomepageScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const dispatch = useDispatch();

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
  const transactions = useSelector(state => state.transactions.transactions);

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
  // load Callback fn
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
              backgroundColor: Colors.on_primary_dark.high_constrast,
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator size="large" color={Colors.primary_dark} />
          </View>
        ) : (
          <>
            <UserInfoCard
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
                  <ThaiTitleText
                    style={{
                      color: Colors.soft_primary_bright,
                      fontSize: 18
                    }}
                  >
                    การรับซื้อขยะล่าสุด
                  </ThaiTitleText>
                </TouchableWithoutFeedback>
              </View>

              <FlatList
                refreshing={isRefreshing}
                onRefresh={refreshTx}
                data={transactions ? transactions[0] : []}
                keyExtractor={item => item.txId}
                renderItem={({ item }) => {
                  return (
                    <SellTransactionCard
                      amountOfType={item.detail.saleList.length}
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
                  );
                }}
              />
            </LinearGradient>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.secondary
  }
});
