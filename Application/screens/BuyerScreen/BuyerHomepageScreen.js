import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  ActivityIndicator
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
import * as authAction from "../../store/actions/authAction";
import * as transactionAction from "../../store/actions/transactionAction";
import AppVariableSetting from "../../constants/AppVariableSetting";

export default BuyerHomepageScreen = props => {
  // --------------------------- For UI Testing, not relate to this project ---------------------
  const [goToUITestingScreen, setGoToUITestingScreen] = useState(0);
  useEffect(() => {
    if (goToUITestingScreen === 10) {
      console.log("Go to UI template");
      props.navigation.navigate("UIScreenTemplate");
    } else console.log("homepage");
  }, [goToUITestingScreen]);

  // Loading effect
  const [isLoading, setIsLoading] = useState(true);

  // Get user profile
  const userProfile = useSelector(state => state.userProfile.user);
  useEffect(() => {
    console.log(userProfile);
    setIsLoading(true);
    if (userProfile.uid) setIsLoading(false);
  }, [userProfile]);

  // Get transactions for initially
  const transactions = useSelector(state => state.transactions.transactions);
  useEffect(() => {
    dispatch(transactionAction.fetchTransaction());
  }, []);

  // For looking into transaction detail
  const selectedHandler = transactionItem => {
    props.navigation.navigate({
      routeName: "SellingTransactionDetailScreen",
      params: {
        transactionItem: transactionItem
      }
    });
  };

  // For User signout
  const dispatch = useDispatch();
  const signOutHandler = async () => {
    setIsLoading(true);
    let result = await dispatch(authAction.signout());

    /* Maybe clear redux storing in the ram
    Look at this thread, might be useful, probably:
    https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store */

    if (result) props.navigation.navigate("StartupScreen");
    else {
      setIsLoading(false);
      /* Make an alert or something, I don't know. */
    }
  };

  return (
    <View
      style={{
        ...styles.screen,
        width: wp("100%"),
        height:
          hp("100%") -
          AppVariableSetting.bottomBarHeight +
          getStatusBarHeight(),
        paddingTop: getStatusBarHeight()
      }}
    >
      {isLoading ? (
        <View
          style={{
            // ...styles.userInfoCardLoading,
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
              height: "30%",
              width: "100%"
            }}
            imgUrl={
              userProfile.imgUrl
                ? userProfile.imgUrl
                : "https://www.clipartkey.com/mpngs/m/107-1076987_user-staff-man-profile-person-icon-circle-png.png"
            }
            userName={userProfile.name + " " + userProfile.surname}
            meetTime={"18 มกรา 15.00 น."}
            address={userProfile.addr}
            onSignout={() => signOutHandler()}
          />
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
              // data={SELLINGTRANSACTION}
              data={transactions}
              keyExtractor={item => item.txId}
              renderItem={itemData => (
                <SellTransactionCard
                  amountOfType={itemData.item.detail.amountOfType}
                  imgUrl={
                    "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/393181_101079776715663_1713951835_n.jpg?_nc_cat=107&_nc_eui2=AeEfWDFdtSlGFFjF6BoDJHuxELzTu9FOooinuAkIpIjHImVL2HwARq_OuEI4p63j_X6uN7Pe8CsdOxkg9MFPW9owggtWs3f23aW46Lbk_7ahHw&_nc_oc=AQnoUrFNQsOv1dtrGlQO9cJdPhjxF0yXadmYTrwMAXz2C3asf9CIw59tbNDL8jPKHhI&_nc_ht=scontent.fbkk17-1.fna&oh=4b6bbf9f1d83cffd20a9e028d3967bdd&oe=5E65C748"
                  }
                  userName={itemData.item.detail.buyer}
                  meetTime={itemData.item.detail.assignedTimeFormat}
                  style={styles.sellTransactionCard}
                  onPress={() => {
                    selectedHandler(itemData.item);
                  }}
                />
              )}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.screen
  },
  sellTransactionCard: {
    backgroundColor: Colors.on_primary,
    height: 100,
    alignSelf: "center",
    marginVertical: 5
  }
});
