import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Modal,
  Text,
  TextInput,
  Alert,
  FlatList
} from "react-native";
import Colors from "../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import ThaiText from "./ThaiText";
import { getStatusBarHeight } from "react-native-status-bar-height";

const DATA = [
  { hour: 6, minute: 0, selected: false },
  { hour: 6, minute: 30, selected: false },
  { hour: 7, minute: 0, selected: false },
  { hour: 7, minute: 30, selected: false },
  { hour: 8, minute: 0, selected: false }
];

export default ModalShowSellersItemsScreen = props => {
  const [assignedTimeSelected, setAssignedTimeSelected] = useState("");

  return (
    <Modal
      animationType="slide"
      presentationStyle={"overFullScreen"}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View
        style={{
          height: hp("80%"),
          width: wp("80%"),
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          borderWidth: "3",
          borderColor: "black"
        }}
      >
        <View
          style={{
            width: "100%",
            height: "80%",
            padding: 20,
            borderWidth: "2",
            borderColor: "yellow"
          }}
        >
          <FlatList
            style={{
              flex: 1
            }}
            data={DATA}
            keyExtractor={item => item.hour.toString() + item.minute.toString()}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    width: "100%",
                    height: "20%",
                    backgroundColor: "yellow",
                    margin: 5
                  }}
                >
                  <Text>
                    {item.hour.toString() + " " + item.minute.toString()}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            height: "20%",
            borderWidth: "2",
            borderColor: "red"
          }}
        >
          <Button
            title={"ปิดหน้าต่าง"}
            color={Colors.primary}
            onPress={() => {
              props.setModalVisible(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};
