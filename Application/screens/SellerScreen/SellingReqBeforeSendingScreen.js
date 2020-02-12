import React, { useState } from "react";
import { View, Image, StyleSheet, Alert, FlatList } from "react-native";
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

import { Ionicons } from "@expo/vector-icons";

import CustomStatusBar from "../../components/UI/CustomStatusBar";
import ThaiBoldText from "../../components/ThaiBoldText";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationEvents } from "react-navigation";
import ModalLoading from "../../components/ModalLoading";

export default SellingReqBeforeSendingScreen = props => {
  const [isInOperation, setIsInOperation] = useState(false);
  const isOperationCompleted = useSelector(
    state => state.navigation.isOperationCompleted
  );
  const checkIsOperationCompleted = () => {
    if (isOperationCompleted === true) {
      props.navigation.navigate("ShowSellerItemsScreen");
    }
  };
  const sellReq = props.navigation.getParam("sellReq");
  const dispatch = useDispatch();
  const sellerName = useSelector(state => state.user.userProfile.name);

  const [imgs, setImgs] = useState([]);
  const [imgsName, setImgsName] = useState([]);
  const takeImgHandler = async () => {
    const img = await libary.takeAnImg();
    if (!img) {
      return;
    }
    let updatedImgs = [...imgs];

    // get img name
    const imgName = `${sellerName}${sellReq.buyerInfomation.buyerName}${sellReq.assignedTime[0]}${imgs.length}.jpg`; //sellername+buyername+datetime.getsec+length+1
    let updatedImgsName = [...imgsName];
    updatedImgs.push(img);
    updatedImgsName.push(imgName);
    setImgs(updatedImgs);
    setImgsName(updatedImgsName);
  };

  const acceptHandler = async () => {
    setIsInOperation(true);
    // upload img
    for (let i = 0; i < imgs.length; i++) {
      libary.uploadingImg(imgs[i], imgsName[i], "tx");
    }

    try {
      await dispatch(sellerItemsAction.sellRequest(sellReq, imgsName));
      await dispatch(transactionAction.fetchTransaction("seller"));
      await dispatch(sellerItemsAction.fetchSellerItems());
      await dispatch(navigationBehaviorAction.finishOperation());
      setIsInOperation(false);
      Alert.alert(
        "ส่งคำร้องขอขายขยะ",
        "คุณสามารถตรวจสอบรายการได้ที่หน้ารายการรับซื้อขยะ",
        [{ text: "OK" }]
      );
      props.navigation.navigate("SellerHomepageScreen");
    } catch (err) {
      Alert.alert("ยอมรับข้อเสนอไม่สำเร็จ", "โปรดตรวจสอบข้อมูลอีกครั้ง", [
        { text: "OK" }
      ]);
    }
  };

  const backHandler = () => {
    props.navigation.goBack();
  };

  return (
    <LinearGradient
      colors={Colors.linearGradientDark}
      style={{
        ...styles.infoContainerCard,
        width: "100%",
        height: "100%"
      }}
    >
      <NavigationEvents onWillFocus={checkIsOperationCompleted} />
      <CustomStatusBar />
      <ModalLoading modalVisible={isInOperation} userRole="seller" />
      <View
        style={{
          height: "10%",
          width: "100%",
          flexDirection: "row",
          backgroundColor: Colors.soft_primary_dark,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        <CustomButton
          style={{
            width: "20%",
            height: "100%",
            maxHeight: 30,
            borderRadius: 5
          }}
          btnColor={Colors.button.cancel.btnBackground}
          onPress={backHandler}
          btnTitleColor={Colors.button.cancel.btnText}
          btnTitleFontSize={10}
        >
          <Ionicons
            name={"ios-arrow-back"}
            color={Colors.button.cancel.btnText}
            size={10}
          />
          <ThaiMdText style={{ fontSize: 10 }}> ย้อนกลับ</ThaiMdText>
        </CustomButton>
        <View
          style={{
            width: "70%",
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "center"
          }}
        >
          <ThaiBoldText
            style={{
              color: Colors.on_primary_dark.low_constrast,
              fontSize: 18
            }}
          >
            รายละเอียดคำขอ
          </ThaiBoldText>
        </View>
      </View>
      <View style={{ height: "10%", width: "100%" }}>
        <View style={{ width: "100%", height: "100%", paddingHorizontal: 10 }}>
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
          padding: 10
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            paddingVertical: 5,
            backgroundColor: Colors.soft_primary_dark,
            borderRadius: 10
          }}
        >
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
                      color: Colors.primary_bright_variant
                    }}
                  >
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color: Colors.primary_bright_variant
                      }}
                    >
                      {libary.formatDate(new Date(item))}
                    </ThaiMdText>
                    {` `}
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color: Colors.primary_bright_variant
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
          padding: 10
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Colors.soft_primary_dark,
            borderRadius: 10
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
                        style={{
                          fontSize: 18,
                          color: Colors.soft_secondary
                        }}
                      >
                        {item.type}
                      </ThaiMdText>
                      {` ประเภท `}
                      <ThaiMdText
                        style={{
                          fontSize: 18,
                          color: Colors.soft_secondary
                        }}
                      >
                        {item.subtype}
                      </ThaiMdText>
                      {` จำนวน `}
                      <ThaiMdText
                        style={{
                          fontSize: 18,
                          color: Colors.primary_bright_variant
                        }}
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
      </View>
      <View
        style={{
          height: "40%",
          width: "100%",
          padding: 5,
          paddingBottom: getStatusBarHeight()
        }}
      >
        {/* image */}
        <View
          style={{ width: "100%", height: "60%", justifyContent: "center" }}
        >
          <FlatList
            data={imgs}
            keyExtractor={item => item.uri}
            style={{ flex: 1 }}
            horizontal={true}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 5,
                    paddingHorizontal: 2,
                    overflow: "hidden"
                  }}
                >
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: item.uri }}
                  />
                </View>
              );
            }}
          />
        </View>
        {/* Btn + number of pic */}
        <View
          style={{
            width: "100%",
            height: "40%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <CustomButton
            style={{
              width: "50%",
              maxWidth: 100,
              height: "100%",
              maxHeight: 35,
              borderRadius: 5,
              marginRight: 10
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
            <ThaiMdText style={{ fontSize: 12 }}>
              {" "}
              ถ่ายภาพ
              <ThaiBoldText
                style={{
                  fontSize: 12,
                  color: Colors.on_primary_dark.high_constrast
                }}
              >{` ${imgs.length}`}</ThaiBoldText>
            </ThaiMdText>
          </CustomButton>
          <CustomButton
            style={{
              width: "50%",
              maxWidth: 100,
              height: "100%",
              maxHeight: 35,
              borderRadius: 5,
              marginRight: 10
            }}
            btnColor={
              imgs.length > 0
                ? Colors.button.submit_primary_bright.btnBackground
                : Colors.button.submit_primary_bright.btnBackgroundDisabled
            }
            onPress={imgs.length > 0 ? acceptHandler : null}
            btnTitleColor={
              imgs.length > 0
                ? Colors.button.submit_primary_bright.btnText
                : Colors.button.submit_primary_bright.btnTextDisabled
            }
            btnTitleFontSize={10}
          >
            <ThaiMdText style={{ fontSize: 10 }}> ยืนยันขาย</ThaiMdText>
          </CustomButton>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  infoContainerCard: {
    backgroundColor: Colors.primary_dark,
    alignSelf: "center",
    alignItems: "center"
  },
  userInfo: {
    alignItems: "center"
  },
  userImg: {
    width: "100%",
    height: "100%"
  }
});
