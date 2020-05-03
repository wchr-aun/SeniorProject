import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
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
import { ConfirmDialog } from "react-native-simple-dialogs";

import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import ModalLoading from "../../components/ModalLoading";
import ModalShowImg from "../../components/ModalShowImg";

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

const transactionReducer = (state, action) => {
  switch (action.type) {
    case "TIME_SELECT":
      const updatedAssignedTime = [...state.assignedTimes];
      let selectedTime = "";
      for (let i = 0; i < updatedAssignedTime.length; i++) {
        if (updatedAssignedTime[i].seconds === action.time.seconds) {
          updatedAssignedTime[i].selected = !updatedAssignedTime[i].selected;
          if (updatedAssignedTime[i].selected) {
            selectedTime = updatedAssignedTime[i];
          }
        } else {
          updatedAssignedTime[i].selected = false;
        }
      }
      return {
        assignedTimes: [...updatedAssignedTime],
        selectedTime,
      };

    default:
      return { ...state };
  }
};

export default SellingTransactionDetailScreen = (props) => {
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
  const [time, dispatchTransactionItem] = useReducer(transactionReducer, {
    assignedTimes: [...transactionItem.detail.assignedTime],
    selectedTime: transactionItem.detail.assignedTime[0],
  });

  const userRole = useSelector((state) => state.user.userRole);
  const wasteTypes = useSelector((state) => state.wasteType.wasteTypes);

  const [saleList, setSetList] = useState(
    new Wastes(transactionItem.detail.saleList).getFlatListFormat(true)
  );

  const dispatch = useDispatch();
  const cancelHandler = async () => {
    setIsInOperation(true);
    try {
      await dispatch(
        transactionAction.changeTransactionStatus({
          txID: transactionItem.txId,
          oldStatus: transactionItem.detail.txStatus, //for query
          newStatus: 4,
          userRole,
        })
      );
      await dispatch(transactionAction.fetchTransaction(userRole));
      setIsInOperation(false);
      Alert.alert(
        "ยกเลิกคำขอสำเร็จ",
        "คุณสามารถตรวจสอบรายการได้ที่หน้ารายการรับซื้อขยะ",
        [{ text: "OK" }]
      );
      props.navigation.goBack();
    } catch (err) {
      Alert.alert(
        "ยกเลิกคำขอไม่สำเร็จ",
        "คุณสามารถตรวจสอบรายการได้ที่หน้ารายการรับซื้อขยะ",
        [{ text: "OK" }]
      );
    }
  };

  const goBuyerDetail = () => {
    props.navigation.navigate({
      routeName: "BuyerDetailScreen",
      params: { buyerId: transactionItem.detail.buyer },
    });
  };

  const backHandler = () => {
    props.navigation.goBack();
  };

  const acceptPreferedtimeHandler = async () => {
    setIsInOperation(true);
    try {
      await dispatch(
        transactionAction.changeTransactionStatus({
          txID: transactionItem.txId,
          oldStatus: transactionItem.detail.txStatus, //for query
          chosenTime: time.selectedTime.seconds * 1000, //formattedTime.seconds * 1000
          newStatus: 2,
          txType: transactionItem.detail.txType,
          assignedTime: transactionItem.detail.assignedTime,
          userRole,
        })
      );
      setIsInOperation(false);
      props.navigation.goBack();
      Alert.alert(
        "ยอมรับวันที่เสนอสำเร็จ",
        "คุณสามารถตรวจสอบรายการได้ที่หน้ารายการรับซื้อขยะ",
        [{ text: "OK" }]
      );
    } catch (err) {
      Alert.alert("ยอมรับข้อเสนอไม่สำเร็จ", "โปรดตรวจสอบข้อมูลอีกครั้ง", [
        { text: "OK" },
      ]);
    }
  };

  // load sellerItem imgs
  const [imgShowInModal, setImgShowInModal] = useState("");
  const [isImgModalVisible, setIsImgModalVisible] = useState(false);
  const [imgs, setImgs] = useState([]);
  const loadImgs = async () => {
    let imgs = await libary.downloadingImg(transactionItem.detail.img, "tx");
    setImgs(imgs);
  };
  const slideImg = (indexSlide) => {
    let oldIndex = imgs.indexOf(imgShowInModal);
    let newIndex = oldIndex + indexSlide;
    if (newIndex != -1 && newIndex < imgs.length) {
      setImgShowInModal(imgs[newIndex]);
    }
  };

  // load buyer img
  const [buyerImg, setUserImg] = useState("");
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

  const [confirmCancleVisible, setConfirmCancleVisible] = useState(false);

  return (
    <View
      style={{
        ...styles.infoContainerCard,
        width: "100%",
        height: "100%",
      }}
    >
      {props.navigation.getParam("addCustomStatusbar") ? (
        <CustomStatusBar />
      ) : null}
      <ModalLoading modalVisible={isInOperation} userRole="seller" />
      <ConfirmDialog
        title="ยกเลิกการซื้อขายนี้"
        message="คุณต้องการยกเลิกคำสั่งซื้อขายนี้หรือไม่"
        visible={confirmCancleVisible}
        onTouchOutside={() => setConfirmCancleVisible(false)}
        positiveButton={{
          title: "ยกเลิก",
          onPress: () => {
            cancelHandler();
            setConfirmCancleVisible(false);
          },
        }}
        negativeButton={{
          title: "ไม่ต้องการ",
          onPress: () => {
            setConfirmCancleVisible(false);
          },
        }}
      />
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
      {/* tx infomation */}
      <TouchableOpacity onPress={goBuyerDetail}>
        <View
          style={{
            width: "95%",
            borderRadius: 5,
            overflow: "hidden",
            backgroundColor: Colors.secondary,
            alignItems: "center",
            alignSelf: "center",
            ...styles.shadow,
          }}
        >
          <View
            style={{
              flexDirection: "row",

              justifyContent: "space-around",
              padding: 5,
            }}
          >
            <View
              style={{
                width: "30%",
                padding: 5,
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <ImageCircle imgUrl={buyerImg} avariableWidth={wp("20%")} />
            </View>
            <View style={{ width: "70%", paddingHorizontal: 10 }}>
              <ThaiRegText
                style={{
                  fontSize: 14,
                  color: Colors.on_secondary.high_constrast,
                }}
              >
                {`สถานะ `}
                <ThaiMdText
                  style={{
                    fontSize: 14,
                    color: libary.getColorTxStatus(
                      transactionItem.detail.txStatus
                    ),
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
                  color: Colors.on_secondary.high_constrast,
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
                  color: Colors.on_secondary.high_constrast,
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
              <View
                style={{
                  width: "100%",
                  alignItems: "flex-end",
                  marginVertical: 5,
                }}
              >
                <ThaiRegText
                  style={{ fontSize: 12, color: Colors.soft_primary_dark }}
                >
                  กดเพื่อดูรายละเอียดผู้รับซื้อ
                </ThaiRegText>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: libary.getColorTxStatus(
                transactionItem.detail.txStatus
              ),
              height: 10,
              width: "100%",
            }}
          />
        </View>
      </TouchableOpacity>

      <View
        style={{
          width: "100%",
          height: "5%",
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <ThaiMdText
          style={{ fontSize: 12, color: Colors.on_secondary.high_constrast }}
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
          width: "90%",
          maxHeight: "15%",
          backgroundColor: Colors.hard_secondary,
          borderRadius: 5,
          paddingVertical: 5,
          alignSelf: "center",
          ...styles.shadow,
        }}
      >
        <FlatList
          data={time.assignedTimes}
          keyExtractor={(timeObj) =>
            libary.formatDate(timeObj.toDate()) +
            libary.formatTime(timeObj.toDate())
          }
          renderItem={({ item: timeObj }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  dispatchTransactionItem({
                    type: "TIME_SELECT",
                    time: timeObj,
                  })
                }
              >
                <View style={{ height: 25, alignSelf: "center" }}>
                  <ThaiRegText
                    style={{
                      fontSize: 18,
                      color:
                        transactionItem.detail.chosenTime != undefined
                          ? transactionItem.detail.chosenTime.seconds ===
                            timeObj.seconds
                            ? Colors.soft_primary_bright
                            : Colors.soft_secondary
                          : Colors.soft_secondary,
                    }}
                  >
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color:
                          transactionItem.detail.chosenTime != undefined
                            ? transactionItem.detail.chosenTime.seconds ===
                              timeObj.seconds
                              ? Colors.soft_primary_bright
                              : Colors.soft_primary_dark
                            : Colors.soft_primary_dark,
                      }}
                    >
                      {`${libary.formatDate(
                        timeObj.toDate()
                      )} ${libary.formatTime(timeObj.toDate())} `}
                    </ThaiMdText>
                    <ThaiMdText
                      style={{
                        fontSize: 18,
                        color:
                          transactionItem.detail.chosenTime != undefined
                            ? transactionItem.detail.chosenTime.seconds ===
                              timeObj.seconds
                              ? Colors.soft_primary_bright
                              : Colors.soft_primary_dark
                            : Colors.soft_primary_dark,
                      }}
                    >
                      {transactionItem.detail.txStatus === 1 ? (
                        <MaterialIcons
                          name={
                            timeObj.selected
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
      <View
        style={{
          width: "100%",
          height: "5%",
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <ThaiMdText
          style={{ fontSize: 12, color: Colors.on_secondary.high_constrast }}
        >
          ประเภทขยะที่ขาย
        </ThaiMdText>
      </View>
      <View
        style={{
          width: "90%",
          maxHeight: "15%",
          backgroundColor: Colors.hard_secondary,
          borderRadius: 5,
          paddingVertical: 5,
          alignSelf: "center",
          ...styles.shadow,
        }}
      >
        <FlatList
          data={saleList}
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
                      style={{ fontSize: 18, color: Colors.soft_primary_dark }}
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
          style={{ fontSize: 12, color: Colors.on_secondary.high_constrast }}
        >
          รูปภาพขยะ (กดที่ภาพ เพื่อขยาย)
        </ThaiMdText>
      </View>
      <View
        style={{
          width: "100%",
          height: "10%",
          padding: 2,
          paddingHorizontal: 10,
        }}
      >
        <FlatList
          data={imgs}
          keyExtractor={(item) => item}
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
                    overflow: "hidden",
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
          paddingBottom: getStatusBarHeight(),
        }}
      >
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
              width: "40%",
              height: "100%",
              maxHeight: 40,
              borderRadius: 5,
            }}
            btnColor={
              getDisableStatusForSeller(4, transactionItem.detail.txStatus)
                ? Colors.button.danger_operation.btnBackgroundDisabled
                : Colors.button.danger_operation.btnBackground
            }
            onPress={
              getDisableStatusForSeller(4, transactionItem.detail.txStatus)
                ? null
                : () => setConfirmCancleVisible(true)
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

          {time.selectedTime != "" ? (
            <CustomButton
              style={{
                width: "40%",
                height: "100%",
                maxHeight: 40,
                borderRadius: 5,
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
          ) : null}
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
