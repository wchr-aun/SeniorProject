import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  ActivityIndicator,
  Alert,
  StatusBar
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import UserInfoCard from "../../components/UserInfoCard";
import ThaiTitleText from "../../components/ThaiTitleText";
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
        transactionItem: transactionItem
      }
    });
  };

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight
        }}
      >
        {isLoading ? (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: Colors.on_primary,
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            <UserInfoCard
              style={{
                ...styles.userInfoCard,
                height: "40%",
                width: "100%"
              }}
              imgUrl={
                userProfile.imgUrl
                  ? userProfile.imgUrl
                  : "https://www.clipartkey.com/mpngs/m/107-1076987_user-staff-man-profile-person-icon-circle-png.png"
              }
              userName={userProfile.name + " " + userProfile.surname}
              meetTime={"18 มกรา 15.00 น."}
              address={userProfile.addr.readable}
              // onSignout={() => signOutHandler()}
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
                backgroundColor: Colors.primary_variant,
                paddingBottom: getStatusBarHeight()
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
                    style={{ color: Colors.on_primary, fontSize: 18 }}
                  >
                    การรับซื้อขยะล่าสุด
                  </ThaiTitleText>
                </TouchableWithoutFeedback>
              </View>

              <FlatList
                data={transactions}
                keyExtractor={item => item.txId}
                renderItem={({ item }) => {
                  console.log("item");
                  console.log(item);
                  return (
                    <SellTransactionCard
                      amountOfType={item.detail.saleList.length}
                      imgUrl={
                        "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/393181_101079776715663_1713951835_n.jpg?_nc_cat=107&_nc_eui2=AeEfWDFdtSlGFFjF6BoDJHuxELzTu9FOooinuAkIpIjHImVL2HwARq_OuEI4p63j_X6uN7Pe8CsdOxkg9MFPW9owggtWs3f23aW46Lbk_7ahHw&_nc_oc=AQnoUrFNQsOv1dtrGlQO9cJdPhjxF0yXadmYTrwMAXz2C3asf9CIw59tbNDL8jPKHhI&_nc_ht=scontent.fbkk17-1.fna&oh=4b6bbf9f1d83cffd20a9e028d3967bdd&oe=5E65C748"
                      }
                      txStatus={item.detail.txStatus}
                      userName={item.detail.buyer}
                      // meetDate={libary.formatDate(
                      //   item.detail.assignedTime.toDate()
                      // )}
                      // meetTime={libary.formatTime(
                      //   item.detail.assignedTime.toDate()
                      // )}
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
    backgroundColor: Colors.screen
  }
});
