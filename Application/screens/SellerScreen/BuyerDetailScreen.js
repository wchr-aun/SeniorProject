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
import libary from "../../utils/libary";
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

const comments_temp = [
  {
    commentId: "1",
    seller: "สมศักดิ์ เจียม",
    message: "บริการดีมากครับ",
    rate: 5,
    time: new Date().getTime(),
  },
  {
    commentId: "2",
    seller: "ชยุตม์ เอี่ยมกลาน",
    message: "มารับช้าไปหน่อย บางที",
    rate: 3,
    time: new Date().getTime(),
  },
  {
    commentId: "3",
    seller: "นาวิช พงทาน",
    message:
      "แกสโซฮอล์แฟรนไชส์งั้น ดิสเครดิตแฮปปี้ซูเอี๋ยออกแบบ โดมิโนคอร์รัปชันคาร์โก้ ผลไม้ เฟิร์ม อัตลักษณ์ซากุระโนติสแชมเปญ คอนแทครุสโซสมิติเวชสะกอมสแควร์ โบรกเกอร์คอมพ์ไทเฮารีดไถเทอร์โบ ติงต๊องคันยิ เบอร์รีแฮมเบอร์เกอร์ อัตลักษณ์เพียบแปร้คูลเลอร์ฮอตดอกธุรกรรม เห่ย งี้เยอร์บีร่า ฮ่องเต้จิ๊กซอว์ชิฟฟอนซื่อบื้อ ยังไงเซ็กซ์ซีนตุ๊กตุ๊กเจ๊ เอ็นทรานซ์ฮองเฮา",
    rate: 1,
    time: new Date().getTime(),
  },
  {
    commentId: "4",
    seller: "พรเทพ วิชัยกร",
    message: "ช้าไปหน่อย แต่ก็บริการดีนะครับ",
    rate: 3,
    time: new Date().getTime(),
  },
];

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
        {Array.from(Array(props.rate)).map((x, index) => (
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
          >{`โดย ${props.seller}`}</ThaiBoldText>
        </View>
        <View style={{ width: "50%" }}>
          <ThaiBoldText
            style={{
              fontSize: 14,
              color: Colors.soft_primary_dark,
              textAlign: "right",
            }}
          >{`เมื่อ ${props.seller}`}</ThaiBoldText>
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
    const buyerInfo = await searchBuyer(buyerId);
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
    await loadBuyerInfo(buyerId);
    await loadBuyerImg(buyerId);
    await loadComments();
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

  // load comments about buyer
  const [comments, setComments] = useState([]);
  const loadComments = async () => {
    // do some api
    setIsRefreshing(true);
    setComments(comments_temp);
    setIsRefreshing(false);
  };

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
          btnColor={Colors.button.cancel.btnBackground}
          onPress={setBuyerFavhandler}
          btnTitleColor={Colors.button.cancel.btnText}
          btnTitleFontSize={20}
        >
          <FontAwesome
            name={isFavBuyer ? "star" : "star-o"}
            color={isFavBuyer ? "#ffdd00" : Colors.hard_primary_dark}
            size={20}
          />
          <ThaiMdText
            style={{
              fontSize: 20,
              color: isFavBuyer ? "#ffdd00" : Colors.hard_primary_dark,
            }}
          >{` จดจำ`}</ThaiMdText>
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
                {buyerInfo.detail.description}
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
                    fontSize: 16,
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
                    fontSize: 16,
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
            <View
              style={{
                flex: 1,
                padding: 10,
              }}
            >
              <FlatList
                refreshing={isRefreshing}
                onRefresh={loadComments}
                data={comments}
                keyExtractor={(item) => item.commentId}
                renderItem={({ item }) => {
                  return (
                    <Comment
                      // style={{ width: "100%", height: 100, flex: 0 }}
                      style={{ flex: 0, background: Colors.secondary }}
                      seller={item.seller}
                      message={item.message}
                      rate={item.rate}
                    />
                  );
                }}
              />
            </View>
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
    elevation: 4,
  },
});
