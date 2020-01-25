import React, { useState, useReducer, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Modal,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity
} from "react-native";
import Colors from "../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

const DATA = [
  { hour: 6, minute: 0, selected: false },
  { hour: 6, minute: 30, selected: false },
  { hour: 7, minute: 0, selected: false },
  { hour: 7, minute: 30, selected: false },
  { hour: 8, minute: 0, selected: false }
];

const SELECTED = "SELECTED";
const CONFIRM = "CONFIRM";

const assignedTimeReducer = (state, action) => {
  let updatedTimes = [...state.times];
  switch (action.type) {
    case SELECTED:
      let targetIndex = updatedTimes.indexOf(action.time);
      updatedTimes[targetIndex].selected = !updatedTimes[targetIndex].selected;
      return {
        ...state,
        times: [...updatedTimes]
      };
    case CONFIRM:
      let date = state.date;
      let selectedTimes = [];

      updatedTimes.forEach((item, index) => {
        if (item.selected) {
          let dateTmp = new Date(date);
          dateTmp.setHours(item.hour);
          dateTmp.setMinutes(item.minute);
          dateTmp.setSeconds(0);
          dateTmp.setMilliseconds(0);
          selectedTimes.push(dateTmp.getTime());
        }
      });
      return {
        ...state,
        selectedTimes: [...selectedTimes]
      };
    default:
      return state;
  }
};

export default ModalShowSellersItemsScreen = props => {
  //   const [assignedTimeSelected, setAssignedTimeSelected] = useState("");
  const [assignedTime, dispatchAssignedTime] = useReducer(assignedTimeReducer, {
    times: [...DATA],
    selectedTimes: [],
    date: props.date
  });

  onAssignedtimeSelectedHandler = time => {
    dispatchAssignedTime({ type: SELECTED, time });
  };

  confirmAssignedtime = () => {
    dispatchAssignedTime({ type: CONFIRM });
  };

  // When 'assignedTime.selectedTimes' got update set back to ChooseBuyerScreen
  useEffect(() => {
    if (assignedTime.selectedTimes.length) {
      props.setSelectedTimes(assignedTime.selectedTimes);
      props.setModalVisible(false); //should unmound modal after everything finish
    }
  }, [assignedTime.selectedTimes]);

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
          borderColor: "black",
          borderWidth: 3,
          paddingTop: 60
        }}
      >
        <View
          style={{
            width: "100%",
            height: "80%",
            padding: 20
          }}
        >
          <FlatList
            data={assignedTime.times}
            keyExtractor={item => item.hour.toString() + item.minute.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => onAssignedtimeSelectedHandler(item)}
                >
                  <View
                    style={{
                      width: "100%",
                      height: 50,
                      borderWidth: 2,
                      borderColor: "yellow",
                      padding: 5,
                      alignSelf: "center"
                    }}
                  >
                    <Text>
                      {item.hour.toString() + " " + item.minute.toString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={{ width: "100%", height: "20%", flexDirection: "row" }}>
          <View
            style={{
              width: "40%",
              height: "100%",
              borderWidth: 2,
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
          <View
            style={{
              width: "40%",
              height: "100%",
              borderWidth: 2,
              borderColor: "red"
            }}
          >
            <Button
              title={"ยืนยัน"}
              color={Colors.primary_variant}
              onPress={() => {
                confirmAssignedtime();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
