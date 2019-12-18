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
          "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/s960x960/74584040_2528070227472512_8048909192494317568_o.jpg?_nc_cat=106&_nc_oc=AQkjvDIqS0y8XhjOs3Y2U3onMrJl-kknJS9qk3I3z87yjDyNPXBKbgwJOakqkXDXrZg&_nc_ht=scontent.fbkk17-1.fna&oh=db0bbf687fea4431b25d56e5328e28df&oe=5E745A6E"
        }
        userName={"นราวิชญ์ รูปไม่กลม"}
        meetTime={"18 มกรา 15.00 น."}
        address={"126 ถนนประชาอุทิศ แขวงบางมด เขตทุ่งครุ กรุงเทพฯ 10140"}
      />
      <View style={styles.recentSellTransactionContainer}>
        <View>
          <ThaiTitleText style={{ color: Colors.on_primary }}>
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
    </View>
  );
};

// UserHomepageScreen.navigationOptions = navData => {
//   return null;
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Dimensions.get("window").height * 0.05,
    backgroundColor: Colors.screen
  },
  userInfoCard: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.3
  },
  recentSellTransactionContainer: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.5,
    marginTop: 10,
    paddingVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Colors.primary_variant
  },
  sellTransactionCard: {
    backgroundColor: Colors.on_primary,
    width: "95%",
    height: 100,
    // height: "50%",
    alignSelf: "center",
    marginVertical: 5
  }
});
