import React, { useState } from "react";
import { View, Modal, TextInput, TouchableOpacity } from "react-native";

import Colors from "../constants/Colors";
import ThaiMdText from "../components/ThaiMdText";

import CustomButton from "../components/UI/CustomButton";
import ThaiBoldText from "./ThaiBoldText";

export default ModalNewComment = ({
  modalVisible,
  setIsImgModalVisible,
  setRating,
  setComment,
  comment,
  rating,
  onSubmit,
}) => {
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
            <TouchableOpacity
              onPress={() => setRating("1")}
              style={{ width: 50, height: 50, marginHorizontal: 2 }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor:
                    "1" === rating
                      ? Colors.primary_bright
                      : Colors.soft_primary_dark,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <ThaiBoldText
                  style={{
                    fontSize: 15,
                    color:
                      "1" === rating
                        ? Colors.on_primary_bright.high_constrast
                        : Colors.on_primary_dark.low_constrast,
                  }}
                >
                  1
                </ThaiBoldText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRating("2")}
              style={{ width: 50, height: 50, marginHorizontal: 2 }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor:
                    "2" === rating
                      ? Colors.primary_bright
                      : Colors.soft_primary_dark,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <ThaiBoldText
                  style={{
                    fontSize: 15,
                    color:
                      "2" === rating
                        ? Colors.on_primary_bright.high_constrast
                        : Colors.on_primary_dark.low_constrast,
                  }}
                >
                  2
                </ThaiBoldText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRating("3")}
              style={{ width: 50, height: 50, marginHorizontal: 2 }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor:
                    "3" === rating
                      ? Colors.primary_bright
                      : Colors.soft_primary_dark,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <ThaiBoldText
                  style={{
                    fontSize: 15,
                    color:
                      "3" === rating
                        ? Colors.on_primary_bright.high_constrast
                        : Colors.on_primary_dark.low_constrast,
                  }}
                >
                  3
                </ThaiBoldText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRating("4")}
              style={{ width: 50, height: 50, marginHorizontal: 2 }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor:
                    "4" === rating
                      ? Colors.primary_bright
                      : Colors.soft_primary_dark,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <ThaiBoldText
                  style={{
                    fontSize: 15,
                    color:
                      "4" === rating
                        ? Colors.on_primary_bright.high_constrast
                        : Colors.on_primary_dark.low_constrast,
                  }}
                >
                  4
                </ThaiBoldText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRating("5")}
              style={{ width: 50, height: 50, marginHorizontal: 2 }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor:
                    "5" === rating
                      ? Colors.primary_bright
                      : Colors.soft_primary_dark,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <ThaiBoldText
                  style={{
                    fontSize: 15,
                    color:
                      "5" === rating
                        ? Colors.on_primary_bright.high_constrast
                        : Colors.on_primary_dark.low_constrast,
                  }}
                >
                  5
                </ThaiBoldText>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 50, padding: 5, marginTop: 5 }}>
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
              marginHorizontal: 10,
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
              onPress={onSubmit}
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
