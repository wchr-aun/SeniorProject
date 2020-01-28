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
import ThaiMdText from "../../components/ThaiMdText";
import ThaiRegText from "../../components/ThaiRegText";

import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { Wastes } from "../../models/AllUserTrash";
import * as transactionAction from "../../store/actions/transactionAction";

export default SellingTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  const transactionItem = props.navigation.getParam("transactionItem");
  const userRole = useSelector(state => state.user.userRole);

  const [saleList, setSetList] = useState(
    new Wastes(transactionItem.detail.saleList).getFlatListFormat(true)
  );

  const dispatch = useDispatch();
  const cancelHandler = async () => {
    await dispatch(
      transactionAction.changeTransactionStatus({
        txID: transactionItem.txId,
        oldStatus: transactionItem.detail.txStatus, //for query
        newStatus: 4
      })
    );
    await dispatch(transactionAction.fetchTransaction(userRole));
    props.navigation.goBack();
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
            <ThaiRegText>
              <ThaiMdText style={{ fontSize: 12 }}>สถานะ: </ThaiMdText>
              {libary.getReadableTxStatus(transactionItem.detail.txStatus)}
            </ThaiRegText>
            <ThaiRegText>
              <ThaiMdText style={{ fontSize: 12 }}>ผู้รับซื้อ: </ThaiMdText>
              {transactionItem.detail.buyer}
            </ThaiRegText>
            <ThaiRegText>
              <ThaiMdText style={{ fontSize: 12 }}>สถานที่รับขยะ: </ThaiMdText>
              {transactionItem.detail.addr}
            </ThaiRegText>
            <ThaiRegText>{transactionItem.tel}</ThaiRegText>
          </View>
        </View>
        <View style={{ width: "100%", height: "5%" }}>
          <ThaiMdText style={{ fontSize: 12 }}>วันเวลาที่รับ</ThaiMdText>
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
                  <ThaiRegText>
                    {libary.formatDate(item.toDate()) +
                      " " +
                      libary.formatTime(item.toDate())}
                  </ThaiRegText>
                </View>
              );
            }}
          />
        </View>
        <View style={{ width: "100%", height: "5%" }}>
          <ThaiMdText style={{ fontSize: 12 }}>ประเภทขยะที่ขาย</ThaiMdText>
        </View>
        <View
          style={{ width: "100%", height: "15%", backgroundColor: "yellow" }}
        >
          <FlatList
            data={saleList}
            keyExtractor={item => item.subtype}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
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
                    <ThaiRegText>{item.type + " " + item.subtype}</ThaiRegText>
                  </View>
                  <View style={{ width: "50%", height: "100%" }}>
                    <ThaiRegText>{"จำนวน " + item.amount.amount}</ThaiRegText>
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
    backgroundColor: Colors.primary_dark
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
