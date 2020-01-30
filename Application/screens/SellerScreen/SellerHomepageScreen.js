import React, { useEffect, useState } from "react";
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

export default SellerHomepageScreen = props => {
  // Loading effect
  const [isLoading, setIsLoading] = useState(true);

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
  useEffect(() => {
    setIsLoading(true);
    if (userProfile.uid) setIsLoading(false);
  }, [userProfile]);

  const dispatch = useDispatch();
  // Get transactions for initially
  useEffect(() => {
    try {
      dispatch(transactionAction.fetchTransaction(userRole));
    } catch (err) {
      setError(err.message);
    }
  }, []);
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
            <View
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
            </View>
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
