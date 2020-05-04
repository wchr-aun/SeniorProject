import React, { useState } from "react";
import { View, Image, Modal, TextInput } from "react-native";

import Colors from "../constants/Colors";
import ThaiMdText from "../components/ThaiMdText";

import CustomButton from "../components/UI/CustomButton";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default ModalNewComment = ({
  modalVisible,
  setIsImgModalVisible,
  seller,
}) => {
  const [rating, setRating] = useState("0");
  const [comment, setComment] = useState("");

  const sendCommentHandler = async () => {
    console.log(rating);
    console.log(comment);
    console.log(seller);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 7,
            backgroundColor: Colors.secondary,
          }}
        >
          <View style={{ height: 50, padding: 10 }}>
            <ThaiMdText
              style={{
                fontSize: 16,
                color: Colors.on_primary_bright.low_constrast,
                textAlign: "center",
              }}
            >
              ให้คะแนนกับผู้ซื้อ
            </ThaiMdText>
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 5,
              justifyContent: "center",
            }}
          >
            <View style={{ marginHorizontal: 3 }}>
              <TextInput
                style={{
                  fontSize: 24,
                  textAlign: "center",
                  color: Colors.on_primary_bright.low_constrast,
                }}
                value={rating}
                selectTextOnFocus={true}
                onChangeText={(value) => {
                  setRating(value.toString());
                }}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={{ height: 50, padding: 5 }}>
            <ThaiMdText
              style={{
                fontSize: 16,
                color: Colors.on_primary_bright.low_constrast,
                textAlign: "center",
              }}
            >
              ความคิดเห็น
            </ThaiMdText>
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 10,
              margin: 10,
              justifyContent: "center",
              borderWidth: 2,
              borderRadius: 5,
              borderColor: Colors.soft_primary_dark,
              width: "90%",
            }}
          >
            <TextInput
              style={{
                fontSize: 18,
                textAlign: "center",
                color: Colors.on_primary_bright.low_constrast,
                height: 150,
                width: "100%",
              }}
              multiline
              numberOfLines={5}
              value={comment}
              selectTextOnFocus={true}
              onChangeText={(value) => {
                setComment(value.toString());
              }}
            />
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
              padding: 10,
              maxHeight: 50,
            }}
          >
            <CustomButton
              style={{
                width: "40%",
                height: "100%",
                borderRadius: 5,
                borderColor: Colors.button.cancel.btnText,
                borderWidth: 1,
              }}
              btnColor={Colors.button.cancel.btnBackground}
              onPress={() => {
                setIsImgModalVisible(false);
              }}
              btnTitleColor={Colors.button.cancel.btnText}
              btnTitleFontSize={12}
            >
              ยังไม่ให้ตอนนี้
            </CustomButton>

            <CustomButton
              style={{ width: "40%", height: "100%", borderRadius: 5 }}
              btnColor={Colors.button.submit_primary_bright.btnBackground}
              btnTitleColor={Colors.button.submit_primary_bright.btnText}
              onPress={() => {
                setIsImgModalVisible(false);
                sendCommentHandler();
              }}
              btnTitleFontSize={12}
            >
              ให้คะแนน
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};
