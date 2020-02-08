import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import ThaiMdText from "./ThaiMdText";
import ThaiRegText from "./ThaiRegText";
import Colors from "../constants/Colors";
import ImageCircle from "./UI/ImageCircle";
import ThaiBoldText from "./ThaiBoldText";
import CustomButton from "./UI/CustomButton";

const AmountOfTrash = props => {
  return (
    <View
      style={{
        ...props.style,
        alignItems: "center",
        flexDirection: "row"
      }}
    >
      <View
        style={{
          width: "100%"
        }}
      >
        <ThaiRegText
          style={{
            textAlign: "center",
            fontSize: 8,
            color:
              isNaN(props.changeAmount) ||
              props.changeAmount === 0 ||
              !props.selected
                ? "black"
                : props.changeAmount > 0
                ? "green"
                : Colors.error
          }}
        >
          {`คงเหลือ ${
            props.selected
              ? props.oldAmount - (props.oldAmount + props.changeAmount)
              : props.oldAmount
          }`}
        </ThaiRegText>
      </View>
    </View>
  );
};

export default TrashCardForSell = props => {
  return (
    <TouchableOpacity onPress={props.onSelected}>
      <View
        style={{
          ...styles.trashCard,
          ...props.style,
          width: wp("95%"),
          height: hp("20%"),
          alignSelf: "center",
          borderRadius: 10,
          marginVertical: 5,
          overflow: "hidden",
          backgroundColor: Colors.secondary,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: props.selected ? 5 : 1
          },
          shadowOpacity: props.selected ? 0.34 : 0.18,
          shadowRadius: props.selected ? 6.27 : 1.0,
          elevation: props.selected ? 10 : 1
        }}
      >
        <View
          style={{
            ...styles.image,
            width: "30%",
            height: "100%",
            backgroundColor: Colors.secondary,
            padding: wp("2.5%"),
            alignItems: "center",
            justifyContent: "space-around"
          }}
        >
          <CustomButton
            style={{
              width: "100%",
              height: "20%",
              maxHeight: 40,
              borderRadius: 8,
              padding: 10
            }}
            btnColor={
              props.selected
                ? Colors.button.submit_primary_bright.btnBackground
                : Colors.hard_secondary
            }
            btnTitleColor={
              props.selected
                ? Colors.button.submit_primary_bright.btnText
                : Colors.primary_dark
            }
            btnTitleFontSize={12}
            disable={false}
          >
            <ThaiBoldText style={{ fontSize: 14 }}>เลือก </ThaiBoldText>
            {props.selected ? (
              <MaterialIcons
                name={props.selected ? "check-box" : "check-box-outline-blank"}
                size={10}
                color={Colors.button.submit_primary_bright.btnText}
              />
            ) : null}
          </CustomButton>
          <ImageCircle
            avariableWidth={wp("20%")}
            imgUrl={props.imgUrl}
            style={{
              borderWidth: 1,
              borderColor: Colors.soft_secondary,
              height: "80%",
              width: "100%"
            }}
          />
        </View>

        <View
          style={{
            ...styles.detailContainer,
            width: "50%",
            height: "100%",
            justifyContent: "space-around"
          }}
        >
          <View
            style={{
              ...styles.sellerItemNameAndCheckbox,
              width: "100%",
              height: "30%",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                ...styles.sellerItemName,
                width: "60%",
                height: "100%",
                justifyContent: "space-between"
              }}
            >
              <ThaiRegText style={{ fontSize: 10 }}>ประเภท: </ThaiRegText>
              <ThaiMdText
                style={{
                  ...styles.trashName,
                  color: props.selected
                    ? Colors.primary_bright_variant
                    : Colors.hard_secondary,
                  fontSize: 12
                }}
              >
                {props.wasteName}
              </ThaiMdText>
            </View>
          </View>
          <View style={{ width: "100%", height: "30%" }}>
            <ThaiRegText>ราคารับซื้อ: </ThaiRegText>
            <View style={{ flexDirection: "row" }}>
              <ThaiBoldText
                style={{
                  color: props.selected
                    ? Colors.primary_bright
                    : Colors.hard_secondary,
                  fontSize: 12
                }}
              >
                {props.sellerItemAdjustPrice}
              </ThaiBoldText>
              <ThaiBoldText style={{ fontSize: 12 }}> บาท/กก.</ThaiBoldText>
            </View>
          </View>
          <View style={{ width: "100%", height: "30%" }}>
            <ThaiRegText>คงเหลือ: </ThaiRegText>
            <ThaiMdText
              style={{
                fontSize: 12,
                color:
                  isNaN(props.changeAmount) ||
                  props.changeAmount === 0 ||
                  !props.selected
                    ? Colors.hard_secondary
                    : props.changeAmount > 0
                    ? Colors.primary_bright
                    : Colors.error
              }}
            >
              {props.selected
                ? props.oldAmount - (props.oldAmount + props.changeAmount)
                : props.oldAmount}
            </ThaiMdText>
          </View>
        </View>

        {/* Adjust Component */}
        {!props.selected ? null : (
          <View
            style={{
              width: "20%",
              height: "100%",
              backgroundColor: Colors.secondary,
              alignItems: "center",
              justifyContent: "center",
              padding: 10
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "space-around",
                borderRadius: 8,
                backgroundColor: Colors.soft_secondary,
                ...styles.shadow
              }}
            >
              {/* + */}
              <View
                style={{
                  width: "100%",
                  height: "30%",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {!props.selected ? null : (
                  <TouchableOpacity onPress={props.onIncrease}>
                    <AntDesign
                      name="plus"
                      size={24}
                      color={Colors.hard_secondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {/* number */}
              <View
                style={{
                  width: "100%",
                  height: "30%",
                  alignSelf: "center"
                }}
              >
                {props.selected ? (
                  <TextInput
                    style={{ textAlign: "center" }}
                    selectTextOnFocus={true}
                    keyboardType="numeric"
                    value={(props.oldAmount + props.changeAmount <= 0
                      ? 0
                      : props.oldAmount + props.changeAmount
                    ).toString()}
                    onChangeText={props.onEdit}
                    textAlign={"center"}
                  />
                ) : null}
              </View>
              {/* - */}
              <View
                style={{
                  width: "100%",
                  height: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                  ...styles.shadow
                }}
              >
                {!props.selected ? null : (
                  <TouchableOpacity onPress={props.onDecrease}>
                    <AntDesign
                      name="minus"
                      size={24}
                      color={Colors.hard_secondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trashCard: {
    flexDirection: "row",
    borderRadius: 10
  },
  selectedTrashCard: {
    shadowColor: Colors.primary_bright,
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2
  },
  descriptionRow: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center"
  },
  trashName: {
    fontSize: 16
  },
  trashAdjustPrice: {
    fontSize: 12
  },
  trashDisposal: {
    fontSize: 12
  },
  plusAndMinusCircle: {
    marginHorizontal: 5
  }
});
