import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
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
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";

import CustomStatusBar from "../../components/UI/CustomStatusBar";
import ThaiBoldText from "../../components/ThaiBoldText";
import { NavigationEvents } from "react-navigation";
import ModalLoading from "../../components/ModalLoading";
import ModalShowImg from "../../components/ModalShowImg";

export default SellingReqBeforeSendingScreen = (props) => {
  const [isInOperation, setIsInOperation] = useState(false);
  const isOperationCompleted = useSelector(
    (state) => state.navigation.isOperationCompleted
  );
  const checkIsOperationCompleted = () => {
    if (isOperationCompleted === true) {
      props.navigation.navigate("ShowSellerItemsScreen");
    }
  };
  const sellReq = props.navigation.getParam("sellReq");
  const dispatch = useDispatch();
  const sellerName = useSelector((state) => state.user.userProfile.name);
  const wasteTypes = useSelector((state) => state.wasteType.wasteTypes);

  const [imgShowInModal, setImgShowInModal] = useState("");
  const [isImgModalVisible, setIsImgModalVisible] = useState(false);
  const [imgs, setImgs] = useState([]);
  const [imgsName, setImgsName] = useState([]);
  const slideImg = (indexSlide) => {
    let oldIndex = imgs.indexOf(imgShowInModal);
    let newIndex = oldIndex + indexSlide;
    if (newIndex != -1 && newIndex < imgs.length) {
      setImgShowInModal(imgs[newIndex]);
    }
  };
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
        { text: "OK" },
      ]);
    }
  };

  const backHandler = () => {
    props.navigation.goBack();
  };

  // const goBuyerDetail = () => {
  //   props.navigation.navigate({
  //     routeName: "BuyerDetailScreen",
  //     params: { buyerInfomation: sellReq.buyerInfomation }
  //   });
  // };

  return (
    <View
      style={{
        ...styles.infoContainerCard,
        width: "100%",
        height: "100%",
      }}
    >
      <NavigationEvents onWillFocus={checkIsOperationCompleted} />
      <CustomStatusBar />
      <ModalShowImg
        modalVisible={isImgModalVisible}
        onRequestClose={() => console.log("modal close")}
        setIsImgModalVisible={setIsImgModalVisible}
        uri={imgShowInModal}
        slideImg={slideImg}
      />
      <ModalLoading modalVisible={isInOperation} userRole="seller" />
      <View
        style={{
          height: "10%",
          width: "100%",
          flexDirection: "row",
          backgroundColor: Colors.hard_secondary,
          paddingVertical: 10,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <CustomButton
          style={{
            width: "20%",
            height: "100%",
            maxHeight: 30,
            borderRadius: 5,
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
            width: "50%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThaiBoldText
            style={{
              color: Colors.on_secondary.high_constrast,
              fontSize: 18,
            }}
          >
            รายละเอียดคำขอ
          </ThaiBoldText>
        </View>
        <View style={{ width: "20%" }} />
      </View>

      {/* Req detail */}
      <View
        style={{
          flex: 1,
          paddingBottom: getStatusBarHeight(),
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            height: "10%",
            width: "100%",
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_bright.low_constrast,
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
              color: Colors.on_primary_bright.low_constrast,
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

        <View
          style={{
            width: "100%",
            height: "5%",
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <ThaiMdText
            style={{
              fontSize: 14,
              color: Colors.on_primary_bright.low_constrast,
            }}
          >
            วันเวลาที่เสนอขาย
          </ThaiMdText>
        </View>

        <View
          style={{
            width: "90%",
            maxHeight: "20%",
            backgroundColor: Colors.hard_secondary,
            borderRadius: 5,
            paddingVertical: 5,
            alignSelf: "center",
            ...styles.shadow,
            paddingVertical: 5,
          }}
        >
          <FlatList
            data={sellReq.assignedTime}
            keyExtractor={(item) =>
              libary.formatDate(new Date(item)) +
              libary.formatTime(new Date(item))
            }
            renderItem={({ item }) => {
              return (
                <View style={{ height: 25, padding: 3, alignSelf: "center" }}>
                  <ThaiRegText
                    style={{
                      fontSize: 18,
                      color: Colors.primary_bright_variant,
                    }}
                  >
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color: Colors.primary_bright_variant,
                      }}
                    >
                      {libary.formatDate(new Date(item))}
                    </ThaiMdText>
                    {` `}
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color: Colors.primary_bright_variant,
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

        <View
          style={{
            width: "100%",
            height: "5%",
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <ThaiMdText
            style={{
              fontSize: 14,
              color: Colors.on_primary_bright.low_constrast,
            }}
          >
            ประเภทขยะที่ขาย
          </ThaiMdText>
        </View>

        <View
          style={{
            width: "90%",
            maxHeight: "20%",
            backgroundColor: Colors.hard_secondary,
            borderRadius: 5,
            paddingVertical: 5,
            alignSelf: "center",
            ...styles.shadow,
          }}
        >
          <FlatList
            data={new Wastes(sellReq.saleList).getFlatListFormat(true)}
            keyExtractor={(item) => item.subtype}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    height: 30,
                    padding: 3,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <View style={{ width: "40%" }}>
                      <ThaiRegText
                        style={{
                          fontSize: 18,
                          color: Colors.soft_primary_dark,
                        }}
                      >
                        {`${wasteTypes[item.type][item.subtype]["name"]}`}
                      </ThaiRegText>
                    </View>
                    <View style={{ width: "40%" }}>
                      <ThaiRegText
                        style={{
                          fontSize: 18,
                          color: Colors.soft_primary_dark,
                          textAlign: "right",
                        }}
                      >
                        {`จำนวน ${item.amount.amount}`}
                      </ThaiRegText>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>

        <View
          style={{
            width: "100%",
            height: "5%",
            padding: 2,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <ThaiMdText
            style={{ fontSize: 14, color: Colors.on_secondary.high_constrast }}
          >
            รูปภาพขยะ (กดที่ภาพ เพื่อขยาย)
          </ThaiMdText>
        </View>

        <View
          style={{
            height: "20%",
            width: "100%",
            padding: 5,
          }}
        >
          {/* image */}
          <FlatList
            data={imgs}
            keyExtractor={(item) => item.uri}
            style={{ flex: 1 }}
            horizontal={true}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setImgShowInModal(item.uri);
                    setIsImgModalVisible(true);
                  }}
                >
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 5,
                      paddingHorizontal: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      style={{ width: "100%", height: "100%" }}
                      source={{ uri: item.uri }}
                    />
                  </View>
                </TouchableOpacity>
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
          }}
        >
          {!imgs.length > 0 ? (
            <ThaiMdText>ถ่ายภาพขยะที่ขายอย่างน้อย 1 รูป</ThaiMdText>
          ) : null}
          <View
            style={{
              width: "100%",
              height: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <CustomButton
              style={{
                width: "50%",
                maxWidth: 100,
                height: "100%",
                maxHeight: 35,
                borderRadius: 5,
                marginRight: 10,
              }}
              btnColor={
                imgs.length > 0
                  ? Colors.button.cancel.btnBackground
                  : Colors.button.submit_primary_bright.btnBackground
              }
              onPress={takeImgHandler}
              btnTitleColor={
                imgs.length > 0
                  ? Colors.button.cancel.btnText
                  : Colors.button.submit_primary_bright.btnText
              }
              btnTitleFontSize={18}
            >
              <Ionicons
                name={"md-camera"}
                size={14}
                color={
                  imgs.length > 0
                    ? Colors.button.cancel.btnText
                    : Colors.button.submit_primary_bright.btnText
                }
              />
              <ThaiMdText style={{ fontSize: 12 }}>
                {" "}
                ถ่ายภาพ
                <ThaiBoldText
                  style={{
                    fontSize: 12,
                    color: Colors.on_primary_bright.high_constrast,
                  }}
                >{` ${imgs.length}`}</ThaiBoldText>
              </ThaiMdText>
            </CustomButton>
            {imgs.length > 0 ? (
              <CustomButton
                style={{
                  width: "50%",
                  maxWidth: 100,
                  height: "100%",
                  maxHeight: 35,
                  borderRadius: 5,
                  marginRight: 10,
                }}
                btnColor={Colors.button.submit_primary_bright.btnBackground}
                onPress={acceptHandler}
                btnTitleColor={Colors.button.submit_primary_bright.btnText}
                btnTitleFontSize={10}
              >
                <ThaiMdText style={{ fontSize: 10 }}> ยืนยันขาย</ThaiMdText>
              </CustomButton>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainerCard: {
    backgroundColor: Colors.secondary,
    alignSelf: "center",
  },
  userInfo: {
    alignItems: "center",
  },
  userImg: {
    width: "100%",
    height: "100%",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});
