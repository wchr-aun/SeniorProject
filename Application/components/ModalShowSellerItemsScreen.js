import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  FlatList,
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  Text,
  TextInput
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
  const [amount, setAmount] = useState();

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
              data={
                props.data.length !== 0
                  ? props.data
                  : [
                      { value: "wasteType/PETE" },
                      { value: "wasteType/HDPE" },
                      { value: "wasteType/PP" }
                    ]
              }
              onChangeText={thisValue => {
                console.log(thisValue);
                setWasteType(thisValue);
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
                onChangeText={thisValue => {
                  console.log(thisValue);
                  setAmount(thisValue);
                }}
              ></TextInput>
            </View>
          </View>
          <View>
            <Button
              title={"Add it"}
              color={Colors.primary}
              onPress={() =>
                props.addNewWasteHandler(wasteType, parseInt(amount, 10))
              }
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
