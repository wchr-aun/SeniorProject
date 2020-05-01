import React from "react";
import { View, Image, Modal } from "react-native";

import Colors from "../constants/Colors";
import ThaiMdText from "../components/ThaiMdText";

import CustomButton from "../components/UI/CustomButton";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default ModalShowImg = (props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={props.onRequestClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            height: "80%",
            backgroundColor: "white",
            borderRadius: 5,
            padding: 5,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "80%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{ uri: props.uri }}
              />
            </View>
          </View>

          <View
            style={{
              width: "100%",
              height: "15%",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <CustomButton
              style={{
                width: "30%",
                maxWidth: 40,
                height: "100%",
                maxHeight: 40,
                borderRadius: 5,
              }}
              btnColor={Colors.button.submit_primary_dark.btnBackground}
              onPress={() => {
                props.slideImg(-1);
              }}
              btnTitleColor={Colors.button.submit_primary_dark.btnText}
              btnTitleFontSize={10}
            >
              <Ionicons
                name="ios-arrow-back"
                color={Colors.button.submit_primary_dark.btnText}
                size={10}
              />
              <ThaiMdText style={{ fontSize: 10 }}> </ThaiMdText>
            </CustomButton>

            <CustomButton
              style={{
                width: "30%",
                maxWidth: 80,
                height: "100%",
                maxHeight: 50,
                borderRadius: 5,
              }}
              btnColor={Colors.button.cancel.btnBackground}
              onPress={() => {
                props.setIsImgModalVisible(false);
              }}
              btnTitleColor={Colors.button.cancel.btnText}
              btnTitleFontSize={10}
            >
              <MaterialIcons
                name={"cancel"}
                color={Colors.button.cancel.btnText}
                size={10}
              />
              <ThaiMdText style={{ fontSize: 10 }}> ปิดหน้าต่าง</ThaiMdText>
            </CustomButton>

            <CustomButton
              style={{
                width: "30%",
                maxWidth: 40,
                height: "100%",
                maxHeight: 40,
                borderRadius: 5,
              }}
              btnColor={Colors.button.submit_primary_dark.btnBackground}
              onPress={() => props.slideImg(1)}
              btnTitleColor={Colors.button.submit_primary_dark.btnText}
              btnTitleFontSize={10}
            >
              <Ionicons
                name="ios-arrow-forward"
                color={Colors.button.submit_primary_dark.btnText}
                size={10}
              />
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};
