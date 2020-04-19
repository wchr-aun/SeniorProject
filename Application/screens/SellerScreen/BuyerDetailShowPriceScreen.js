import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
  SectionList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import ThaiMdText from "../../components/ThaiMdText";
import ThaiRegText from "../../components/ThaiRegText";
import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { Wastes } from "../../models/AllUserTrash";
import * as transactionAction from "../../store/actions/transactionAction";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import ThaiBoldText from "../../components/ThaiBoldText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { LinearGradient } from "expo-linear-gradient";
import ModalShowAssignedTime from "../../components/ModalShowAssignedTime";
import { Header } from "react-navigation-stack";
import { searchBuyer } from "../../utils/firebaseFunctions";

export default BuyerDetailShowPriceScreen = (props) => {
  // Get a parameter that sent from the previous page.
  const purchaseList = props.navigation.getParam("purchaseList");
  const wasteListSectionFormat = useSelector(
    (state) => state.wasteType.wasteListSectionFormat
  );
  console.log(purchaseList);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);

  //   // load buyer info function
  //   const [buyerInfo, setBuyerInfo] = useState({});
  //   const loadBuyerInfo = async (buyerId) => {
  //     const buyerInfo = await searchBuyer(buyerId);
  //     setBuyerInfo(buyerInfo);
  //   };

  //   // load buyer img function
  //   const [buyerImg, setBuyerImg] = useState("");
  //   const loadBuyerImg = async (buyerId) => {
  //     let imgUri = "";
  //     if (buyerId) {
  //       imgUri = await libary.downloadingImg([`${buyerId}.jpg`], "user");
  //     }
  //     setBuyerImg(imgUri != "" ? imgUri[0] : "");
  //   };
  //   const loadBuyerData = async () => {
  //     setIsLoading(true);
  //     await loadBuyerInfo(buyerId);
  //     await loadBuyerImg(buyerId);
  //     await loadComments();
  //     setIsLoading(false);
  //   };
  //   // load buyer img and information
  //   useEffect(() => {
  //     loadBuyerData();
  //   }, []);

  //   // load comments about buyer
  //   const [comments, setComments] = useState([]);
  //   const loadComments = async () => {
  //     // do some api
  //     setIsRefreshing(true);
  //     setComments(comments_temp);
  //     setIsRefreshing(false);
  //   };

  const backHandler = () => {
    props.navigation.goBack();
  };

  //   const seeBuyerPriceHandler = () => {
  //     props.navigation.navigate("BuyerDetailShowPriceScreen");
  //   };

  //   //add spinner loading
  //   if (isLoading) {
  //     return (
  //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //         <ActivityIndicator size="large" color={Colors.primary_bright_variant} />
  //       </View>
  //     );
  //   }

  return (
    <LinearGradient
      colors={Colors.linearGradientBright}
      style={{
        ...styles.infoContainerCard,
        width: "100%",
        height: "100%",
      }}
    >
      {props.navigation.getParam("haveHeaderHight") ? null : (
        <CustomStatusBar />
      )}
      <View
        style={{
          height: "10%",
          width: "100%",
          flexDirection: "row",
          backgroundColor: Colors.secondary,
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
            ราคารับซื้อ
          </ThaiBoldText>
        </View>
      </View>

      {/* buyerInfo + sellerComment */}
      <View
        style={{
          width: "100%",
          height: "90%",
          paddingHorizontal: 10,
          paddingBottom: getStatusBarHeight(),
        }}
      >
        <SectionList
          sections={wasteListSectionFormat ? wasteListSectionFormat : []}
          refreshing={isLoading}
          keyExtractor={(item, index) => item + index} //item refer to each obj in each seaction
          renderItem={({ item, section: { type } }) => {
            let subtypeIndex = Object.keys(item)[0];
            let subtypeName = item[Object.keys(item)[0]].name;

            // Set price for showing
            let price = purchaseList[type][subtypeIndex];

            return (
              <View
                style={{
                  width: "100%",
                  height: 50,
                  borderRadius: 5,
                  padding: 10,
                  backgroundColor: Colors.on_primary_dark.low_constrast,
                  borderBottomColor: Colors.hard_secondary,
                  borderBottomWidth: 0.75,
                  marginBottom: 2,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "50%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "50%" }}>
                    <ThaiRegText
                      style={{
                        fontSize: 15,
                        color: Colors.soft_primary_bright,
                      }}
                    >
                      {subtypeName}
                    </ThaiRegText>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 0.75,
                        width: "50%",
                        borderRadius: 3,
                        borderColor: Colors.soft_secondary,
                        backgroundColor: Colors.soft_secondary,
                        alignItems: "center",
                      }}
                    >
                      <ThaiRegText
                        style={{ textAlign: "center", fontSize: 15 }}
                      >
                        {price}
                      </ThaiRegText>
                    </View>
                    <ThaiRegText style={{ fontSize: 15 }}>
                      {" "}
                      บาท/ กก.
                    </ThaiRegText>
                  </View>
                </View>
              </View>
            );
          }}
          renderSectionHeader={({ section: { type } }) => {
            return (
              <ThaiMdText
                style={{ fontSize: 18, color: Colors.hard_primary_dark }}
              >
                {type}
              </ThaiMdText>
            );
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  infoContainerCard: {
    backgroundColor: Colors.primary_dark,
    alignSelf: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
