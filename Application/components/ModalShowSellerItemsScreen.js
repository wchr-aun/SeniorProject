import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Modal,
  Text,
  TextInput,
  Alert
} from "react-native";
import Colors from "../constants/Colors";
import { Dropdown } from "react-native-material-dropdown";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import ThaiRegText from "./ThaiRegText";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default ModalShowSellersItemsScreen = props => {
  const [subType, setSubType] = useState();
  const [amount, setAmount] = useState();
  const [majorType, setMajorType] = useState(
    props.wasteTypeDropdownFormat[0].value
  );
  const [subTypes, setSubTypes] = useState(
    props.wasteTypeDropdownFormat[0].subTypes
  );
  const getSubTypeFromMajorType = majorType => {
    let focusItem = props.wasteTypeDropdownFormat.filter(
      item => item.value === majorType
    )[0]; //get subtype
    setSubTypes(focusItem.subTypes);
  };

  const onDropdownSelectMajorType = majorType => {
    getSubTypeFromMajorType(majorType);
    setMajorType(majorType);
    setSubType("");
  };

  const onDropdownSelectSubType = subType => {
    setSubType(subType);
  };

  const addWasteHandler = () => {
    if (majorType && subType && parseInt(amount, 10)) {
      props.addNewWasteHandler(majorType, subType, parseInt(amount, 10));
      props.setModalVisible(false);
    } else return;
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle={"overFullScreen"}
      transparent={false}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: getStatusBarHeight()
        }}
      >
        <View
          style={{
            width: wp("80%"),
            height: hp("100%"),
            alignItems: "center"
          }}
        >
          <View style={{ width: "100%", height: "10%" }}>
            <Text>เพิ่มขยะ</Text>
          </View>
          <View
            style={{
              justifyContent: "space-around",
              width: "100%",
              height: "50%",
              alignItems: "center"
            }}
          >
            <View style={{ width: "40%", height: "30%" }}>
              <Dropdown
                label="ประเภท"
                value={majorType}
                data={props.wasteTypeDropdownFormat} //Plastic, Glass --- [{value: Plastic}, {value: Glass},]
                onChangeText={thisValue => {
                  onDropdownSelectMajorType(thisValue);
                }}
              />
            </View>
            <View style={{ width: "40%", height: "30%" }}>
              <Dropdown
                label="ชนิดขยะ"
                value={subType}
                data={subTypes}
                onChangeText={thisValue => {
                  onDropdownSelectSubType(thisValue);
                }}
              />
            </View>
            <View
              style={{
                width: "40%",
                height: "30%",
                maxHeight: 80,
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.lineSeparate
              }}
            >
              <TextInput
                style={{
                  width: "100%",
                  paddingHorizontal: 2,
                  paddingVertical: 5,
                  textAlign: "center"
                }}
                placeholder="จำนวน"
                keyboardType="number-pad"
                onChangeText={thisValue => {
                  setAmount(thisValue);
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: "40%",
              flexDirection: "row",
              justifyContent: "space-around"
            }}
          >
            <View>
              <Button
                title={"เพิ่ม"}
                color={Colors.primary}
                onPress={addWasteHandler}
              />
            </View>
            <View>
              <Button
                title={"ปิดหน้าต่าง"}
                color={Colors.primary}
                onPress={() => {
                  props.setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
