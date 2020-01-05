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
          justifyContent: "center"
        }}
      >
        <View
          style={{ width: wp("80%"), height: hp("70%"), alignItems: "center" }}
        >
          <Text>Waste Adding</Text>
          <View style={{ width: "100%", height: "25%" }}>
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
              width: "100%",
              height: "10%",
              alignSelf: "center",
              marginVertical: wp("3%"),
              flexDirection: "row"
            }}
          >
            <View style={{ width: "30%", height: "100%" }}>
              <ThaiText>จำนวน</ThaiText>
            </View>
            <View
              style={{
                width: "70%",
                height: "100%",
                borderWidth: 1,
                borderColor: Colors.lineSeparate,
                borderRadius: 5
              }}
            >
              <TextInput
                keyboardType="number-pad"
                onChangeText={thisValue => {
                  setAmount(thisValue);
                }}
              ></TextInput>
            </View>
          </View>
          <View>
            <Button
              title={"Add it"}
              color={Colors.primary}
              onPress={addWasteHandler}
            />
          </View>
          <View>
            <Button
              title={"Hide Modal"}
              color={Colors.primary}
              onPress={() => {
                props.setModalVisible(false);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
