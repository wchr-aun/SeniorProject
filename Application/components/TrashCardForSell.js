import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ThaiMdText from "./ThaiMdText";
import ThaiRegText from "./ThaiRegText";
import Colors from "../constants/Colors";
import ImageCircle from "./UI/ImageCircle";

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
//             onChangeText={props.onEdit}
//             value={(props.oldAmount + props.changeAmount <= 0
//               ? 0
//               : props.oldAmount + props.changeAmount
//             ).toString()}
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
        backgroundColor: Colors.secondary
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
        <ImageCircle
          avariableWidth={wp("20%")}
          imgUrl={props.imgUrl}
          style={{ borderWidth: 1, borderColor: Colors.soft_secondary }}
        />
      </View>

      <View
        style={{
          ...styles.detailContainer,
          width: "50%",
          height: "100%"
        }}
      >
        <View
          style={{
            ...styles.sellerItemNameAndCheckbox,
            width: "100%",
            height: "20%",
            flexDirection: "row"
          }}
        >
          <View
            style={{
              ...styles.sellerItemName,
              width: "80%",
              height: "100%"
            }}
          >
            <ThaiRegText style={{ fontSize: 10 }}>ประเภท: </ThaiRegText>
            <ThaiMdText
              style={{
                ...styles.trashName,
                color: Colors.primary_bright_variant,
                fontSize: 10
              }}
            >
              {props.wasteName}
            </ThaiMdText>
          </View>
          <TouchableWithoutFeedback
            style={{
              width: "20%",
              height: "100%"
            }}
            onPress={props.onSelected}
          >
            <MaterialIcons
              name={props.selected ? "check-box" : "check-box-outline-blank"}
              size={30}
              color={Colors.primary}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ width: "100%", height: "80%" }}>
          <ThaiRegText
            style={{
              textAlign: "center",
              fontSize: 8,
              color:
                isNaN(props.changeAmount) ||
                props.changeAmount === 0 ||
                !props.selected
                  ? Colors.primary_dark
                  : props.changeAmount > 0
                  ? Colors.primary_bright
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
              borderBottomColor: props.editingMode ? Colors.hard_secondary : "",
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
                onChangeText={props.onEdit}
                value={props.editingValue}
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
