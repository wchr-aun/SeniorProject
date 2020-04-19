import React from "react";
import { View, StyleSheet, Image } from "react-native";

import Colors from "../../constants/Colors";
import ThaiMdText from "../../components/ThaiMdText";
import ThaiRegText from "../../components/ThaiRegText";

import CustomButton from "../../components/UI/CustomButton";
import { getStatusBarHeight } from "react-native-status-bar-height";
import ImageCircle from "../../components/UI/ImageCircle";

import { Ionicons } from "@expo/vector-icons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import ThaiBoldText from "../../components/ThaiBoldText";

export default WasteDetailScreen = (props) => {
  const backHandler = () => {
    props.navigation.goBack();
  };

  const waste = props.navigation.getParam("waste");

  return (
    <View
      style={{
        ...styles.infoContainerCard,
        width: "100%",
        height: "100%",
      }}
    >
      <CustomStatusBar />
      {/* header bar */}
      <View
        style={{
          height: "10%",
          width: "100%",
          flexDirection: "row",
          backgroundColor: Colors.hard_secondary,
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
            รายละเอียดขยะ
          </ThaiBoldText>
        </View>
        <View style={{ width: "20%", height: "100%" }}>
          {/* used for fulfll space */}
        </View>
      </View>

      {/* content */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
        }}
      >
        {/* Image */}
        <View
          style={{
            width: "100%",
            height: "50%",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            source={{
              uri: waste.imgUrl,
            }}
          />
        </View>

        {/* Content */}
        <View
          style={{
            width: "90%",
            paddingHorizontal: 12,
            alignSelf: "flex-start",
            paddingVertical: 3,
            marginVertical: 5,
          }}
        >
          <ThaiBoldText style={{ fontSize: 16, textAlign: "left" }}>
            ข้อมูล
          </ThaiBoldText>
        </View>

        <View
          style={{
            width: "90%",
            padding: 12,
            borderRadius: 7,
            backgroundColor: Colors.soft_secondary,
            ...styles.shadow,
          }}
        >
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_secondary.high_constrast,
            }}
          >
            {`ประเภทวัสดุ `}
            <ThaiMdText
              style={{
                fontSize: 14,
                color: Colors.primary_bright_variant,
              }}
            >
              {waste.majorType}
            </ThaiMdText>
          </ThaiRegText>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_secondary.high_constrast,
            }}
          >
            {`ชนิดของขยะ `}
            <ThaiMdText
              style={{ fontSize: 14, color: Colors.primary_bright_variant }}
            >
              {waste.subType}
            </ThaiMdText>
          </ThaiRegText>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_secondary.high_constrast,
            }}
          >
            {`การกำจัด `}
            <ThaiMdText
              style={{ fontSize: 14, color: Colors.primary_bright_variant }}
            >
              {waste.wasteDisposal}
            </ThaiMdText>
          </ThaiRegText>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_secondary.high_constrast,
            }}
          >
            {`คำอธิบาย `}
            <ThaiMdText
              style={{ fontSize: 14, color: Colors.primary_bright_variant }}
            >
              {waste.wasteDescription}
            </ThaiMdText>
          </ThaiRegText>
        </View>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "15%",
          padding: 5,
          paddingBottom: getStatusBarHeight(),
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        ></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainerCard: {
    backgroundColor: Colors.secondary,
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
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});
