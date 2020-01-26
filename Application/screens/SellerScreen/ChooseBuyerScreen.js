import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
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
import ThaiText from "../../components/ThaiText";
import ThaiTitleText from "../../components/ThaiTitleText";

const BuyerChoice = props => {
  return (
    <TouchableOpacity
      style={{
        width: wp("90%"),
        height: hp("15%"),
        backgroundColor: Colors.screen,
        alignSelf: "center",
        borderRadius: 10,
        margin: wp("3.75%"),
        justifyContent: "center"
      }}
      onPress={props.onSelected}
    >
      <View
        style={{
          alignSelf: "center",
          height: "30%",
          width: "100%",
          padding: 5
        }}
      >
        <ThaiText>{`ผู้รับซื้อ ${props.buyerName}`}</ThaiText>
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
                  height: 30,
                  width: "100%",
                  padding: 5,
                  backgroundColor: Colors.screen,
                  borderRadius: 5
                }}
              >
                <ThaiText>
                  <ThaiTitleText style={{ fontSize: 10 }}>
                    {item.subtype}
                  </ThaiTitleText>
                  {props.purchaseList[item.type] == undefined
                    ? ` ไม่รับซื้อ `
                    : props.purchaseList[item.type][item.subtype] == undefined
                    ? ` ไม่รับซื้อ `
                    : ` จำนวน ${item.amount} ราคารับซื้อ ${
                        props.purchaseList[item.type][item.subtype]
                      } = ${item.amount *
                        props.purchaseList[item.type][item.subtype]}`}
                </ThaiText>
              </View>
            );
          }}
        />
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
        wasteType: sellerItemsForSell,
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

  const buyerSelectHandler = (buyerName, buyerPriceInfo) => {
    setSellMode(0);
    setBuyerName(buyerName);
    setBuyerPriceInfo(buyerPriceInfo);
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
          selectedTimes,
          sellMode,
          buyerListRedux.unavailableTypes
        )
      );

      await dispatch(transactionAction.fetchTransaction("seller"));
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
      <View
        style={{
          paddingTop: getStatusBarHeight(),
          width: wp("100%"),
          height: hp("100%") + getStatusBarHeight(),
          backgroundColor: Colors.secondary,
          borderRadius: 10
        }}
      >
        <View style={{ width: "100%", height: hp("60%") }}>
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
                    buyerSelectHandler(item.id, item.purchaseList)
                  }
                  buyerName={item.id}
                  purchaseList={item.purchaseList}
                />
              );
            }}
          />
        </View>
        <View style={{ width: wp("90%"), height: hp("30") }}>
          {datepickerShow ? (
            <DateTimePicker
              mode="date"
              isVisible={datepickerShow}
              onConfirm={handleDatePicked}
              onCancel={hideDateTimePicker}
            />
          ) : null}
          <View style={{ width: "100%", height: 100 }}>
            <CustomButton
              style={{ width: "90%", height: "100%" }}
              btnColor={Colors.primary}
              onPress={quickSellHandler}
              btnTitleColor={Colors.on_primary}
              btnTitleFontSize={14}
            >
              ขายด่วน
            </CustomButton>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

ChooseBuyerScreen.navigationOptions = {
  headerTitle: "เลือกผู้รับซื้อขยะ"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});
