import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { NavigationEvents } from "react-navigation";
import Colors from "../../constants/Colors";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as sellerItemsAction from "../../store/actions/sellerItemsAction";
import * as transactionAction from "../../store/actions/transactionAction";
import * as navigationBehaviorAction from "../../store/actions/navigationBehaviorAction";

import ModalShowAssignedTime from "../../components/ModalShowAssignedTime";
import ThaiRegText from "../../components/ThaiRegText";
import ThaiMdText from "../../components/ThaiMdText";
import CustomStatusBar from "../../components/UI/CustomStatusBar";

import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const BuyerChoice = props => {
  return (
    <TouchableOpacity
      style={{
        width: wp("90%"),
        height: hp("15%"),
        backgroundColor: Colors.secondary,
        alignSelf: "center",
        borderRadius: 10,
        margin: wp("3.75%"),
        justifyContent: "center",
        padding: 10
      }}
      onPress={props.onSelected}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          justifyContent: "space-around"
        }}
      >
        <View style={{ width: "70%", height: "100%", padding: 5 }}>
          <View
            style={{
              alignSelf: "center",
              height: "30%",
              width: "100%"
            }}
          >
            <ThaiRegText>
              {`ผู้รับซื้อ `}
              <ThaiBoldText
                style={{ fontSize: 12, color: Colors.primary_bright_variant }}
              >
                {props.buyerName}
              </ThaiBoldText>
            </ThaiRegText>
          </View>
          <View style={{ height: "70%", width: "100%" }}>
            <FlatList
              style={{ flex: 1 }}
              data={props.sellerItemsForSell.getFlatListFormat(false)}
              keyExtractor={item => item.type + item.subtype}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      height: 20,
                      width: "100%",
                      backgroundColor: Colors.secondary,
                      borderRadius: 5
                    }}
                  >
                    <ThaiRegText>
                      {`ประเภท `}
                      <ThaiMdText
                        style={{
                          fontSize: 10,
                          color: Colors.primary_bright_variant
                        }}
                      >
                        {item.subtype}
                      </ThaiMdText>
                      {props.purchaseList[item.type] == undefined ? (
                        <ThaiRegText
                          style={{ fontSize: Colors.error }}
                        >{` ไม่รับซื้อ `}</ThaiRegText>
                      ) : props.purchaseList[item.type][item.subtype] ==
                        undefined ? (
                        <ThaiRegText
                          style={{ fontSize: Colors.error }}
                        >{` ไม่รับซื้อ `}</ThaiRegText>
                      ) : (
                        `  ${item.amount} X ${
                          props.purchaseList[item.type][item.subtype]
                        } บาท/ชิ้น. = `
                      )}
                      <ThaiMdText
                        style={{
                          fontSize: 10,
                          color: Colors.primary_bright_variant
                        }}
                      >
                        {item.amount *
                          props.purchaseList[item.type][item.subtype]}
                      </ThaiMdText>
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
            padding: 3
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              backgroundColor: Colors.soft_primary_dark,
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            <ThaiRegText
              style={{ color: Colors.on_primary_dark.low_constrast }}
            >{`ราคารวม`}</ThaiRegText>
            <ThaiBoldText
              style={{
                fontSize: 24,
                color: Colors.on_primary_dark.high_constrast
              }}
            >
              {props.totalPrice}
            </ThaiBoldText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChooseBuyerScreen = props => {
  useEffect(() => {
    console.log("Choose Buyer Screen");
  }, []);
  const isOperationCompleted = useSelector(
    state => state.navigation.isOperationCompleted
  );

  const checkIsOperationCompleted = () => {
    if (isOperationCompleted === true) {
      props.navigation.navigate("ShowSellerItemsScreen");
    }
  };

  // required data for sending an transaction
  const sellerAddr = useSelector(state => state.user.userProfile.addr);
  const sellerItemsForSell = useSelector(
    state => state.sellerItems.sellerItemsForSell
  );
  const buyerListRedux = useSelector(state => state.sellerItems.buyerList);

  // trash user snapshot
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();

  // Callback fn
  const loadBuyer = useCallback(async () => {
    setIsRefreshing(true);
    // await dispatch(sellerItemsAction.getBuyerList(TEMP_QUERY_BUYER));
    await dispatch(
      sellerItemsAction.getBuyerList({
        distance: parseInt(props.navigation.getParam("distance"), 10),
        wasteType: sellerItemsForSell.getSelected(),
        addr: sellerAddr
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
  const [buyerName, setBuyerName] = useState("");
  const [buyerPriceInfo, setBuyerPriceInfo] = useState("");
  const [unavailableTypes, setUnavailableTypes] = useState("");

  const buyerSelectHandler = (buyerName, buyerPriceInfo, unavailableTypes) => {
    setSellMode(0);
    setBuyerName(buyerName);
    setBuyerPriceInfo(buyerPriceInfo);
    setUnavailableTypes(unavailableTypes);
    setDatapickerShow(true);
  };

  const quickSellHandler = () => {
    setSellMode(1);
    setDatapickerShow(true);
  };

  const [date, setDate] = useState(new Date().getTime()); //date that  will be passed to submit fn.
  const [selectedTimes, setSelectedTimes] = useState([]);
  handleDatePicked = date => {
    setDate(date);
    hideDateTimePicker();
    setModalVisible(true);
  };

  const submitSellRequest = useCallback(async () => {
    // ---------> FINAL: send to redux
    try {
      await dispatch(
        sellerItemsAction.sellRequest(
          sellerAddr,
          sellerItemsForSell,
          buyerName,
          buyerPriceInfo,
          unavailableTypes,
          selectedTimes,
          sellMode,
          buyerListRedux.unavailableTypes
        )
      );

      await dispatch(transactionAction.fetchTransaction("seller"));
      await dispatch(sellerItemsAction.fetchSellerItems());
      dispatch(navigationBehaviorAction.finishOperation());
      props.navigation.navigate("SellTransaction");
    } catch (err) {
      Alert.alert("ไม่สามารถขายขยะได้", err.message, [{ text: "OK" }]);
    }
  }, [
    dispatch,
    sellerAddr,
    sellerItemsForSell,
    buyerName,
    buyerPriceInfo,
    unavailableTypes,
    selectedTimes
  ]);

  // When 'assignedTime.selectedTimes' show it
  useEffect(() => {
    if (
      sellerAddr &&
      sellerItemsForSell.length &&
      selectedTimes.length &&
      buyerName &&
      buyerPriceInfo
    ) {
      console.log("choose buyer submit");
      submitSellRequest();
    } else if (sellMode === 1) {
      if (sellerAddr && sellerItemsForSell.length && selectedTimes.length) {
        console.log("quick sell submit");
        submitSellRequest();
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
        submitSellRequest={submitSellRequest}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        ...styles.screen,
        flex: 1
      }}
    >
      <NavigationEvents onWillFocus={checkIsOperationCompleted} />
      <CustomStatusBar />
      <LinearGradient
        colors={Colors.linearGradient}
        style={{
          width: wp("100%"),
          height: hp("100%"),
          backgroundColor: Colors.secondary,
          borderRadius: 10
        }}
      >
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            backgroundColor: Colors.soft_primary_dark,
            paddingVertical: 10,
            alignItems: "center"
          }}
        >
          <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_primary_dark.low_constrast,
                fontSize: 20
              }}
            >
              เลือกผู้รับซื้อ
            </ThaiBoldText>
          </View>
        </View>
        <View style={{ width: "100%", height: "70%" }}>
          <FlatList
            data={buyerListRedux}
            keyExtractor={item => item.id}
            onRefresh={loadBuyer}
            refreshing={isRefreshing}
            renderItem={({ item }) => {
              return (
                <BuyerChoice
                  sellerItemsForSell={sellerItemsForSell}
                  onSelected={() =>
                    buyerSelectHandler(
                      item.id,
                      item.purchaseList,
                      item.unavailableTypes
                    )
                  }
                  buyerName={item.id}
                  purchaseList={item.purchaseList}
                  totalPrice={item.totalPrice}
                />
              );
            }}
          />
        </View>
        {datepickerShow ? (
          <DateTimePicker
            mode="date"
            isVisible={datepickerShow}
            onConfirm={handleDatePicked}
            onCancel={hideDateTimePicker}
          />
        ) : null}

        <View
          style={{
            height: "20%",
            maxHeight: 60,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around"
          }}
        >
          <CustomButton
            style={{ width: "40%", height: "100%", borderRadius: 8 }}
            btnColor={Colors.button.cancel.btnBackground}
            onPress={() => props.navigation.goBack()}
            btnTitleColor={Colors.button.cancel.btnText}
            btnTitleFontSize={14}
          >
            <Ionicons
              name={"ios-arrow-back"}
              size={12}
              color={Colors.button.cancel.btnText}
            />
            <ThaiRegText
              style={{
                fontSize: 12
              }}
            >
              {` ย้อนกลับ`}
            </ThaiRegText>
          </CustomButton>

          <CustomButton
            style={{ width: "40%", height: "100%", borderRadius: 8 }}
            btnColor={Colors.button.submit_primary_dark.btnBackground}
            onPress={quickSellHandler}
            btnTitleColor={Colors.button.submit_primary_dark.btnText}
            btnTitleFontSize={14}
          >
            {/* <MaterialCommunityIcons
              name={"account-search"}
              size={12}
              color={Colors.button.start_operation_info.btnText}
            /> */}
            <ThaiRegText
              style={{
                fontSize: 12
              }}
            >
              {` ขายด่วน`}
            </ThaiRegText>
          </CustomButton>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});
