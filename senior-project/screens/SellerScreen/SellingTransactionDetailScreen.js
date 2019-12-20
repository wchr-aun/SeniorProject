import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
  Dimensions
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import ThaiTitleText from "../../components/ThaiTitleText";
import ThaiText from "../../components/ThaiText";

export default SellingTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  const transactionItem = props.navigation.getParam("transactionItem");
  console.log(transactionItem);

  return (
    <View style={styles.screen}>
      <View style={styles.infoContainerCard}>
        <View style={styles.userInfo}>
          <View style={{ ...styles.imgContainer }}>
            <Image
              source={{
                uri: transactionItem.imgUrl
              }}
              style={styles.userImg}
              resizeMode="center"
            />
          </View>
          <View>
            <ThaiText>{transactionItem.buyerName}</ThaiText>
          </View>
          <View>
            <ThaiText>{transactionItem.tel}</ThaiText>
          </View>
        </View>
      </View>
    </View>
  );
};

// ProductDetailScreen.navigationOptions = navData => {
//   return {
//     headerTitle: navData.navigation.getParam("productTitle")
//   };
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Dimensions.get("window").height * 0.05,
    backgroundColor: Colors.screen
  },
  infoContainerCard: {
    backgroundColor: Colors.on_primary,
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.9,
    alignSelf: "center",
    padding: 10
  },
  userInfo: {
    alignItems: "center"
  },
  imgContainer: {
    width: "20%",
    height: "30%",
    padding: 5
    // borderRadius: 500,
    // overflow: "hidden",
    // backgroundColor: "red"
  },
  userImg: {
    width: "100%",
    height: "100%"
  }
});
