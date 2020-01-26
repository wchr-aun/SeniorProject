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

export default BuyingTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  const transactionItem = props.navigation.getParam("transactionItem");

  const [saleList, setSetList] = useState(
    new Wastes(transactionItem.detail.saleList).getFlatListFormat(true)
  );

  const dispatch = useDispatch();
  const cancelHandler = async () => {
    dispatch(
      transactionAction.changeTransactionStatus({
        txID: transactionItem.txId,
        oldStatus: transactionItem.detail.txStatus, //for query
        newStatus: 4
      })
    );
    props.navigation.goBack();
  };

  const acceptHandler = () => {
    dispatch(
      transactionAction.changeTransactionStatus({
        txID: transactionItem.txId,
        oldStatus: transactionItem.detail.txStatus, //for query
        chosenTime: transactionItem.detail.assignedTimeForUpdatingTx[0],
        newStatus: 2
      })
    );
  };

  const backHandler = () => {
    props.navigation.goBack();
  };

  return (
    <View style={{ ...styles.screen }}>
      <View style={styles.infoContainerCard}>
        <ScrollView>
          <View style={{ height: "50%", width: "100%" }}>
            <View
              style={{
                width: "20%",
                height: "50%",
                maxHeight: 150,
                padding: 5
              }}
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
            <ThaiTitleText style={{ fontSize: 12 }}>
              วันเวลาที่รับ
            </ThaiTitleText>
          </View>
          <View
            style={{ width: "100%", height: "15%", backgroundColor: "red" }}
          >
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
            <CustomButton
              btnColor={Colors.error}
              onPress={cancelHandler}
              btnTitleColor={Colors.on_primary}
              btnTitleFontSize={12}
            >
              ยกเลิก
            </CustomButton>
            <CustomButton
              btnColor={Colors.primary}
              onPress={backHandler}
              btnTitleColor={Colors.on_primary}
              btnTitleFontSize={12}
            >
              ย้อนกลับ
            </CustomButton>
            <CustomButton
              // disable={txStatus === 0 ? false : true}
              btnColor={Colors.primary_variant}
              onPress={acceptHandler}
              btnTitleColor={Colors.on_primary}
              btnTitleFontSize={12}
            >
              ยอมรับ
            </CustomButton>
          </View>
        </ScrollView>
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
    height: Dimensions.get("window").height * 0.8,
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
  "detail": Object {
    "addr": "บ้านธรรมรักษา 2 กรุงเทพมหานคร ประเทศไทย 10140",
    "addr_geopoint": Object {
      "geohash": "w4rmwuccf",
      "geopoint": Object {
        "_latitude": 13.6494627,
        "_longitude": 100.4944718,
      },
    },
    "assignedTime": Array [
      Timestamp {
        "nanoseconds": 0,
        "seconds": 1580169600,
      },
    ],
    "buyer": "",
    "createTimestamp": Object {
      "_nanoseconds": 862000000,
      "_seconds": 1580052487,
    },
    "hitMetadata": Object {
      "bearing": 124.45176249258583,
      "distance": 0.0010220999316233553,
    },
    "id": "3mTqURFZ7zBeXfqHetDd",
    "saleList": Object {
      "danger": Object {
        "battery": Object {
          "amount": 20,
        },
      },
      "length": 2,
      "plastic": Object {
        "PETE": Object {
          "amount": 20,
        },
      },
    },
    "seller": "huaweithree",
    "txStatus": 0,
    "txType": 1,
    "zipcode": 10140,
  },
  "txId": "3mTqURFZ7zBeXfqHetDd",
}
*/
