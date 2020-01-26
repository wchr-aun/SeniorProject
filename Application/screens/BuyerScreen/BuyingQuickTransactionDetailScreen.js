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

import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { Wastes } from "../../models/AllUserTrash";
import * as transactionAction from "../../store/actions/transactionAction";

export default BuyingQuickTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  const transactionItem = props.navigation.getParam("transactionItem");

  const [saleList, setSetList] = useState(
    new Wastes(transactionItem.detail.saleList).getFlatListFormat(true)
  );

  const dispatch = useDispatch();
  const cancelHandler = () => {
    dispatch(
      transactionAction.changeTransactionStatus({
        txID: transactionItem.txId,
        oldStatus: transactionItem.detail.txStatus, //for query
        newStatus: 4
      })
    );
  };

  const acceptHandler = () => {
    dispatch(
      transactionAction.changeTransactionStatus({
        txID: transactionItem.txId,
        oldStatus: transactionItem.detail.txStatus, //for query
        newStatus: 4
      })
    );
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

/*
Object {
  "addr": "12 ซอยสวนผัก35 ตำบล ฉิมพลี อำเภอ ตลิ่งชัน จังหวัด กรุงเทพมหานครฯ 10170",
  "addr_geopoint": Object {
    "geohash": "w4rqmqbt0",
    "geopoint": Object {
      "_latitude": 13.792826424015061,
      "_longitude": 100.42674623429775,
    },
  },
  "assignedTime": Array [
    Object {
      "_nanoseconds": 0,
      "_seconds": 946684800,
    },
    Object {
      "_nanoseconds": 0,
      "_seconds": 978307200,
    },
    Object {
      "_nanoseconds": 0,
      "_seconds": 980985600,
    },
    Object {
      "_nanoseconds": 0,
      "_seconds": 983404800,
    },
    Object {
      "_nanoseconds": 0,
      "_seconds": 986083200,
    },
  ],
  "buyer": "",
  "createTimestamp": Object {
    "_nanoseconds": 679000000,
    "_seconds": 1579964943,
  },
  "hitMetadata": Object {
    "bearing": -24.641701963313768,
    "distance": 17.539013221710345,
  },
  "id": "ERp48pYvwdsW0zNj5Qq6",
  "saleList": Object {
    "glass": Object {
      "redGlass": Object {
        "amount": 556,
      },
    },
    "length": 2,
    "plastic": Object {
      "PP": Object {
        "amount": 1013,
      },
    },
  },
  "seller": "anaunz",
  "txStatus": 0,
  "txType": 1,
}
*/
