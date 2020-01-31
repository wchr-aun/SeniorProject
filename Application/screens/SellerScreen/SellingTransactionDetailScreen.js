import React, { useState } from "react";
import { View, Image, StyleSheet, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import ThaiMdText from "../../components/ThaiMdText";
import ThaiRegText from "../../components/ThaiRegText";

import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { Wastes } from "../../models/AllUserTrash";
import * as transactionAction from "../../store/actions/transactionAction";
import { getStatusBarHeight } from "react-native-status-bar-height";
import ImageCircle from "../../components/UI/ImageCircle";

import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import CustomStatusBar from "../../components/UI/CustomStatusBar";

export default SellingTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  const transactionItem = props.navigation.getParam("transactionItem");
  console.log(transactionItem);
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

  const acceptPreferedtimeHandler = () => {
    //
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
            รายละเอียดคำขอขายขยะ
          </ThaiBoldText>
        </View>
        <View
          style={{
            width: "100%",
            height: "40%",
            padding: 5,
            alignItems: "center",
            paddingHorizontal: 10
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
                color: libary.getColorTxStatus(transactionItem.detail.txStatus)
              }}
            >
              {libary.getReadableTxStatus(transactionItem.detail.txStatus)}
            </ThaiMdText>
          </ThaiRegText>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_dark.low_constrast
            }}
          >
            {`ผู้รับซื้อ `}
            <ThaiMdText
              style={{ fontSize: 14, color: Colors.primary_bright_variant }}
            >
              {transactionItem.detail.buyer}
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
          วันเวลาที่เสนอขาย (สีขาว) / วันเวลาที่นัด (สีเขียว)
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
        <View style={{ width: "100%", height: "65%", paddingVertical: 5 }}>
          <FlatList
            data={transactionItem.detail.assignedTime}
            keyExtractor={item =>
              libary.formatDate(item.toDate()) +
              libary.formatTime(item.toDate())
            }
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              return (
                <View style={{ height: 25, padding: 3, alignSelf: "center" }}>
                  <ThaiRegText
                    style={{
                      fontSize: 18,
                      color:
                        transactionItem.detail.chosenTime.seconds ===
                        item.seconds
                          ? Colors.soft_primary_bright
                          : Colors.soft_secondary
                    }}
                  >
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color:
                          transactionItem.detail.chosenTime.seconds ===
                          item.seconds
                            ? Colors.soft_primary_bright
                            : Colors.soft_secondary
                      }}
                    >
                      {libary.formatDate(item.toDate())}
                    </ThaiMdText>
                    {` `}
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color:
                          transactionItem.detail.chosenTime.seconds ===
                          item.seconds
                            ? Colors.soft_primary_bright
                            : Colors.soft_secondary
                      }}
                    >
                      {libary.formatTime(item.toDate())}
                    </ThaiMdText>
                  </ThaiRegText>
                </View>
              );
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            height: "35%",
            flexDirection: "row",
            justifyContent: "flex-end"
          }}
        >
          <CustomButton
            // disable={
            //   transactionItem.detail.chosenTime != undefined &&
            //   transactionItem.detail.txStatus === 1
            //     ? false //not disabled
            //     : true
            // }
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
              "#191919"
            }
            btnTitleColor={
              // transactionItem.detail.chosenTime != undefined &&
              // transactionItem.detail.txStatus === 1
              //   ? Colors.button.submit_primary_bright.btnText
              //   : Colors.button.disabled.btnText
              "#272727"
            }
            onPress={acceptPreferedtimeHandler}
            btnTitleFontSize={12}
          >
            <MaterialCommunityIcons
              name={"calendar-multiple-check"}
              // color={Colors.button.submit_primary_bright.btnText}
              color={"#272727"}
              size={12}
            />
            <ThaiMdText style={{ fontSize: 12 }}> ว่างในเวลาเสนอ</ThaiMdText>
          </CustomButton>
        </View>
      </View>
      <View style={{ width: "100%", height: "5%", paddingHorizontal: 10 }}>
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
              width: "40%",
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

          <CustomButton
            style={{
              width: "40%",
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
