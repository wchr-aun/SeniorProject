import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import UserInfoCard from "../../components/UserInfoCard";
import ThaiTitleText from "../../components/ThaiBoldText";
import SellTransactionCard from "../../components/SellTransactionCard";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AppVariableSetting from "../../constants/AppVariableSetting";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import * as transactionAction from "../../store/actions/transactionAction";

import libary from "../../utils/libary";
import CustomButton from "../../components/UI/CustomButton";
import ThaiBoldText from "../../components/ThaiBoldText";
import { Ionicons } from "@expo/vector-icons";

export default SellerHomepageScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const dispatch = useDispatch();

  // error handling
  const [error, setError] = useState("");
  useEffect(() => {
    if (error) {
      Alert.alert("การแจ้งเตือน", error, [{ text: "OK" }]);
    }
  }, [error]);

  // Get user profile
  const userProfile = useSelector((state) => state.user.userProfile);
  const userRole = useSelector((state) => state.user.userRole);
  const transactions = useSelector((state) => state.transactions.transactions);
  const [txShow, setTxShow] = useState([]);

  // Show comming transaction
  useEffect(() => {
    if (transactions) {
      let tmpTxShow = transactions[3]
        .concat(transactions[1])
        .concat(transactions[2])
        .concat(transactions[5]);
      setTxShow(tmpTxShow);
    }
  }, [transactions]);

  // For looking into transaction detail
  const selectedHandler = (transactionItem) => {
    props.navigation.navigate({
      routeName: "SellingTransactionDetailScreen",
      params: {
        transactionItem,
        addCustomStatusbar: true,
      },
    });
  };

  // --------------- loading section --------------------
  //User image
  const [userImg, setUserImg] = useState("");
  const loadUserImg = async () => {
    let imgUri = await libary.downloadingImg(
      [`${userProfile.uid}.jpg`],
      "user"
    );
    setUserImg(imgUri.length > 0 ? imgUri[0] : "");
  };
  // load Callback fn
  const refreshTx = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(transactionAction.fetchTransaction(userRole));
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing]);

  // initially
  useEffect(() => {
    // Load sellerItems and wasteType from firebase and store it to redux "initially"
    setIsLoading(true);
    loadUserImg();
    refreshTx()
      .then(() => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }, [refreshTx, dispatch]);

  const goAllTxQuickly = () => {
    props.navigation.navigate("SellingTransactionScreen");
  };

  //add spinner loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary_bright_variant} />
      </View>
    );
  }

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight,
          backgroundColor:
            userRole === "seller" ? Colors.soft_secondary : Colors.primary_dark,
        }}
      >
        {isLoading ? (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: Colors.on_primary_dark.high_constrast,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator
              size="large"
              color={Colors.primary_bright_variant}
            />
          </View>
        ) : (
          <>
            <UserInfoCard
              userRole={userRole}
              avariableWidth={wp("100%")}
              style={{
                ...styles.userInfoCard,
                height: "40%",
                width: "100%",
              }}
              imgUrl={userImg}
              userName={userProfile.name + " " + userProfile.surname}
              address={userProfile.addr.readable}
              onClick={() => {
                props.navigation.navigate("EditingUserprofileScreen");
              }}
              transactions={transactions}
              onStatusClick={goAllTxQuickly}
            />
            <View
              style={{
                width: "100%",
                height: "60%",
                alignSelf: "center",
                alignItems: "center",
                paddingVertical: 10,
                paddingBottom: getStatusBarHeight(),
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                ...styles.shadow,
                backgroundColor:
                  userRole === "seller" ? "white" : Colors.primary_dark,
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  paddingHorizontal: Dimensions.get("window").width * 0.03,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  height: 60,
                }}
              >
                <View style={{ width: "60%", height: "80%" }}>
                  <ThaiTitleText
                    style={{
                      color: Colors.soft_primary_bright,
                      fontSize: 18,
                    }}
                  >
                    การรับซื้อขยะล่าสุด
                  </ThaiTitleText>
                </View>
                <CustomButton
                  style={{
                    width: "30%",
                    height: "80%",
                    maxHeight: 40,
                    borderRadius: 5,
                  }}
                  btnColor={Colors.button.submit_primary_bright.btnBackground}
                  onPress={refreshTx}
                  btnTitleColor={Colors.button.submit_primary_bright.btnText}
                  btnTitleFontSize={10}
                >
                  <Ionicons name={"md-refresh"} size={10} />
                  <ThaiMdText style={{ fontSize: 10 }}>
                    {" "}
                    อัปเดตข้อมูล
                  </ThaiMdText>
                </CustomButton>
              </View>
              {txShow.length > 0 ? (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={refreshTx}
                    />
                  }
                  refreshing={isRefreshing}
                  onRefresh={refreshTx}
                  data={txShow}
                  keyExtractor={(item) => item.txId}
                  renderItem={({ item }) => {
                    return (
                      <SellTransactionCard
                        amountOfType={item.detail.saleList.length}
                        userName={item.detail.buyer}
                        userRole={userRole}
                        txType={item.detail.txType}
                        txStatus={item.detail.txStatus}
                        meetDate={libary.formatDate(
                          item.detail.assignedTime[0].toDate()
                        )}
                        addr={item.detail.addr}
                        onPress={() => {
                          selectedHandler(item);
                        }}
                      />
                    );
                  }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <ThaiBoldText
                    style={{ color: Colors.hard_secondary, fontSize: 14 }}
                  >
                    {isLoading
                      ? "กำลังโหลดข้อมูล..."
                      : "ยังไม่มีรายการที่ท่านกำลังสนใจ"}
                  </ThaiBoldText>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.secondary,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
