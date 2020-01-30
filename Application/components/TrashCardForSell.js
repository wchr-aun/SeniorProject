import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Entypo, Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
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

// const AdjustAmountOfTrash = props => {
//   return (
//     <View style={{ ...props.style, flexDirection: "row" }}>
//       <View style={styles.plusAndMinusCircle}>
//         {!props.selected ? null : (
//           <TouchableWithoutFeedback onPress={props.onDecrease}>
//             <Entypo name="circle-with-minus" size={24} color={Colors.primary} />
//           </TouchableWithoutFeedback>
//         )}
//       </View>
//       <View style={{ width: 30 }}>
//         {props.selected ? (
//           <TextInput
//             selectTextOnFocus={true}
//             keyboardType="numeric"
// onChangeText={props.onEdit}
// value={(props.oldAmount + props.changeAmount <= 0
//   ? 0
//   : props.oldAmount + props.changeAmount
// ).toString()}
//             style={{ textAlign: "center" }}
//           />
//         ) : null}
//       </View>
//       <View style={styles.plusAndMinusCircle}>
//         {!props.selected ? null : (
//           <TouchableWithoutFeedback onPress={props.onIncrease}>
//             <Entypo name="circle-with-plus" size={24} color={Colors.primary} />
//           </TouchableWithoutFeedback>
//         )}
//       </View>
//     </View>
//   );
// };

export default TrashCardForSell = props => {
  return (
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
        borderWidth: props.selected ? 3 : null,
        borderColor: props.selected ? Colors.primary_bright : ""
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
          onPress={props.onSelected}
          btnTitleColor={
            props.selected
              ? Colors.button.submit_primary_bright.btnText
              : Colors.button.submit_primary_dark.btnText
          }
          btnTitleFontSize={10}
          disable={false}
        >
          <ThaiBoldText style={{ fontSize: 10 }}>เลือก </ThaiBoldText>
          <MaterialIcons
            name={props.selected ? "check-box" : "check-box-outline-blank"}
            size={12}
            color={
              props.selected
                ? Colors.button.submit_primary_bright.btnText
                : Colors.button.submit_primary_dark.btnText
            }
          />
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

      {/* <View style={{ width: "50%", height: "100%" }}>
            <AmountOfTrash
              style={{ width: "100%", height: "50%" }}
              changeAmount={props.changeAmount}
              oldAmount={props.oldAmount}
              selected={props.selected}
            />
            <AdjustAmountOfTrash
              style={{ alignSelf: "center", alignItems: "center" }}
              subtype={props.subtype}
              majortype={props.majortype}
              changeAmount={props.changeAmount}
              oldAmount={props.oldAmount}
              onIncrease={props.onIncrease}
              onDecrease={props.onDecrease}
              onEdit={props.onEdit}
              UI_diff={props.UI_diff}
              selected={props.selected}
            />
          </View> */}

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
              borderColor: Colors.hard_secondary,
              borderWidth: 3
            }}
          >
            {/* + */}
            <View
              style={{
                width: "100%",
                height: "30%",
                alignItems: "center",
                justifyContent: "center",
                borderBottomColor: props.editingMode
                  ? Colors.hard_secondary
                  : "",
                borderBottomWidth: props.editingMode ? 0.5 : null
              }}
            >
              {!props.selected ? null : (
                <TouchableWithoutFeedback onPress={props.onIncrease}>
                  <AntDesign
                    name="plus"
                    size={24}
                    color={Colors.hard_secondary}
                  />
                </TouchableWithoutFeedback>
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
                borderTopColor: props.editingMode ? Colors.hard_secondary : "",
                borderTopWidth: props.editingMode ? 0.5 : null
              }}
            >
              {!props.selected ? null : (
                <TouchableWithoutFeedback onPress={props.onDecrease}>
                  <AntDesign
                    name="minus"
                    size={24}
                    color={Colors.hard_secondary}
                  />
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trashCard: {
    flexDirection: "row",
    borderRadius: 10
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
