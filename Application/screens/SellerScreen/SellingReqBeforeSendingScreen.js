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
import * as sellerItemsAction from "../../store/actions/sellerItemsAction";
import * as navigationBehaviorAction from "../../store/actions/navigationBehaviorAction";
import { getStatusBarHeight } from "react-native-status-bar-height";

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
import ThaiBoldText from "../../components/ThaiBoldText";

export default SellingReqBeforeSendingScreen = props => {
  const sellReq = props.navigation.getParam("sellReq");
  console.log("sellReq");
  console.log(sellReq);

  const dispatch = useDispatch();

  const [imgs, setImgs] = useState([]);
  const [imgsName, setImgsName] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const takeImgHandler = async () => {
    const img = await libary.takeAnImg();
    let updatedImgs = [...imgs];

    // get img name
    const imgName = img.uri.split("/").pop();
    let updatedImgsName = [...imgsName];
    updatedImgs.push(img);
    updatedImgsName.push(imgName);
    setImgs(updatedImgs);
    setImgsName(updatedImgsName);
  };

  // const deleteImgHandler = async () => {
  //   // const img = await libary.takeAnImg();
  //   // setImg(img)
  // };

  const acceptHandler = async () => {
    // upload img
    for (let img of imgs) {
      libary.uploadingImg(img);
    }

    await dispatch(sellerItemsAction.sellRequest(sellReq, imgsName));
    await dispatch(transactionAction.fetchTransaction("seller"));
    await dispatch(sellerItemsAction.fetchSellerItems());
    await dispatch(navigationBehaviorAction.finishOperation());
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
      <View style={{ height: "20%", width: "100%" }}>
        <View
          style={{
            width: "100%",
            height: "50%",
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
        <View style={{ width: "100%", height: "50%", paddingHorizontal: 10 }}>
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
              {sellReq.buyerInfomation.buyerName}
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
              {sellReq.sellerAddr.readable}
            </ThaiMdText>
          </ThaiRegText>
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
          วันเวลาที่เสนอขาย
        </ThaiMdText>
      </View>
      <View
        style={{
          width: "100%",
          height: "15%",
          backgroundColor: Colors.soft_primary_dark,
          borderRadius: 5,
          padding: 5,
          paddingHorizontal: 10
        }}
      >
        <View style={{ width: "100%", height: "100%", paddingVertical: 5 }}>
          <FlatList
            data={sellReq.assignedTime}
            keyExtractor={item =>
              libary.formatDate(new Date(item)) +
              libary.formatTime(new Date(item))
            }
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              return (
                <View style={{ height: 25, padding: 3, alignSelf: "center" }}>
                  <ThaiRegText
                    style={{
                      fontSize: 18,
                      color: Colors.soft_secondary
                    }}
                  >
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color: Colors.soft_secondary
                      }}
                    >
                      {libary.formatDate(new Date(item))}
                    </ThaiMdText>
                    {` `}
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color: Colors.soft_secondary
                      }}
                    >
                      {libary.formatTime(new Date(item))}
                    </ThaiMdText>
                  </ThaiRegText>
                </View>
              );
            }}
          />
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
          height: "15%",
          backgroundColor: Colors.soft_primary_dark,
          borderRadius: 5,
          paddingHorizontal: 10
        }}
      >
        <FlatList
          data={new Wastes(sellReq.saleList).getFlatListFormat(true)}
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
          height: "25%",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around"
        }}
      >
        {/* image */}
        <CustomButton
          style={{
            width: "40%",
            height: "100%",
            maxHeight: 35,
            borderRadius: 5
          }}
          btnColor={Colors.button.cancel.btnBackground}
          onPress={takeImgHandler}
          btnTitleColor={Colors.button.cancel.btnText}
          btnTitleFontSize={18}
        >
          <Ionicons
            name={"md-camera"}
            size={14}
            color={Colors.button.cancel.btnText}
          />
          <ThaiMdText style={{ fontSize: 12 }}> ถ่ายภาพ</ThaiMdText>
        </CustomButton>
        <View style={{ width: "50%", height: "100%" }}>
          <ThaiBoldText
            style={{
              fontSize: 10,
              color: Colors.on_primary_dark.high_constrast
            }}
          >{`จำนวนภาพตอนนี้ ${imgs.length}`}</ThaiBoldText>
        </View>
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
            btnColor={Colors.button.submit_primary_bright.btnBackground}
            onPress={acceptHandler}
            btnTitleColor={Colors.button.submit_primary_bright.btnText}
            btnTitleFontSize={18}
          >
            <MaterialIcons
              name={"cancel"}
              color={Colors.button.submit_primary_bright.btnText}
              size={14}
            />
            <ThaiMdText style={{ fontSize: 18 }}> ยืนยันการขาย</ThaiMdText>
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
