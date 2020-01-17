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
import { updateTxStatus } from "../../utils/firebaseFunctions";
import CustomButton from "../../components/UI/CustomButton";

export default SellingTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  console.log("tx detail");
  const transactionItem = props.navigation.getParam("transactionItem");
  console.log(transactionItem);

  const cancelHandler = async () => {
    await updateTxStatus({
      txID: transactionItem.txId,
      status: 4
    });
  };

  const backHandler = () => {
    props.navigation.goBack();
  };

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
            <ThaiText>รับที่ {transactionItem.detail.addr}</ThaiText>
          </View>
          <View>
            <ThaiText>ผู้รับซื้อ {transactionItem.detail.buyer}</ThaiText>
          </View>
          <View>
            <ThaiText>{transactionItem.tel}</ThaiText>
          </View>
          <Button onPress={cancelHandler} title="cancel" />
          <Button onPress={backHandler} title="ย้อนกลับ" />
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
    backgroundColor: Colors.primary
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
