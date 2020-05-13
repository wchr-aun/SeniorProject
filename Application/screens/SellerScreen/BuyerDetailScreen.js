import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SectionList,
} from "react-native";
import { useSelector } from "react-redux";

import Colors from "../../constants/Colors";
import ThaiMdText from "../../components/ThaiMdText";
import ThaiRegText from "../../components/ThaiRegText";
import CustomButton from "../../components/UI/CustomButton";

import { Ionicons, FontAwesome } from "@expo/vector-icons";
import ThaiBoldText from "../../components/ThaiBoldText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { LinearGradient } from "expo-linear-gradient";
import { searchBuyer, getIsFavBuyer } from "../../utils/firebaseFunctions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { setFavBuyer } from "../../utils/firebaseFunctions";
import ModalLoading from "../../components/ModalLoading";
import libary from "../../utils/libary";

const Comment = (props) => {
  return (
    <View
      style={{
        marginBottom: 5,
        borderRadius: 5,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
        ...props.style,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {Array.from(Array(Math.floor(props.rate))).map((x, index) => (
          <Ionicons
            key={index}
            name="md-star"
            color={Colors.primary_bright}
            size={16}
          />
        ))}
      </View>

      <View
        style={{
          justifyContent: "space-around",
          flexDirection: "row",
          marginBottom: 5,
        }}
      >
        <View style={{ width: "50%" }}>
          <ThaiBoldText
            style={{ fontSize: 14, color: Colors.soft_primary_dark }}
          >{`โดย ${props.user}`}</ThaiBoldText>
        </View>
        <View style={{ width: "50%" }}>
          <ThaiBoldText
            style={{
              fontSize: 14,
              color: Colors.soft_primary_dark,
              textAlign: "right",
            }}
          >{`เมื่อ ${props.time}`}</ThaiBoldText>
        </View>
      </View>
      <View>
        <ThaiRegText style={{ fontSize: 14 }}>{props.message}</ThaiRegText>
      </View>
    </View>
  );
};

const BuyerPrice = (props) => {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingBottom: getStatusBarHeight(),
        ...props.style,
      }}
    >
      <SectionList
        sections={
          props.wasteListSectionFormat ? props.wasteListSectionFormat : []
        }
        keyExtractor={(item, index) => item + index} //item refer to each obj in each seaction
        renderItem={({ item, section: { type } }) => {
          let subtypeIndex = Object.keys(item)[0];
          let subtypeName = item[Object.keys(item)[0]].name;

          let price = 0;
          // Set price for showing
          if (props.purchaseList[type] != undefined) {
            if (props.purchaseList[type][subtypeIndex] != undefined) {
              price = props.purchaseList[type][subtypeIndex];
            }
          }

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
                    <ThaiRegText style={{ textAlign: "center", fontSize: 15 }}>
                      {price}
                    </ThaiRegText>
                  </View>
                  <ThaiRegText style={{ fontSize: 15 }}> บาท/ กก.</ThaiRegText>
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
  );
};

export default BuyerDetailScreen = (props) => {
  // Get a parameter that sent from the previous page.
  const buyerId = props.navigation.getParam("buyerId");
  const [isFavBuyer, setIsFavBuyer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isInOperation, setIsInOperation] = useState(false);
  const [text, setText] = useState("กำลังดำเนินการ");

  // load buyer info function
  const [buyerInfo, setBuyerInfo] = useState({});
  const loadBuyerInfo = async (buyerId) => {
    let buyerInfo = "";
    if (props.navigation.getParam("buyerInfo")) {
      buyerInfo = props.navigation.getParam("buyerInfo");
    } else {
      buyerInfo = await searchBuyer(buyerId);
    }
    const isFavBuyer = await getIsFavBuyer(buyerId);
    setBuyerInfo(buyerInfo);
    setIsFavBuyer(isFavBuyer);
  };

  // load buyer img function
  const [buyerImg, setBuyerImg] = useState("");
  const loadBuyerImg = async (buyerId) => {
    let imgUri = "";
    if (buyerId) {
      imgUri = await libary.downloadingImg([`${buyerId}.jpg`], "user");
    }
    setBuyerImg(imgUri != "" ? imgUri[0] : "");
  };
  const loadBuyerData = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    await loadBuyerInfo(buyerId);
    await loadBuyerImg(buyerId);
    setIsRefreshing(false);
    setIsLoading(false);
  };

  const setBuyerFavhandler = async () => {
    if (isFavBuyer) setText("นำออกจากรายการที่ชื่นชอบ");
    else setText("จัดเก็บในรายการที่ชื่นชอบ");
    setIsInOperation(true);
    const result = await setFavBuyer({ favBuyer: buyerId });
    setIsFavBuyer(result.data === "unset" ? false : true);
    setIsInOperation(false);
  };
  // load buyer img and information
  useEffect(() => {
    loadBuyerData();
  }, []);

  const wasteListSectionFormat = useSelector(
    (state) => state.wasteType.wasteListSectionFormat
  );
  const [isCommentMode, setIsCommentMode] = useState(true);

  const backHandler = () => {
    props.navigation.goBack();
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
      <ModalLoading
        modalVisible={isInOperation}
        userRole="seller"
        text={text}
      />
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
            รายละเอียดผู้รับซื้อ
          </ThaiBoldText>
        </View>
        <CustomButton
          style={{
            width: "20%",
            height: "100%",
            maxHeight: 30,
            borderRadius: 5,
            alignItems: "center",
          }}
          btnColor={Colors.button.submit_primary_dark.btnBackground}
          onPress={setBuyerFavhandler}
          btnTitleColor={Colors.button.submit_primary_dark.btnText}
          btnTitleFontSize={16}
        >
          <FontAwesome
            name={isFavBuyer ? "star" : "star-o"}
            color={
              isFavBuyer ? "#ffdd00" : Colors.button.submit_primary_dark.btnText
            }
            size={14}
          />
          <ThaiMdText
            style={{
              fontSize: 14,
              color: isFavBuyer
                ? "#ffdd00"
                : Colors.button.submit_primary_dark.btnText,
            }}
          >{` ชื่นชอบ`}</ThaiMdText>
        </CustomButton>
      </View>

      {/* buyerInfo + sellerComment */}
      <View
        style={{
          width: "100%",
          height: "90%",
          paddingBottom: getStatusBarHeight(),
        }}
      >
        {/* buyer info */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: Colors.secondary,
            borderRadius: 5,
            margin: 10,
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
                color: Colors.soft_primary_dark,
              }}
            >
              {`ผู้รับซื้อ `}
              <ThaiMdText
                style={{ fontSize: 14, color: Colors.primary_bright_variant }}
              >
                {buyerId}
              </ThaiMdText>
            </ThaiRegText>
            <ThaiRegText
              style={{
                fontSize: 14,
                color: Colors.soft_primary_dark,
              }}
            >
              {`ที่อยู่ของผู้รับซื้อ `}
              <ThaiMdText
                style={{ fontSize: 14, color: Colors.primary_bright_variant }}
              >
                {buyerInfo.detail.addr}
              </ThaiMdText>
            </ThaiRegText>
            <ThaiRegText
              style={{
                fontSize: 14,
                color: Colors.soft_primary_dark,
              }}
            >
              {`เบอร์โทรศัพท์ `}
              <ThaiMdText
                style={{ fontSize: 14, color: Colors.primary_bright_variant }}
              >
                {buyerInfo.detail.tel ? buyerInfo.detail.tel : "0963061333"}
              </ThaiMdText>
            </ThaiRegText>
            <ThaiRegText
              style={{
                fontSize: 14,
                color: Colors.soft_primary_dark,
              }}
            >
              {`คำอธิบาย `}
              <ThaiMdText
                style={{ fontSize: 14, color: Colors.primary_bright_variant }}
              >
                {buyerInfo.detail.description
                  ? buyerInfo.detail.description
                  : ""}
              </ThaiMdText>
            </ThaiRegText>
          </View>
        </View>

        {/* seller comment */}
        <View
          style={{
            backgroundColor: Colors.secondary,
            flex: 1,
          }}
        >
          <View
            style={{
              height: 40,
              width: "100%",
              backgroundColor: "white",
              padding: 10,
              flexDirection: "row",
              justifyContent: "space-around",
              ...styles.shadow,
            }}
          >
            <View style={{ width: "40%", ...styles.shadow }}>
              <TouchableOpacity
                onPress={() => {
                  setIsCommentMode(true);
                }}
              >
                <ThaiBoldText
                  style={{
                    fontSize: 14,
                    color: isCommentMode
                      ? Colors.primary_bright
                      : Colors.soft_primary_dark,
                    textAlign: "center",
                  }}
                >
                  ดูคะแนนความพึงพอใจ
                </ThaiBoldText>
              </TouchableOpacity>
            </View>
            <View style={{ width: "40%", ...styles.shadow }}>
              <TouchableOpacity
                onPress={() => {
                  setIsCommentMode(false);
                }}
              >
                <ThaiBoldText
                  style={{
                    fontSize: 14,
                    color: !isCommentMode
                      ? Colors.primary_bright
                      : Colors.soft_primary_dark,
                    textAlign: "center",
                  }}
                >
                  ดูราคารับซื้อ
                </ThaiBoldText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content "comment" or "price" */}
          {isCommentMode ? (
            <>
              {/* average score */}
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <ThaiMdText style={{ fontSize: 16 }}>
                  {`คะแนนผู้รับซื้อ `}
                </ThaiMdText>
                <ThaiMdText
                  style={{ fontSize: 16, color: Colors.primary_bright }}
                >
                  {buyerInfo.detail.rating
                    ? buyerInfo.detail.rating.toFixed(3)
                    : ""}
                </ThaiMdText>
              </View>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                }}
              >
                <FlatList
                  refreshing={isRefreshing}
                  onRefresh={loadBuyerData}
                  data={buyerInfo.detail.review}
                  keyExtractor={(item) =>
                    item.comment + item.user + item.rating
                  }
                  renderItem={({ item }) => {
                    return (
                      <Comment
                        style={{ flex: 0, background: Colors.secondary }}
                        user={item.user}
                        message={item.comment}
                        rate={item.rating}
                        time={libary.formatDate(item.timestamp.toDate())}
                      />
                    );
                  }}
                />
              </View>
            </>
          ) : (
            <BuyerPrice
              wasteListSectionFormat={wasteListSectionFormat}
              purchaseList={buyerInfo.detail.purchaseList}
              style={{ flex: 1, padding: 10 }}
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  infoContainerCard: {
    backgroundColor: Colors.primary_dark,
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
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
});
