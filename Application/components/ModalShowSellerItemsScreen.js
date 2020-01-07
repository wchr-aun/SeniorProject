import React, { useState } from "react";
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
import ThaiText from "./ThaiText";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default ModalShowSellersItemsScreen = props => {
  const [wasteType, setWasteType] = useState();
  const [wasteDescription, setWasteDescription] = useState();
  const [wasteDisposal, setWasteDisposal] = useState();
  const [amount, setAmount] = useState();

  const onDropdownChangeHandler = wasteType => {
    setWasteType(wasteType);

    let wasteItem = props.data.filter(item => item.value === wasteType)[0];
    console.log(wasteItem);
    setWasteDescription(wasteItem.info.description);
    setWasteDisposal(wasteItem.info.disposal);
  };

  const addWasteHandler = () => {
    props.addNewWasteHandler(
      wasteType,
      wasteDescription,
      wasteDisposal,
      parseInt(amount, 10)
    );
    props.setModalVisible(false);
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
              flexDirection: "row",
              width: "100%",
              height: "30%",
              alignItems: "center"
            }}
          >
            <View style={{ width: "40%", height: wp("10%") }}>
              <Dropdown
                label="Waste Type"
                data={props.data}
                onChangeText={thisValue => {
                  onDropdownChangeHandler(thisValue);
                }}
              />
            </View>
            <View
              style={{
                width: "40%",
                height: wp("10%"),
                paddingVertical: wp("3%"),
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.lineSeparate
              }}
            >
              <TextInput
                placeholder="จำนวน"
                keyboardType="number-pad"
                onChangeText={thisValue => {
                  setAmount(thisValue);
                }}
              ></TextInput>
            </View>
          </View>
          <View
            style={{
              width: "100%",
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
