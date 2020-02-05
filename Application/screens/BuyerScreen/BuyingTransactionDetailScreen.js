import React, { useState, useEffect, useCallback, useReducer } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import ThaiMdText from "../../components/ThaiMdText";
import ThaiRegText from "../../components/ThaiRegText";

import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { Wastes } from "../../models/AllUserTrash";
import * as transactionAction from "../../store/actions/transactionAction";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons
} from "@expo/vector-icons";
import ThaiBoldText from "../../components/ThaiBoldText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default BuyingTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  const transactionItem = props.navigation.getParam("transactionItem");

  const [saleList, setSetList] = useState(
    new Wastes(transactionItem.detail.saleList).getFlatListFormat(true)
  );

  // const [timeState, dispatchTimeState] = useReducer(timeReducer, {timeSelected})
  const [timeSelected, setTimeSelected] = useState("");
  const onTimeSelectedHandler = timeItem => {
    setTimeSelected(timeItem);
  };

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
        chosenTime: timeSelected.seconds * 1000, //formattedTime.seconds * 1000
        newStatus: 2,
        txType: transactionItem.detail.txType
      })
    );

    props.navigation.goBack();
  };

  // date picker
  const [datepickerShow, setDatapickerShow] = useState(false);
  showDateTimePicker = () => {
    setDatapickerShow(true);
  };
  hideDateTimePicker = () => {
    setDatapickerShow(false);
  };
  const [datetime, setDatetime] = useState(new Date().getTime()); //date that  will be passed to submit fn.
  handleDatePicked = date => {
    console.log("date picked");
    console.log(date);
    setDatetime(date);
    hideDateTimePicker();
    setModalVisible(true);
  };

  const preferTimeHandler = () => {
    // dispatch(
    //   transactionAction.changeTransactionStatus({
    //     txID: transactionItem.txId,
    //     oldStatus: transactionItem.detail.txStatus, //for query
    //     chosenTime: libary.toDate(datetime),
    //     newStatus: 1
    //   })
    // );
    // props.navigation.goBack();
  };

  const onBuyerWayHandler = () => {
    dispatch(
      transactionAction.changeTransactionStatus({
        txID: transactionItem.txId,
        oldStatus: transactionItem.detail.txStatus, //for query
        newStatus: 3
      })
    );
    props.navigation.goBack();
  };

  const backHandler = () => {
    props.navigation.goBack();
  };

  return (
    <View
      style={{
        ...styles.infoContainerCard,
        width: "100%",
        height: "100%"
      }}
    >
      <CustomStatusBar />
      <View style={{ height: "35%", width: "100%" }}>
        <View
          style={{
            width: "100%",
            height: "20%",
            backgroundColor: Colors.soft_primary_dark,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ThaiBoldText
            style={{
              color: Colors.on_primary_dark.low_constrast,
              fontSize: 26
            }}
          >
            รายละเอียดคำขอ
          </ThaiBoldText>
        </View>
        <View
          style={{
            width: "100%",
            height: "40%",
            padding: 5,
            alignItems: "center"
          }}
        >
          <ImageCircle
            imgUrl={transactionItem.imgUrl ? transactionItem.imgUrl : ""}
            avariableWidth={wp("25%")}
          />
        </View>
        <View style={{ width: "100%", height: "40%", paddingHorizontal: 10 }}>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_dark.low_constrast
            }}
          >
            {`สถานะ `}
            <ThaiMdText
              style={{
                fontSize: 14,
                // color: libary.getColorTxStatus(transactionItem.detail.txStatus)
                color: libary.getColorTxStatus(3)
              }}
            >
              {/* {libary.getReadableTxStatus(transactionItem.detail.txStatus)} */}
              {libary.getReadableTxStatus(3)}
            </ThaiMdText>
          </ThaiRegText>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_dark.low_constrast
            }}
          >
            {`สถานที่รับขยะ `}
            <ThaiMdText
              style={{ fontSize: 14, color: Colors.primary_bright_variant }}
            >
              {transactionItem.detail.addr}
            </ThaiMdText>
          </ThaiRegText>
          <ThaiRegText>{transactionItem.tel}</ThaiRegText>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: "5%",
          paddingHorizontal: 10
        }}
      >
        <ThaiMdText
          style={{ fontSize: 12, color: Colors.on_primary_dark.low_constrast }}
        >
          วันเวลาที่เสนอขาย (สีขาว) / เลือกวันที่จะไปรับ (สีเขียว)
        </ThaiMdText>
      </View>
      <View
        style={{
          width: "100%",
          height: "20%",
          backgroundColor: Colors.soft_primary_dark,
          borderRadius: 5,
          padding: 5,
          paddingHorizontal: 10
        }}
      >
        <View style={{ width: "100%", height: "100%", paddingVertical: 5 }}>
          <FlatList
            data={transactionItem.detail.assignedTime}
            keyExtractor={item =>
              libary.formatDate(item.toDate()) +
              libary.formatTime(item.toDate())
            }
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              console.log(item);
              return (
                <TouchableOpacity onPress={() => onTimeSelectedHandler(item)}>
                  <View style={{ height: 25, padding: 3, alignSelf: "center" }}>
                    <ThaiRegText style={{ fontSize: 18 }}>
                      <ThaiMdText
                        style={{
                          fontSize: 18,
                          color: Colors.soft_secondary
                        }}
                      >
                        {libary.formatDate(item.toDate())}
                      </ThaiMdText>
                      {` `}
                      <ThaiMdText
                        style={{
                          fontSize: 18,
                          color: Colors.soft_secondary
                        }}
                      >
                        {libary.formatTime(item.toDate())}
                      </ThaiMdText>
                      <MaterialIcons
                        name={
                          timeSelected === item
                            ? "check-box"
                            : "check-box-outline-blank"
                        }
                        size={20}
                        color={Colors.primary_bright}
                      />
                    </ThaiRegText>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {/* <View
          style={{
            width: "100%",
            height: "35%",
            flexDirection: "row",
            justifyContent: "flex-end"
          }}
        >
          <CustomButton
            disable={
              transactionItem.detail.chosenTime != undefined &&
              transactionItem.detail.txStatus === 1
                ? false //not disabled
                : true
            }
            style={{
              width: "40%",
              height: "100%",
              maxHeight: 40,
              borderRadius: 5
            }}
            btnColor={
              // transactionItem.detail.chosenTime != undefined &&
              // transactionItem.detail.txStatus === 1
              //   ? Colors.button.submit_primary_bright.btnBackground
              //   : Colors.button.disabled.btnBackground
              "#414141"
            }
            btnTitleColor={
              // transactionItem.detail.chosenTime != undefined &&
              // transactionItem.detail.txStatus === 1
              //   ? Colors.button.submit_primary_bright.btnText
              //   : Colors.button.disabled.btnText
              "#272727"
            }
            onPress={preferTimeHandler}
            btnTitleFontSize={12}
          >
            <MaterialCommunityIcons
              name={"calendar-multiple-check"}
              // color={Colors.button.submit_primary_bright.btnText}
              color={"#414141"}
              size={12}
            />
            <ThaiMdText style={{ fontSize: 12 }}> เสนอเวลาอื่น</ThaiMdText>
          </CustomButton>
        </View> */}
      </View>
      <View
        style={{
          width: "100%",
          height: "5%",
          padding: 2,
          paddingHorizontal: 10
        }}
      >
        <ThaiMdText
          style={{ fontSize: 12, color: Colors.on_primary_dark.low_constrast }}
        >
          ประเภทขยะที่ขาย
        </ThaiMdText>
      </View>
      <View
        style={{
          width: "100%",
          height: "20%",
          backgroundColor: Colors.soft_primary_dark,
          borderRadius: 5,
          paddingHorizontal: 10
        }}
      >
        <FlatList
          data={saleList}
          keyExtractor={item => item.subtype}
          style={{ flex: 1 }}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  height: 30,
                  padding: 3,
                  alignSelf: "center",
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center"
                  }}
                >
                  <ThaiRegText
                    style={{ fontSize: 18, color: Colors.soft_secondary }}
                  >
                    <ThaiMdText
                      style={{ fontSize: 18, color: Colors.primary_bright }}
                    >
                      {item.type}
                    </ThaiMdText>
                    {` ประเภท `}
                    <ThaiMdText
                      style={{ fontSize: 18, color: Colors.primary_bright }}
                    >
                      {item.subtype}
                    </ThaiMdText>
                    {` จำนวน `}
                    <ThaiMdText
                      style={{ fontSize: 18, color: Colors.primary_bright }}
                    >
                      {item.amount.amount}
                    </ThaiMdText>
                  </ThaiRegText>
                </View>
              </View>
            );
          }}
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "15%",
          padding: 5,
          paddingBottom: getStatusBarHeight()
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <CustomButton
            style={{
              width: "30%",
              height: "100%",
              maxHeight: 50,
              borderRadius: 5
            }}
            btnColor={Colors.button.disabled.btnBackground}
            onPress={acceptHandler}
            btnTitleColor={Colors.button.disabled.btnText}
            btnTitleFontSize={18}
          >
            <MaterialIcons
              name={"cancel"}
              color={Colors.button.disabled.btnText}
              size={14}
            />
            <ThaiMdText style={{ fontSize: 18 }}> ยอมรับ</ThaiMdText>
          </CustomButton>
          <CustomButton
            style={{
              width: "30%",
              height: "100%",
              maxHeight: 50,
              borderRadius: 5
            }}
            btnColor={Colors.button.danger_operation.btnBackground}
            onPress={cancelHandler}
            btnTitleColor={Colors.button.danger_operation.btnText}
            btnTitleFontSize={18}
          >
            <MaterialIcons
              name={"cancel"}
              color={Colors.button.danger_operation.btnText}
              size={14}
            />
            <ThaiMdText style={{ fontSize: 18 }}> ยกเลิก</ThaiMdText>
          </CustomButton>
          <CustomButton
            style={{
              width: "30%",
              height: "100%",
              maxHeight: 50,
              borderRadius: 5
            }}
            btnColor={Colors.button.cancel.btnBackground}
            onPress={backHandler}
            btnTitleColor={Colors.button.cancel.btnText}
            btnTitleFontSize={18}
          >
            <Ionicons
              name={"ios-arrow-back"}
              size={14}
              color={Colors.button.cancel.btnText}
            />
            <ThaiMdText style={{ fontSize: 18 }}> ย้อนกลับ</ThaiMdText>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainerCard: {
    backgroundColor: Colors.primary_dark,
    alignSelf: "center"
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
