import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import ThaiMdText from "../../components/ThaiMdText";
import ThaiRegText from "../../components/ThaiRegText";

import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { Wastes } from "../../models/AllUserTrash";
import * as transactionAction from "../../store/actions/transactionAction";
import { getStatusBarHeight } from "react-native-status-bar-height";
import ImageCircle from "../../components/UI/ImageCircle";

import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import ModalLoading from "../../components/ModalLoading";

export default WasteDetailScreen = props => {
  //add spinner loading
  const [isLoading, setIsLoading] = useState(false);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary_bright_variant} />
      </View>
    );
  }

  const backHandler = () => {
    props.navigation.goBack();
  };

  const waste = props.navigation.getParam("waste");
  console.log("waste");
  console.log(waste);

  return (
    <View
      style={{
        ...styles.infoContainerCard,
        width: "100%",
        height: "100%"
      }}
    >
      {props.navigation.getParam("addCustomStatusbar") ? (
        <CustomStatusBar />
      ) : null}
      <View
        style={{
          height: "10%",
          width: "100%",
          flexDirection: "row",
          backgroundColor: Colors.soft_primary_dark,
          paddingVertical: 10,
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        <CustomButton
          style={{
            width: "20%",
            height: "100%",
            maxHeight: 30,
            borderRadius: 5
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
            justifyContent: "center"
          }}
        >
          <ThaiBoldText
            style={{
              color: Colors.on_primary_dark.low_constrast,
              fontSize: 18
            }}
          >
            รายละเอียดขยะ
          </ThaiBoldText>
        </View>
        <View style={{ width: "20%", height: "100%" }}>
          {/* used for fulfll space */}
        </View>
      </View>
      <View
        style={{
          height: "20%",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        <View
          style={{
            width: "30%",
            height: "80%",
            padding: 5,
            alignItems: "center",
            paddingHorizontal: 10
          }}
        >
          <ImageCircle imgUrl={waste.imgUrl} avariableWidth={wp("20%")} />
        </View>
        <View style={{ width: "70%", height: "80%", paddingHorizontal: 10 }}>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_dark.low_constrast
            }}
          >
            {`ประเภทวัสดุ `}
            <ThaiMdText
              style={{
                fontSize: 14,
                color: Colors.primary_dark
              }}
            >
              {waste.majorType}
            </ThaiMdText>
          </ThaiRegText>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_dark.low_constrast
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
              color: Colors.on_primary_dark.low_constrast
            }}
          >
            {`การกำจัด `}
            <ThaiMdText
              style={{ fontSize: 14, color: Colors.primary_bright_variant }}
            >
              {waste.wasteDisposal}
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
          paddingBottom: getStatusBarHeight()
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        ></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainerCard: {
    backgroundColor: Colors.primary_dark,
    alignSelf: "center"
  },
  userInfo: {
    alignItems: "center"
  },
  userImg: {
    width: "100%",
    height: "100%"
  }
});
