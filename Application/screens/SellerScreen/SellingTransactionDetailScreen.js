import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal
} from "react-native";
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
import ModalLoading from "../../components/ModalLoading";

const ModalShowImg = props => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.5"
        }}
      >
        <View
          style={{
            width: "80%",
            height: "80%",
            backgroundColor: "white",
            borderRadius: 5,
            padding: 5
          }}
        >
          <View
            style={{
              width: "100%",
              height: "80%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
                overflow: "hidden"
              }}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{ uri: props.uri }}
              />
            </View>
          </View>

          <View
            style={{
              width: "100%",
              height: "15%",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <CustomButton
              style={{
                width: "30%",
                maxWidth: 40,
                height: "100%",
                maxHeight: 40,
                borderRadius: 5
              }}
              btnColor={Colors.button.submit_primary_dark.btnBackground}
              onPress={() => {
                props.slideImg(-1);
              }}
              btnTitleColor={Colors.button.submit_primary_dark.btnText}
              btnTitleFontSize={10}
            >
              <Ionicons
                name="ios-arrow-back"
                color={Colors.button.submit_primary_dark.btnText}
                size={10}
              />
              <ThaiMdText style={{ fontSize: 10 }}> </ThaiMdText>
            </CustomButton>

            <CustomButton
              style={{
                width: "30%",
                maxWidth: 80,
                height: "100%",
                maxHeight: 50,
                borderRadius: 5
              }}
              btnColor={Colors.button.cancel.btnBackground}
              onPress={() => {
                props.setIsImgModalVisible(false);
              }}
              btnTitleColor={Colors.button.cancel.btnText}
              btnTitleFontSize={10}
            >
              <MaterialIcons
                name={"cancel"}
                color={Colors.button.cancel.btnText}
                size={10}
              />
              <ThaiMdText style={{ fontSize: 10 }}> ปิดหน้าต่าง</ThaiMdText>
            </CustomButton>

            <CustomButton
              style={{
                width: "30%",
                maxWidth: 40,
                height: "100%",
                maxHeight: 40,
                borderRadius: 5
              }}
              btnColor={Colors.button.submit_primary_dark.btnBackground}
              onPress={() => props.slideImg(1)}
              btnTitleColor={Colors.button.submit_primary_dark.btnText}
              btnTitleFontSize={10}
            >
              <Ionicons
                name="ios-arrow-forward"
                color={Colors.button.submit_primary_dark.btnText}
                size={10}
              />
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getDisableStatusForSeller = (btnType, txStatus) => {
  /* 
  accept --> 2
  cancel --> 4
  */
  switch (txStatus) {
    case 0:
      if (btnType != 4) return true;
      else return false;
    case 1:
      if (btnType != 4 && btnType != 2) return true;
      else return false;
    case 2:
      if (btnType != 4) return true;
      else return false;
    case 3:
      return true;
    case 4:
      return true;
    case 5:
      return true;
    default:
      break;
  }
};

export default SellingTransactionDetailScreen = props => {
  // Get a parameter that sent from the previous page.
  const [isInOperation, setIsInOperation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //add spinner loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary_bright_variant} />
      </View>
    );
  }
  const transactionItem = props.navigation.getParam("transactionItem");
  const userRole = useSelector(state => state.user.userRole);

  const [saleList, setSetList] = useState(
    new Wastes(transactionItem.detail.saleList).getFlatListFormat(true)
  );

  const [timeSelected, setTimeSelected] = useState("");
  const onTimeSelectedHandler = timeItem => {
    if (timeSelected === timeItem) setTimeSelected("");
    else setTimeSelected(timeItem);
  };

  const dispatch = useDispatch();
  const cancelHandler = async () => {
    setIsInOperation(true);
    await dispatch(
      transactionAction.changeTransactionStatus({
        txID: transactionItem.txId,
        oldStatus: transactionItem.detail.txStatus, //for query
        newStatus: 4,
        userRole
      })
    );
    await dispatch(transactionAction.fetchTransaction(userRole));
    setIsInOperation(false);
    props.navigation.goBack();
  };

  const backHandler = () => {
    props.navigation.goBack();
  };

  const acceptPreferedtimeHandler = async () => {
    setIsInOperation(true);
    await dispatch(
      transactionAction.changeTransactionStatus({
        txID: transactionItem.txId,
        oldStatus: transactionItem.detail.txStatus, //for query
        chosenTime: timeSelected.seconds * 1000, //formattedTime.seconds * 1000
        newStatus: 2,
        txType: transactionItem.detail.txType,
        assignedTime: transactionItem.detail.assignedTime,
        userRole
      })
    );
    setIsInOperation(false);
    props.navigation.goBack();
  };

  // load sellerItem imgs
  const [imgShowInModal, setImgShowInModal] = useState("");
  const [isImgModalVisible, setIsImgModalVisible] = useState(false);
  const [imgs, setImgs] = useState([]);
  const loadImgs = async () => {
    let imgs = await libary.downloadingImg(transactionItem.detail.img, "tx");
    setImgs(imgs);
  };
  const slideImg = indexSlide => {
    let oldIndex = imgs.indexOf(imgShowInModal);
    let newIndex = oldIndex + indexSlide;
    if (newIndex != -1 && newIndex < imgs.length) {
      setImgShowInModal(imgs[newIndex]);
    }
  };
  // load seller img
  const [userImg, setUserImg] = useState("");
  const loadBuyerImg = async () => {
    let imgUri = "";
    if (transactionItem.detail.buyer) {
      imgUri = await libary.downloadingImg(
        [`${transactionItem.detail.buyer}.jpg`],
        "user"
      );
    }
    setUserImg(imgUri != "" ? imgUri[0] : "");
  };

  // Run loading
  useEffect(() => {
    setIsLoading(true);
    loadImgs();
    loadBuyerImg();
    setIsLoading(false);
  }, []);

  return (
    <View
      style={{
        ...styles.infoContainerCard,
        width: "100%",
        height: "100%"
      }}
    >
      {props.navigation.getParam("addCustomStatusbar") ? (
        <CustomStatusBar />
      ) : null}
      <ModalLoading modalVisible={isInOperation} userRole="seller" />
      <ModalShowImg
        modalVisible={isImgModalVisible}
        onRequestClose={() => console.log("modal close")}
        setIsImgModalVisible={setIsImgModalVisible}
        uri={imgShowInModal}
        slideImg={slideImg}
      />
      <View
        style={{
          height: "10%",
          width: "100%",
          flexDirection: "row",
          backgroundColor: Colors.soft_primary_dark,
          paddingVertical: 10,
          justifyContent: "space-around",
          alignItems: "center"
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
            width: "50%",
            height: "100%",
            alignItems: "center",
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
        <View style={{ width: "20%", height: "100%" }}>
          {/* used for fulfll space */}
        </View>
      </View>
      <View
        style={{
          height: "20%",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        <View
          style={{
            width: "30%",
            height: "80%",
            padding: 5,
            alignItems: "center",
            paddingHorizontal: 10
          }}
        >
          <ImageCircle imgUrl={userImg} avariableWidth={wp("20%")} />
        </View>
        <View style={{ width: "70%", height: "80%", paddingHorizontal: 10 }}>
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
              {libary.getReadableTxStatus(
                transactionItem.detail.txStatus,
                "seller"
              )}
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
          {transactionItem.detail.txStatus === 0
            ? "เวลาที่คุณเสนอ"
            : transactionItem.detail.txStatus === 1
            ? "เวลาที่ผู้รับซื้อเสนอ"
            : "วันเวลาที่เสนอขาย(สีขาว) วันเวลาที่ตกลง(สีเขียว)"}
        </ThaiMdText>
      </View>
      <View
        style={{
          width: "100%",
          height: "15%",
          borderRadius: 5,
          paddingHorizontal: 10
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Colors.soft_primary_dark,
            borderRadius: 5
          }}
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
                <TouchableOpacity onPress={() => onTimeSelectedHandler(item)}>
                  <View style={{ height: 25, alignSelf: "center" }}>
                    <ThaiRegText
                      style={{
                        fontSize: 18,
                        color:
                          transactionItem.detail.chosenTime != undefined
                            ? transactionItem.detail.chosenTime.seconds ===
                              item.seconds
                              ? Colors.soft_primary_bright
                              : Colors.soft_secondary
                            : Colors.soft_secondary
                      }}
                    >
                      <ThaiMdText
                        style={{
                          fontSize: 18,
                          color:
                            transactionItem.detail.chosenTime != undefined
                              ? transactionItem.detail.chosenTime.seconds ===
                                item.seconds
                                ? Colors.soft_primary_bright
                                : Colors.soft_secondary
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
                            transactionItem.detail.chosenTime != undefined
                              ? transactionItem.detail.chosenTime.seconds ===
                                item.seconds
                                ? Colors.soft_primary_bright
                                : Colors.soft_secondary
                              : Colors.soft_secondary
                        }}
                      >
                        {libary.formatTime(item.toDate())}
                        {transactionItem.detail.txStatus === 1 ? (
                          <MaterialIcons
                            name={
                              item.seconds === timeSelected.seconds
                                ? "check-box"
                                : "check-box-outline-blank"
                            }
                            size={20}
                            color={Colors.primary_bright}
                          />
                        ) : null}
                      </ThaiMdText>
                    </ThaiRegText>
                  </View>
                </TouchableOpacity>
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
          borderRadius: 5,
          paddingHorizontal: 10
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Colors.soft_primary_dark,
            borderRadius: 5
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
          รูปภาพขยะ (กดที่ภาพ เพื่อขยาย)
        </ThaiMdText>
      </View>
      <View
        style={{
          width: "100%",
          height: "10%",
          padding: 2,
          paddingHorizontal: 10
        }}
      >
        <FlatList
          data={imgs}
          keyExtractor={item => item}
          style={{ flex: 1 }}
          horizontal={true}
          renderItem={({ item: uri }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setImgShowInModal(uri);
                  setIsImgModalVisible(true);
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 5,
                    paddingHorizontal: 2,
                    overflow: "hidden"
                  }}
                >
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri }}
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
              maxHeight: 40,
              borderRadius: 5
            }}
            btnColor={
              getDisableStatusForSeller(4, transactionItem.detail.txStatus)
                ? Colors.button.danger_operation.btnBackgroundDisabled
                : Colors.button.danger_operation.btnBackground
            }
            onPress={
              getDisableStatusForSeller(4, transactionItem.detail.txStatus)
                ? null
                : cancelHandler
            }
            btnTitleColor={
              getDisableStatusForSeller(4, transactionItem.detail.txStatus)
                ? Colors.button.danger_operation.btnTextDisabled
                : Colors.button.danger_operation.btnText
            }
            btnTitleFontSize={18}
          >
            <MaterialIcons name={"cancel"} size={14} />
            <ThaiMdText style={{ fontSize: 18 }}> ยกเลิก</ThaiMdText>
          </CustomButton>

          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              maxHeight: 40,
              borderRadius: 5
            }}
            btnColor={
              getDisableStatusForSeller(2, transactionItem.detail.txStatus)
                ? Colors.button.submit_primary_bright.btnBackgroundDisabled
                : Colors.button.submit_primary_bright.btnBackground
            }
            btnTitleColor={
              getDisableStatusForSeller(2, transactionItem.detail.txStatus)
                ? Colors.button.submit_primary_bright.btnTextDisabled
                : Colors.button.submit_primary_bright.btnText
            }
            onPress={
              getDisableStatusForSeller(2, transactionItem.detail.txStatus)
                ? null
                : acceptPreferedtimeHandler
            }
            btnTitleFontSize={12}
          >
            <MaterialCommunityIcons
              name={"calendar-multiple-check"}
              size={12}
            />
            <ThaiMdText style={{ fontSize: 12 }}> ว่างในเวลาเสนอ</ThaiMdText>
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
