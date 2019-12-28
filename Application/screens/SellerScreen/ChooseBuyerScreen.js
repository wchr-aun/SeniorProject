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
import * as sellerItemsAction from "../../store/actions/sellerItemsAction";
import DateTimePicker from "react-native-modal-datetime-picker";

export default UserAuthenScreen = props => {
  useEffect(() => {
    console.log("Choose Buyer Screen");
  }, []);

  // required data for sending an transaction
  const sellerItemsForSell = useSelector(
    state => state.sellerItems.itemsForSell
  );
  const sellerAddr = useSelector(state => state.userProfile.user.addr);
  // const price = 0.5

  const buyerListRedux = useSelector(state => state.sellerItems.buyerList);

  // trash user snapshot
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();

  // Callback fn
  const loadBuyer = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(sellerItemsAction.getBuyerList());
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  // Load sellerItems from firebase and store it to redux "initially"
  useEffect(() => {
    setIsLoading(true);
    loadBuyer().then(() => {
      setIsLoading(false);
    });
  }, [loadBuyer]);

  const [datepickerShow, setDatapickerShow] = useState(false);
  showDateTimePicker = () => {
    // this.setState({ isDateTimePickerVisible: true });
    setDatapickerShow(true);
  };

  buyerSelectHandler = (buyerId, buyerPriceInfo) => {
    console.log("sellerAddr");
    console.log(sellerAddr);

    console.log("buyerId");
    console.log(buyerId);

    console.log("sellerItemsForSell");
    console.log(sellerItemsForSell);
    // Map waste price from buyer to transaction
    console.log("buyerPriceInfo");
    console.log(buyerPriceInfo);

    //   await dispatch(
    //     sellerItemsAction.chooseBuyerSell(
    //       userProfile.addr, <3
    //       trashsState.items, <3
    //       "nora-buyer", <3
    //       0.5
    //     )
    //   );
    setDatapickerShow(true);
  };

  hideDateTimePicker = () => {
    setDatapickerShow(false);
  };

  handleDatePicked = date => {
    console.log("A date has been picked: ", date.getTime());
    hideDateTimePicker();

    // Map
  };

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
            renderItem={itemData => (
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
                onPress={() =>
                  buyerSelectHandler(
                    itemData.item.id,
                    itemData.item.wastePriceInfo.purchaseList
                  )
                }
              >
                <View style={{ alignSelf: "center" }}>
                  <Text>{itemData.item.id}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ width: wp("90%"), height: hp("30") }}>
          {datepickerShow ? (
            <DateTimePicker
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
