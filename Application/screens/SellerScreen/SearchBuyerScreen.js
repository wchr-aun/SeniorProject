import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
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
import { getFavBuyers } from "../../utils/firebaseFunctions";

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
        padding: 10,
        ...styles.shadow
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
              ...styles.shadow,
              width: "100%",
              height: "100%",
              borderRadius: 8,
              backgroundColor: Colors.soft_secondary,
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            <ThaiRegText
              style={{ color: Colors.on_primary_bright.low_constrast }}
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

export default SearchBuyerScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();
  const isOperationCompleted = useSelector(
    state => state.navigation.isOperationCompleted
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
    console.log("Search Buyer Screen");
  }, []);

  // Callback fn
  const [buyerList, setBuyerList] = useState([]);
  // const loadBuyer = useCallback(async () => {
  //   setIsRefreshing(true);
  //   // let buyerInfo = await getFavBuyers();
  //   setBuyerList(buyerInfo);
  //   setIsRefreshing(false);
  // }, [dispatch, setIsRefreshing]);

  // // Load sellerItems from firebase and store it to redux "initially"
  // useEffect(() => {
  //   setIsLoading(true);
  //   loadBuyer().then(() => {
  //     setIsLoading(false);
  //   });
  // }, [loadBuyer]);

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
        flex: 1
      }}
    >
      <NavigationEvents onWillFocus={checkIsOperationCompleted} />
      <LinearGradient
        colors={Colors.linearGradientBright}
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
              ค้นหาผู้รับซื้อ
            </ThaiBoldText>
          </View>
        </View>
        {/* <View style={{ width: "100%", height: "70%" }}>
          <FlatList
            data={buyerList}
            keyExtractor={item => item.id}
            onRefresh={loadBuyer}
            refreshing={isRefreshing}
            renderItem={({ item }) => {
              return (
                // <BuyerChoice
                //   sellerItemsForSell={sellerItemsForSell}
                //   onSelected={() =>
                //     buyerSelectHandler(
                //       item.id,
                //       item.purchaseList,
                //       item.unavailableTypes
                //     )
                //   }
                //   buyerName={item.id}
                //   purchaseList={item.purchaseList}
                //   totalPrice={item.totalPrice}
                // />
                <></>
              );
            }}
          />
        </View> */}

        {/* <View
          style={{
            height: "20%",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              borderRadius: 8,
              maxHeight: 40
            }}
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
            style={{
              width: "40%",
              height: "100%",
              borderRadius: 8,
              maxHeight: 40
            }}
            btnColor={Colors.button.submit_primary_dark.btnBackground}
            onPress={quickSellHandler}
            btnTitleColor={Colors.button.submit_primary_dark.btnText}
            btnTitleFontSize={14}
          >
            <ThaiRegText
              style={{
                fontSize: 12
              }}
            >
              {` ขายด่วน`}
            </ThaiRegText>
          </CustomButton>
        </View> */}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  }
});
