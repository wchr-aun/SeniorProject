import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../../constants/Colors";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as sellerItemsAction from "../../store/actions/sellerItemsAction";
import * as transactionAction from "../../store/actions/transactionAction";
import ModalShowAssignedTime from "../../components/ModalShowAssignedTime";

export default UserAuthenScreen = props => {
  useEffect(() => {
    console.log("Choose Buyer Screen");
  }, []);

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

  const [datepickerShow, setDatapickerShow] = useState(false);
  showDateTimePicker = () => {
    setDatapickerShow(true);
  };

  const [buyerName, setBuyerName] = useState("");
  const [buyerPriceInfo, setBuyerPriceInfo] = useState("");
  buyerSelectHandler = (buyerName, buyerPriceInfo) => {
    setBuyerName(buyerName);
    setBuyerPriceInfo(buyerPriceInfo);
    setDatapickerShow(true);
  };

  hideDateTimePicker = () => {
    setDatapickerShow(false);
  };

  const [date, setDate] = useState(new Date().getTime()); //date that  will be passed to submit fn.
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  handleDatePicked = date => {
    setDate(date);
    hideDateTimePicker();
    setModalVisible(true);
  };

  const submitSellRequest = useCallback(async () => {
    // ---------> FINAL: send to redux
    try {
      await dispatch(
        sellerItemsAction.chooseBuyerSell(
          sellerAddr,
          sellerItemsForSell,
          buyerName,
          buyerPriceInfo,
          selectedTimes
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
      buyerName &&
      buyerPriceInfo &&
      selectedTimes.length
    )
      submitSellRequest();
  }, [selectedTimes]);

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

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        ...styles.screen,
        flex: 1
      }}
    >
      <View
        style={{
          paddingTop: getStatusBarHeight(),
          width: wp("100%"),
          height: hp("100%") + getStatusBarHeight(),
          backgroundColor: Colors.secondary,
          borderRadius: 10
        }}
      >
        <View style={{ width: "100%", height: hp("60%s") }}>
          <FlatList
            data={buyerListRedux}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
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
                  onPress={() => buyerSelectHandler(item.id, item.purchaseList)}
                >
                  <View style={{ alignSelf: "center" }}>
                    <Text>{item.id}</Text>
                  </View>
                </TouchableOpacity>
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
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

UserAuthenScreen.navigationOptions = {
  headerTitle: "UserAuthenScreen"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});
