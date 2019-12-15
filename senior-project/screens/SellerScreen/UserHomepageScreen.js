import React from "react";
import { StyleSheet, FlatList, View, Dimensions } from "react-native";
import Colors from "../../constants/Colors";

import UserInfoCard from "../../components/UserInfoCard";
import ThaiTitleText from "../../components/ThaiTitleText";
import SellTransactionCard from "../../components/SellTransactionCard";
import { SELLINGTRANSACTION } from "../../data/dummy-data";

export default UserHomepageScreen = props => {
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
    <View style={styles.screen}>
      <UserInfoCard
        style={styles.userInfoCard}
        imgUrl={
          "https://icon-library.net/images/person-icon-svg/person-icon-svg-2.jpg"
        }
        userName={"นราวิชญ์ ทับทิมโต"}
        meetTime={"18 มกรา 15.00 น."}
      />
      <View style={styles.recentSellTransactionContainer}>
        <ThaiTitleText style={{ color: Colors.on_primary }}>
          การรับซื้อขยะล่าสุด
        </ThaiTitleText>
        <FlatList
          data={SELLINGTRANSACTION}
          keyExtractor={item => item.transactionId}
          renderItem={itemData => (
            <SellTransactionCard
              amountOfType={itemData.item.amountOfType}
              imgUrl={itemData.item.buyerImg}
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
    </View>
  );
};

// UserHomepageScreen.navigationOptions = navData => {
//   return null;
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    backgroundColor: Colors.screen
  },
  userInfoCard: {
    marginTop: Dimensions.get("window").height * 0.025,
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.3
  },
  recentSellTransactionContainer: {
    marginTop: 10,
    paddingVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: Colors.primary_variant
  },
  sellTransactionCard: {
    backgroundColor: Colors.on_primary,
    width: "95%",
    alignSelf: "center",
    height: Dimensions.get("window").height * 0.14,
    marginVertical: 5
  }
});
