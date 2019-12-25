import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  ActivityIndicator
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector } from "react-redux";

import UserInfoCard from "../../components/UserInfoCard";
import ThaiTitleText from "../../components/ThaiTitleText";
import SellTransactionCard from "../../components/SellTransactionCard";
import { SELLINGTRANSACTION } from "../../data/dummy-data";

export default UserHomepageScreen = props => {
  // Resolve change vertical and horizontal affect to width
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );
  useEffect(() => {
    const updateScreen = () => {
      setAvailableDeviceWidth(Dimensions.get("window").width);
      setAvailableDeviceHeight(Dimensions.get("window").height);
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

  return (
    <View
      style={{
        ...styles.screen,
        width: availableDeviceWidth,
        height: availableDeviceHeight
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
              paddingTop: availableDeviceHeight * 0.05
            }}
            imgUrl={
              userProfile.imgUrl
                ? userProfile.imgUrl
                : "https://www.clipartkey.com/mpngs/m/107-1076987_user-staff-man-profile-person-icon-circle-png.png"
            }
            userName={userProfile.name + " " + userProfile.surname}
            meetTime={"18 มกรา 15.00 น."}
            address={userProfile.addr}
          />
          <View style={styles.recentSellTransactionContainer}>
            <View
              style={{
                alignSelf: "flex-start",
                paddingLeft: Dimensions.get("window").width * 0.03
              }}
            >
              <ThaiTitleText style={{ color: Colors.on_primary, fontSize: 18 }}>
                การรับซื้อขยะล่าสุด
              </ThaiTitleText>
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
  userInfoCard: {
    width: "100%",
    height: "30%"
  },
  userInfoCardLoading: {
    width: "100%",
    height: "30%",
    backgroundColor: Colors.on_primary,
    alignSelf: "center"
  },
  recentSellTransactionContainer: {
    width: "100%",
    height: "60%",
    paddingVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Colors.primary_variant
  },
  sellTransactionCard: {
    backgroundColor: Colors.on_primary,
    width: "95%",
    height: 100,
    alignSelf: "center",
    marginVertical: 5
  }
});
