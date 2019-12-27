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

import UserInfoCard from "../../components/UserInfoCard";
import ThaiTitleText from "../../components/ThaiTitleText";
import SellTransactionCard from "../../components/SellTransactionCard";
import { SELLINGTRANSACTION } from "../../data/dummy-data";
import AppVariableSetting from "../../constants/AppVariableSetting";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";
import * as authAction from "../../store/actions/authAction";

export default SellerHomepageScreen = props => {
  // --------------------------- For UI Testing, not relate to this project ---------------------
  const [goToUITestingScreen, setGoToUITestingScreen] = useState(0);
  useEffect(() => {
    if (goToUITestingScreen === 10) {
      console.log("Go to UI template");
      props.navigation.navigate("UIScreenTemplate");
    } else console.log("homepage");
  }, [goToUITestingScreen]);

  // Resolve change vertical and horizontal affect to width
  const [availableWidth, setAvailableWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableHeight, setAvailableHeight] = useState(
    // Delete status bar height
    Dimensions.get("window").height - AppVariableSetting.bottomBarHeight
  );
  useEffect(() => {
    const updateScreen = () => {
      setAvailableWidth(Dimensions.get("window").width);
      setAvailableHeight(
        // Real Content Height
        Dimensions.get("window").height - AppVariableSetting.bottomBarHeight
      );
    };
    Dimensions.addEventListener("change", updateScreen);
    return () => {
      Dimensions.removeEventListener("change", updateScreen);
    };
  });

  // Get user profile
  const [isLoading, setIsLoading] = useState(true);
  const userProfile = useSelector(state => state.userProfile.user);
  useEffect(() => {
    console.log(userProfile);
    setIsLoading(true);
    if (userProfile.uid) setIsLoading(false);
  }, [userProfile]);

  // For look into selling transaction detail
  const selectedHandler = transactionItem => {
    props.navigation.navigate({
      routeName: "SellingTransactionDetailScreen",
      params: {
        transactionItem: transactionItem
      }
    });
  };

  // do [signout,
  const dispatch = useDispatch();
  const [isSignin, setIsSignin] = useState(true);
  const signOutHandler = async () => {
    setIsLoading(true);
    let result = await dispatch(authAction.signout());
    setIsLoading(false);
    setIsSignin(result);
  };

  useEffect(() => {
    // If not do navigate in useEffect, 'Warning: Can't perform a React state update on an unmounted component.' occur
    if (!isSignin) {
      props.navigation.navigate("StartupScreen");
    }
  }, [isSignin]);

  return (
    <View
      style={{
        ...styles.screen,
        width: availableWidth,
        height: availableHeight,
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
              // paddingTop: availableDeviceHeight * 0.05,
              height: availableHeight * 0.3,
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
              height: availableHeight * 0.7,
              alignSelf: "center",
              alignItems: "center",
              paddingVertical: 15,
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
              data={SELLINGTRANSACTION}
              keyExtractor={item => item.transactionId}
              renderItem={itemData => (
                <SellTransactionCard
                  amountOfType={itemData.item.amountOfType}
                  imgUrl={itemData.item.imgUrl}
                  userName={itemData.item.buyerName}
                  meetTime={itemData.item.meetTime}
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
