import React, { useCallback, useState, useEffect } from "react";
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
import Colors from "../../constants/Colors";

import ThaiRegText from "../../components/ThaiRegText";
import ThaiMdText from "../../components/ThaiMdText";

import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getFavBuyers, searchBuyer } from "../../utils/firebaseFunctions";
import Input from "../../components/UI/Input";
import CustomButton from "../../components/UI/CustomButton";
import ThaiBoldText from "../../components/ThaiBoldText";
import ImageCircle from "../../components/UI/ImageCircle";
import libary from "../../utils/libary";

export default SearchBuyerScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Search Buyer Screen");
  }, []);

  const [buyerId, setBuyerId] = useState("");
  const [buyerResult, setBuyerResult] = useState("");

  //User image
  const [userImg, setUserImg] = useState("");
  const loadUserImg = async (buyerName) => {
    let imgUri = await libary.downloadingImg([`${buyerName}.jpg`], "user");
    setUserImg(imgUri[0] ? imgUri[0] : "");
  };

  const onSearchBarChangeHandler = async (a, buyerName, c) => {
    setBuyerId(buyerName);
  };

  const onSearchHandler = async () => {
    setBuyerResult("");
    const buyerResult = await searchBuyer(buyerId);
    if (buyerResult) {
      setBuyerResult(buyerResult);
      loadUserImg(buyerId.toLowerCase());
    }
  };

  const goBuyerDetail = () => {
    props.navigation.navigate({
      routeName: "BuyerDetailScreen",
      params: { buyerId, haveHeaderHight: true },
    });
  };

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
      <LinearGradient
        colors={Colors.linearGradientBright}
        style={{
          width: wp("100%"),
          height: hp("100%"),
          backgroundColor: Colors.secondary,
          borderRadius: 10,
          alignItems: "center",
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
          <View style={{ width: "20%" }}></View>
          <View style={{ width: "50%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_secondary.high_constrast,
                fontSize: 18,
              }}
            >
              ค้นหาผู้รับซื้อ
            </ThaiBoldText>
          </View>
          <View
            style={{
              width: "20%",
            }}
          />
        </View>

        {/* Search bar */}
        <View
          style={{
            width: "80%",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 15,
          }}
        >
          <Input
            label="ค้นหาโดยชื่อผู้รับซื้อ"
            iconName="account-search"
            editable={true}
            errorText={"กรุณาใช้ตัวอักษร"}
            required={true}
            onInputChange={onSearchBarChangeHandler}
            id="buyerName"
            style={{ width: "80%", marginVertical: 5 }}
          />

          <CustomButton
            style={{
              borderRadius: 4,
              maxHeight: 40,
              width: "40%",
            }}
            btnColor={Colors.button.submit_primary_bright.btnBackground}
            onPress={onSearchHandler}
            btnTitleColor={Colors.button.submit_primary_bright.btnText}
            btnTitleFontSize={14}
          >
            <ThaiBoldText>ค้นหา</ThaiBoldText>
          </CustomButton>
        </View>
        {buyerResult ? (
          <TouchableOpacity style={{ width: "80%" }} onPress={goBuyerDetail}>
            <View
              style={{
                width: "100%",
                borderRadius: 5,
                ...styles.shadow,
                padding: 15,
                alignItems: "center",
              }}
            >
              <ImageCircle imgUrl={userImg} avariableWidth={wp("20%")} />
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginVertical: 3,
                }}
              >
                <ThaiMdText
                  style={{ fontSize: 16, color: Colors.primary_bright }}
                >
                  {buyerResult.buyerId}
                </ThaiMdText>
              </View>
              <View style={{ width: "80%", alignItems: "center" }}>
                <ThaiRegText style={{ fontSize: 14 }}>
                  {buyerResult.detail.addr}
                </ThaiRegText>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
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
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
