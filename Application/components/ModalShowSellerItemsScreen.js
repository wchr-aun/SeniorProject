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
        <View style={{ width: "50%", height: "50%" }}>
          <Text>Waste Adding</Text>
          <View
            style={{
              width: "100%",
              height: "15%",
              alignSelf: "center"
            }}
          >
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
          <View>
            <TextInput
              onChangeText={thisValue => {
                console.log(thisValue);
                setAmount(thisValue);
              }}
            ></TextInput>
          </View>
          <View>
            <Button
              title={"Add it"}
              color={Colors.primary}
              onPress={() => props.addNewWasteHandler(wasteType, amount)}
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
