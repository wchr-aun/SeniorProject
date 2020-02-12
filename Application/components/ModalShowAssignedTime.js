import React, { useState, useReducer, useEffect } from "react";
import {
  View,
  Button,
  Modal,
  Text,
  Alert,
  FlatList,
  TouchableOpacity
} from "react-native";
import Colors from "../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { AntDesign } from "@expo/vector-icons";
import ThaiBoldText from "./ThaiBoldText";
import ThaiRegText from "./ThaiRegText";
import CustomButton from "./UI/CustomButton";

const DATA = [
  { hour: 6, minute: 0, selected: false },
  { hour: 6, minute: 30, selected: false },
  { hour: 7, minute: 0, selected: false },
  { hour: 7, minute: 30, selected: false },
  { hour: 8, minute: 0, selected: false },
  { hour: 8, minute: 30, selected: false },
  { hour: 9, minute: 0, selected: false },
  { hour: 9, minute: 30, selected: false },
  { hour: 10, minute: 0, selected: false },
  { hour: 10, minute: 30, selected: false },
  { hour: 11, minute: 0, selected: false },
  { hour: 11, minute: 30, selected: false },
  { hour: 12, minute: 0, selected: false },
  { hour: 12, minute: 30, selected: false },
  { hour: 13, minute: 0, selected: false },
  { hour: 13, minute: 30, selected: false },
  { hour: 14, minute: 0, selected: false },
  { hour: 14, minute: 30, selected: false },
  { hour: 15, minute: 0, selected: false },
  { hour: 15, minute: 30, selected: false },
  { hour: 16, minute: 0, selected: false },
  { hour: 16, minute: 30, selected: false },
  { hour: 17, minute: 0, selected: false },
  { hour: 17, minute: 30, selected: false },
  { hour: 18, minute: 0, selected: false },
  { hour: 18, minute: 30, selected: false },
  { hour: 22, minute: 0, selected: false },
  { hour: 22, minute: 30, selected: false },
  { hour: 23, minute: 0, selected: false },
  { hour: 23, minute: 30, selected: false }
];

const SELECTED = "SELECTED";
const CONFIRM = "CONFIRM";
const CLEAR = "CLEAR";

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
      console.log("CONFIRM");

      return {
        ...state,
        selectedTimes: []
      };
    case CLEAR:
      console.log("CLEAR");
      updatedTimes.forEach((item, index) => {
        item.selected = false;
      });
      return {
        selectedTimes: []
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
    let date = assignedTime.date.getTime();
    let selectedTimes = [];
    assignedTime.times.forEach((item, index) => {
      if (item.selected) {
        let dateTmp = new Date(date);
        dateTmp.setHours(item.hour);
        dateTmp.setMinutes(item.minute);
        selectedTimes.push(dateTmp.getTime());
        item.selected = false;
      }
    });
    props.setSelectedTimes(selectedTimes);
    dispatchAssignedTime({ type: CONFIRM });
    props.setModalVisible(false); //should unmound modal after everything finish
  };

  // // When 'assignedTime.selectedTimes' got update (After CONFIRM) set back to ChooseBuyerScreen
  // useEffect(() => {
  //   if (assignedTime.selectedTimes.length) {
  //     props.setSelectedTimes(assignedTime.selectedTimes);
  //     dispatchAssignedTime({ type: CLEAR });
  //     props.setModalVisible(false); //should unmound modal after everything finish
  //   }
  // }, [assignedTime.selectedTimes]);

  return (
    <Modal
      animationType="slide"
      presentationStyle={"overFullScreen"}
      visible={props.modalVisible}
      onRequestClose={() => {
        dispatchAssignedTime({ type: CLEAR });
        Alert.alert("Modal has been closed.");
      }}
    >
      <View
        style={{
          height: hp("100%"),
          width: wp("100%"),
          alignItems: "center",
          backgroundColor: Colors.secondary
        }}
      >
        {/* Header */}
        <View style={{ width: "100%", height: "10%", maxHeight: 80 }}>
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.soft_primary_dark
            }}
          >
            <ThaiBoldText
              style={{
                color: Colors.on_primary_dark.low_constrast,
                fontSize: 26,
                textAlign: "center"
              }}
            >
              เลือกเวลารับซื้อที่คุณสะดวก
            </ThaiBoldText>
          </View>
        </View>
        {/* Time content */}
        <View
          style={{
            width: "100%",
            height: "70%",
            padding: 10
          }}
        >
          <FlatList
            data={assignedTime.times}
            keyExtractor={item => item.hour.toString() + item.minute.toString()}
            renderItem={({ item }) => {
              return (
                <CustomButton
                  style={{
                    borderRadius: 8,
                    marginVertical: 2,
                    width: "80%",
                    alignSelf: "center"
                  }}
                  btnColor={
                    item.selected
                      ? Colors.button.submit_primary_dark.btnBackground
                      : Colors.button.disabled.btnBackground
                  }
                  onPress={() => onAssignedtimeSelectedHandler(item)}
                  btnTitleColor={
                    item.selected
                      ? Colors.button.submit_primary_dark.btnText
                      : Colors.primary_dark
                  }
                  btnTitleFontSize={12}
                  disable={false}
                >
                  <ThaiRegText style={{ fontSize: 20 }}>เวลา </ThaiRegText>
                  <ThaiBoldText style={{ fontSize: 20 }}>
                    {item.hour.toString() +
                      "." +
                      (item.minute === 0 ? "00" : item.minute.toString())}
                  </ThaiBoldText>
                  <ThaiRegText style={{ fontSize: 20 }}> น.</ThaiRegText>
                </CustomButton>
              );
            }}
          />
        </View>
        {/* Btn */}
        <View
          style={{
            width: "100%",
            height: "20%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              borderRadius: 8,
              maxHeight: 40
            }}
            btnColor={Colors.button.cancel.btnBackground}
            onPress={() => {
              dispatchAssignedTime({ type: CLEAR });
              props.setModalVisible(false);
            }}
            btnTitleColor={Colors.button.cancel.btnText}
            btnTitleFontSize={12}
            disable={false}
          >
            ปิดหน้าต่าง
          </CustomButton>
          <CustomButton
            style={{
              width: "40%",
              height: "100%",
              borderRadius: 8,
              maxHeight: 40
            }}
            btnColor={Colors.button.submit_primary_bright.btnBackground}
            onPress={() => {
              confirmAssignedtime();
            }}
            btnTitleColor={Colors.button.submit_primary_bright.btnText}
            btnTitleFontSize={12}
            disable={false}
          >
            ยืนยัน
          </CustomButton>
        </View>
      </View>
    </Modal>
  );
};
