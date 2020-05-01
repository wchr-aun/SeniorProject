import React, { useCallback, useState, useEffect, useReducer } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import { NavigationEvents } from "react-navigation";
import Colors from "../../constants/Colors";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as sellerItemsAction from "../../store/actions/sellerItemsAction";

import ModalShowAssignedTime from "../../components/ModalShowAssignedTime";
import ThaiRegText from "../../components/ThaiRegText";
import ThaiMdText from "../../components/ThaiMdText";
import CustomStatusBar from "../../components/UI/CustomStatusBar";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ModalLoading from "../../components/ModalLoading";
import ThaiBoldText from "../../components/ThaiBoldText";

const buyerChoiceReducer = (state, action) => {
  switch (action.type) {
    case "SET_BUYER_LIST":
      const updatedBuyerList = [...action.buyerList];
      for (let i = 0; i < updatedBuyerList.length; i++) {
        updatedBuyerList[i].selected = false;
      }

      return {
        buyerList: [...updatedBuyerList],
      };
    case "SELECT":
      const tempBuyerList = [...state.buyerList];
      let haveEleSelected = true;

      // for select other selected comp
      for (let i = 0; i < tempBuyerList.length; i++) {
        // the same
        if (
          tempBuyerList[i].selected &&
          tempBuyerList[i].id === action.buyerName
        ) {
          tempBuyerList[i].selected = false;
          haveEleSelected = false;
          continue;
        }

        tempBuyerList[i].selected = false;
        if (tempBuyerList[i].id === action.buyerName) {
          tempBuyerList[i].selected = true;
        }
      }
      return { buyerList: [...tempBuyerList], haveEleSelected };
    default:
      throw new Error();
  }
};

const BuyerChoice = ({
  selected,
  onSelected,
  sellerItemsForSell,
  buyerName,
  purchaseList,
  totalPrice,
}) => {
  return (
    <TouchableOpacity
      style={{
        width: wp("90%"),
        height: 100,
        backgroundColor: Colors.secondary,
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: 5,
        justifyContent: "center",
        padding: 10,
        ...styles.shadow,
        borderWidth: selected ? 2 : 0,
        borderColor: selected ? "green" : "dark",
      }}
      onPress={() => {
        onSelected();
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ width: "70%", height: "100%", padding: 5 }}>
          <View
            style={{
              alignSelf: "center",
              height: "30%",
              width: "100%",
            }}
          >
            <ThaiRegText>
              {`ผู้รับซื้อ `}
              <ThaiBoldText
                style={{ fontSize: 12, color: Colors.primary_bright_variant }}
              >
                {buyerName}
              </ThaiBoldText>
            </ThaiRegText>
          </View>
          <View style={{ height: "70%", width: "100%" }}>
            <FlatList
              style={{ flex: 1 }}
              data={sellerItemsForSell.getFlatListFormat(false)}
              keyExtractor={(item) => item.type + item.subtype}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      height: 20,
                      width: "100%",
                      backgroundColor: Colors.secondary,
                      borderRadius: 5,
                    }}
                  >
                    <ThaiRegText>
                      {`ประเภท `}
                      <ThaiMdText
                        style={{
                          fontSize: 10,
                          color: Colors.primary_bright_variant,
                        }}
                      >
                        {item.subtype}
                      </ThaiMdText>
                      {purchaseList[item.type] == undefined ? (
                        <ThaiRegText
                          style={{ color: Colors.error }}
                        >{` ไม่รับซื้อ `}</ThaiRegText>
                      ) : purchaseList[item.type][item.subtype] == undefined ? (
                        <ThaiRegText
                          style={{ color: Colors.error }}
                        >{` ไม่รับซื้อ `}</ThaiRegText>
                      ) : (
                        `  ${item.amount} X ${
                          purchaseList[item.type][item.subtype]
                        } บาท/ชิ้น. = `
                      )}
                      {purchaseList[item.type] ==
                      undefined ? null : purchaseList[item.type][
                          item.subtype
                        ] == undefined ? null : (
                        <ThaiMdText
                          style={{
                            fontSize: 10,
                            color: Colors.primary_bright_variant,
                          }}
                        >
                          {item.amount * purchaseList[item.type][item.subtype]}
                        </ThaiMdText>
                      )}
                    </ThaiRegText>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: "30%",
            height: "100%",
            justifyContent: "center",
            padding: 3,
          }}
        >
          <View
            style={{
              ...styles.shadow,
              width: "100%",
              height: "100%",
              borderRadius: 8,
              backgroundColor: Colors.soft_secondary,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <ThaiRegText
              style={{ color: Colors.on_primary_bright.low_constrast }}
            >{`ราคารวม`}</ThaiRegText>
            <ThaiBoldText
              style={{
                fontSize: 24,
                color: Colors.on_primary_dark.high_constrast,
              }}
            >
              {totalPrice}
            </ThaiBoldText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChooseBuyerScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInOperation, setIsInOperation] = useState(false);
  const dispatch = useDispatch();
  const isOperationCompleted = useSelector(
    (state) => state.navigation.isOperationCompleted
  );
  const checkIsOperationCompleted = () => {
    if (isOperationCompleted === true) {
      props.navigation.navigate("ShowSellerItemsScreen");
    } else {
      setIsLoading(true);
      loadBuyer();
      setIsLoading(false);
    }
  };
  useEffect(() => {
    console.log("Choose Buyer Screen");
  }, []);

  // required data for sending an transaction
  const sellerAddr = useSelector((state) => state.user.userProfile.addr);
  const sellerItemsForSell = useSelector(
    (state) => state.sellerItems.sellerItemsForSell
  );
  const buyerListRedux = useSelector((state) => state.sellerItems.buyerList);
  const [buyerChoiceState, dispatchBuyerChoice] = useReducer(
    buyerChoiceReducer,
    { buyerList: [...buyerListRedux] }
  );
  useEffect(() => {
    dispatchBuyerChoice({
      type: "SET_BUYER_LIST",
      buyerList: [...buyerListRedux],
    });
  }, [buyerListRedux]);

  // Callback fn
  const loadBuyer = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(
      sellerItemsAction.getBuyerList({
        distance: parseInt(props.navigation.getParam("distance"), 10),
        wasteType: sellerItemsForSell.getSelected(),
        addr: sellerAddr,
      })
    );
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing, sellerAddr]);

  // Load sellerItems from firebase and store it to redux "initially"
  useEffect(() => {
    setIsLoading(true);
    if (sellerAddr && sellerItemsForSell) {
      loadBuyer().then(() => {
        setIsLoading(false);
      });
    }
  }, [loadBuyer, sellerAddr]);

  // date picker
  const [datepickerShow, setDatapickerShow] = useState(false);
  showDateTimePicker = () => {
    setDatapickerShow(true);
  };
  hideDateTimePicker = () => {
    setDatapickerShow(false);
  };

  const [sellMode, setSellMode] = useState(0);
  const [buyerInfomation, setBuyerInfomation] = useState("");

  const goBuyerDetail = (buyerName) => {
    props.navigation.navigate({
      routeName: "BuyerDetailScreen",
      params: { buyerId: buyerName },
    });
  };

  const buyerSelectHandler = (buyerName, buyerPriceInfo, unavailableTypes) => {
    // this should set to redux ---
    setSellMode(0);
    setBuyerInfomation({
      buyerName,
      buyerPriceInfo,
      unavailableTypes,
    });

    // setSelectedBuyer(buyerName);
    dispatchBuyerChoice({ type: "SELECT", buyerName });
  };

  const quickSellHandler = () => {
    setSellMode(1);
    setDatapickerShow(true);
  };

  const [date, setDate] = useState(new Date().getTime()); //date that  will be passed to submit fn.
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleDatePicked = (date) => {
    setDate(date);
    hideDateTimePicker();
    setModalVisible(true);
  };

  const settingSellRequest = useCallback(async () => {
    // ---------> FINAL: send to redux
    try {
      // sell only sellerItem that buyer have
      let saleList = {};
      saleList["length"] = 0;

      for (let type in sellerItemsForSell) {
        if (type != "length" && type != "_count" && type != "_selected") {
          for (let subtype in sellerItemsForSell[type]) {
            // quick sell
            if (sellMode === 1) {
              if (!sellerItemsForSell._selected[type][subtype] == false) {
                if (saleList[type] == undefined) {
                  saleList[type] = {};
                }
                saleList["length"] += 1;
                saleList[type][subtype] = {
                  amount: sellerItemsForSell[type][subtype],
                };
              }
            }
            // chooseBuyer sell
            else {
              if (
                !(
                  buyerInfomation.buyerPriceInfo[type] == undefined ||
                  buyerInfomation.buyerPriceInfo[type][subtype] == undefined ||
                  sellerItemsForSell._selected[type][subtype] == false
                )
              ) {
                // if (buyerInfomation.unavailableTypes[subtype] != undefined) break;
                if (saleList[type] == undefined) {
                  saleList[type] = {};
                }
                saleList["length"] += 1;
                saleList[type][subtype] = {
                  amount: sellerItemsForSell[type][subtype],
                  price: buyerInfomation.buyerPriceInfo[type][subtype],
                };
              }
            }
          }
        }
      }

      props.navigation.navigate({
        routeName: "sellReqBeforeSending",
        params: {
          sellReq: {
            buyerInfomation, //purchaseList same
            sellMode,
            assignedTime: selectedTimes,
            sellerAddr,
            saleList,
            sellerAddr,
          },
        },
      });
    } catch (err) {
      Alert.alert("มีข้อผิดพลาดเกิดขึ้น", err.message, [{ text: "OK" }]);
    }
  }, [
    dispatch,
    sellerAddr,
    sellerItemsForSell,
    buyerInfomation,
    selectedTimes,
  ]);

  // When 'assignedTime.selectedTimes' show it
  useEffect(() => {
    if (
      sellerAddr &&
      sellerItemsForSell.length &&
      selectedTimes.length &&
      buyerInfomation &&
      sellMode === 0
    ) {
      settingSellRequest();
    } else if (sellMode === 1) {
      if (sellerAddr && sellerItemsForSell.length && selectedTimes.length) {
        settingSellRequest();
      }
    }
  }, [selectedTimes]);

  const [modalVisible, setModalVisible] = useState(false);
  if (modalVisible) {
    return (
      <ModalShowAssignedTime
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        date={date}
        setSelectedTimes={setSelectedTimes}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary_bright_variant} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        ...styles.screen,
        flex: 1,
      }}
    >
      <NavigationEvents onWillFocus={checkIsOperationCompleted} />
      <CustomStatusBar />
      <ModalLoading modalVisible={isInOperation} userRole={"seller"} />
      {datepickerShow ? (
        <DateTimePicker
          mode="date"
          isVisible={datepickerShow}
          onConfirm={handleDatePicked}
          onCancel={hideDateTimePicker}
        />
      ) : null}
      <LinearGradient
        colors={Colors.linearGradientBright}
        style={{
          width: wp("100%"),
          height: hp("100%"),
          backgroundColor: Colors.secondary,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            backgroundColor: Colors.secondary,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View style={{ width: "20%" }}>
            <CustomButton
              style={{
                height: "100%",
                maxHeight: 30,
                borderRadius: 5,
              }}
              btnColor={Colors.button.cancel.btnBackground}
              onPress={() => props.navigation.goBack()}
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
          </View>
          <View style={{ width: "50%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_secondary.high_constrast,
                fontSize: 18,
              }}
            >
              เลือกผู้รับซื้อที่คุณสนใจ
            </ThaiBoldText>
          </View>
          <View
            style={{
              width: "20%",
            }}
          />
        </View>

        <View style={{ width: "100%", height: "70%" }}>
          <TouchableOpacity onPress={quickSellHandler}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: wp("90%"),
                maxHeight: 50,
                backgroundColor: Colors.primary_dark,
                alignSelf: "center",
                borderRadius: 10,
                padding: 10,
                ...styles.shadow,
              }}
            >
              <View style={{ justifyContent: "center", marginHorizontal: 3 }}>
                <MaterialCommunityIcons
                  name="truck-fast"
                  color={Colors.on_primary_dark.low_constrast}
                  size={30}
                />
              </View>
              <View style={{ justifyContent: "center", marginHorizontal: 3 }}>
                <ThaiBoldText
                  style={{
                    fontSize: 30,
                    color: Colors.on_primary_dark.low_constrast,
                  }}
                >
                  ขายด่วน
                </ThaiBoldText>
              </View>
            </View>
          </TouchableOpacity>

          {buyerListRedux.length > 0 ? (
            <FlatList
              data={
                buyerChoiceState.buyerList ? buyerChoiceState.buyerList : []
              }
              keyExtractor={(item) => item.id}
              onRefresh={loadBuyer}
              refreshing={isRefreshing}
              renderItem={({ item }) => {
                return (
                  <BuyerChoice
                    sellerItemsForSell={sellerItemsForSell}
                    onSelected={() => {
                      buyerSelectHandler(
                        item.id,
                        item.purchaseList,
                        item.unavailableTypes
                      );
                    }}
                    selected={item.selected}
                    buyerName={item.id}
                    purchaseList={item.purchaseList}
                    totalPrice={item.totalPrice}
                  />
                );
              }}
            />
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ThaiMdText style={{ fontSize: 20 }}>
                ไม่มีผู้ซื้อที่รับซื้อขยะของ ในตอนนี้{" "}
              </ThaiMdText>
            </View>
          )}
        </View>

        <View
          style={{
            height: "20%",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              borderRadius: 8,
              maxHeight: 40,
            }}
            btnColor={
              buyerChoiceState.haveEleSelected
                ? Colors.button.submit_soft_primary_dark.btnBackground
                : Colors.button.disabled.btnBackground
            }
            onPress={
              buyerChoiceState.haveEleSelected
                ? () => goBuyerDetail(buyerInfomation.buyerName)
                : null
            }
            btnTitleColor={
              buyerChoiceState.haveEleSelected
                ? Colors.button.submit_soft_primary_dark.btnText
                : Colors.button.disabled.btnText
            }
            btnTitleFontSize={14}
          >
            <ThaiRegText
              style={{
                fontSize: 12,
              }}
            >
              {`ดูรายละเอียดผู้รับซื้อ`}
            </ThaiRegText>
          </CustomButton>

          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              borderRadius: 8,
              maxHeight: 40,
            }}
            btnColor={
              buyerChoiceState.haveEleSelected
                ? Colors.button.submit_primary_bright.btnBackground
                : Colors.button.disabled.btnBackground
            }
            onPress={
              buyerChoiceState.haveEleSelected
                ? () => setDatapickerShow(true)
                : null
            }
            btnTitleColor={
              buyerChoiceState.haveEleSelected
                ? Colors.button.submit_primary_bright.btnText
                : Colors.button.disabled.btnText
            }
            btnTitleFontSize={14}
          >
            <ThaiRegText
              style={{
                fontSize: 12,
              }}
            >
              {`เลือกวันที่`}
            </ThaiRegText>
          </CustomButton>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});
