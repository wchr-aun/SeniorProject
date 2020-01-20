import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
  Dimensions,
  FlatList
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import ThaiTitleText from "../../components/ThaiTitleText";
import ThaiText from "../../components/ThaiText";
import { updateTxStatus } from "../../utils/firebaseFunctions";
import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { Wastes } from "../../models/AllUserTrash";

export default SellingTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  console.log("tx detail");
  const transactionItem = props.navigation.getParam("transactionItem");
  console.log(transactionItem);

  const [saleList, setSetList] = useState(
    new Wastes(transactionItem.detail.saleList).getFlatListFormat(true)
  );

  const cancelHandler = async () => {
    await updateTxStatus({
      txID: transactionItem.txId,
      // chosenTime: 0,
      status: 4
    });
  };

  const backHandler = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.infoContainerCard}>
        <View style={{ height: "50%", width: "100%" }}>
          <View
            style={{ width: "20%", height: "50%", maxHeight: 150, padding: 5 }}
          >
            <Image
              source={{
                uri: transactionItem.imgUrl
              }}
              style={styles.userImg}
              resizeMode="center"
            />
          </View>
          <View style={{ width: "100%", height: "50%" }}>
            <ThaiText>
              <ThaiTitleText style={{ fontSize: 12 }}>สถานะ: </ThaiTitleText>
              {libary.getReadableTxStatus(transactionItem.detail.txStatus)}
            </ThaiText>
            <ThaiText>
              <ThaiTitleText style={{ fontSize: 12 }}>
                ผู้รับซื้อ:{" "}
              </ThaiTitleText>
              {transactionItem.detail.buyer}
            </ThaiText>
            <ThaiText>
              <ThaiTitleText style={{ fontSize: 12 }}>
                สถานที่รับขยะ:{" "}
              </ThaiTitleText>
              {transactionItem.detail.addr}
            </ThaiText>
            <ThaiText>{transactionItem.tel}</ThaiText>
          </View>
        </View>
        <View style={{ width: "100%", height: "5%" }}>
          <ThaiTitleText style={{ fontSize: 12 }}>วันเวลาที่รับ</ThaiTitleText>
        </View>
        <View style={{ width: "100%", height: "15%", backgroundColor: "red" }}>
          <FlatList
            data={transactionItem.detail.assignedTime}
            keyExtractor={item =>
              libary.formatDate(item.toDate()) +
              libary.formatTime(item.toDate())
            }
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              return (
                <View style={{ height: 50, padding: 3, alignSelf: "center" }}>
                  <ThaiText>
                    {libary.formatDate(item.toDate()) +
                      " " +
                      libary.formatTime(item.toDate())}
                  </ThaiText>
                </View>
              );
            }}
          />
        </View>
        <View style={{ width: "100%", height: "5%" }}>
          <ThaiTitleText style={{ fontSize: 12 }}>
            ประเภทขยะที่ขาย
          </ThaiTitleText>
        </View>
        <View
          style={{ width: "100%", height: "15%", backgroundColor: "yellow" }}
        >
          <FlatList
            data={saleList}
            keyExtractor={item => item.subtype}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              console.log(saleList);
              return (
                <View
                  style={{
                    height: 50,
                    padding: 3,
                    alignSelf: "center",
                    flexDirection: "row"
                  }}
                >
                  <View style={{ width: "50%", height: "100%" }}>
                    <ThaiText>{item.type + " " + item.subtype}</ThaiText>
                  </View>
                  <View style={{ width: "50%", height: "100%" }}>
                    <ThaiText>{"จำนวน " + item.amount.amount}</ThaiText>
                  </View>
                </View>
              );
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            height: "10%",
            maxHeight: 50,
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <Button onPress={cancelHandler} title="ยกเลิก" />
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
  userImg: {
    width: "100%",
    height: "100%"
  }
});
