import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import Colors from "../constants/Colors";
import { Dropdown } from "react-native-material-dropdown";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import CustomButton from "./UI/CustomButton";
import { AntDesign } from "@expo/vector-icons";

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
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View
        style={{
          width: wp("80%"),
          height: hp("50%"),
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            ...styles.realContent,
            // width: wp("80%"),
            // height: hp("100%"),
            width: "100%",
            height: "100%",
            alignItems: "center",
            backgroundColor: Colors.secondary,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: Colors.soft_primary_dark
          }}
        >
          <View
            style={{
              ...styles.realContent_ModalHeader,
              width: "100%",
              height: "10%",
              flexDirection: "row",
              backgroundColor: Colors.soft_primary_dark,
              paddingVertical: 10,
              alignItems: "center"
            }}
          >
            <View
              style={{ width: "70%", height: "100%", alignItems: "center" }}
            >
              <ThaiBoldText
                style={{
                  color: Colors.on_primary_dark.low_constrast,
                  fontSize: 26
                }}
              >
                เพิ่มประเภทขยะ
              </ThaiBoldText>
            </View>
          </View>

          <View
            style={{
              ...styles.inputs,
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              height: "50%",
              maxHeight: 200,
              flexDirection: "row",
              padding: 10,
              marginVertical: 10
            }}
          >
            <View
              style={{
                ...styles.inputs_leftInputs,
                width: "70%",
                height: "100%",
                padding: 10,
                justifyContent: "space-around"
              }}
            >
              <View
                style={{
                  ...styles.firstDropdown,
                  width: "100%",
                  height: 80
                }}
              >
                <Dropdown
                  label="ประเภทวัสดุ"
                  value={majorType}
                  data={props.wasteTypeDropdownFormat} //Plastic, Glass --- [{value: Plastic}, {value: Glass},]
                  onChangeText={thisValue => {
                    onDropdownSelectMajorType(thisValue);
                  }}
                  animationDuration={100}
                />
              </View>
              <View
                style={{
                  ...styles.secondDropdown,
                  width: "100%",
                  height: 80
                }}
              >
                <Dropdown
                  label="ชนิดของขยะ"
                  value={subType}
                  data={subTypes}
                  onChangeText={thisValue => {
                    onDropdownSelectSubType(thisValue);
                  }}
                />
              </View>
            </View>
            <View
              style={{
                ...styles.inputs_RightInputs,
                width: "30%",
                height: "100%",
                padding: 10
              }}
            >
              <View
                style={{
                  ...styles.adjustNumber,
                  width: "100%",
                  height: "100%",
                  backgroundColor: Colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 150,
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
                      borderBottomColor: Colors.hard_secondary,
                      borderBottomWidth: 0.5
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() =>
                        setAmount(preAmount =>
                          (Number(preAmount) + 1).toString()
                        )
                      }
                    >
                      <AntDesign
                        name="plus"
                        size={24}
                        color={Colors.hard_secondary}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                  {/* number */}
                  <View
                    style={{
                      width: "100%",
                      height: "30%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <TextInput
                      style={{ textAlign: "center" }}
                      selectTextOnFocus={true}
                      keyboardType="numeric"
                      value={amount}
                      onChangeText={thisValue => {
                        setAmount(thisValue.toString());
                      }}
                    />
                  </View>
                  {/* - */}
                  <View
                    style={{
                      width: "100%",
                      height: "30%",
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopColor: Colors.hard_secondary,
                      borderTopWidth: 0.5
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() =>
                        setAmount(preAmount =>
                          (Number(preAmount) - 1).toString()
                        )
                      }
                    >
                      <AntDesign
                        name="minus"
                        size={24}
                        color={Colors.hard_secondary}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              height: "40%",
              maxHeight: 50,
              flexDirection: "row",
              justifyContent: "space-around",
              marginVertical: 10
            }}
          >
            <CustomButton
              style={{ width: "40%", height: "100%", borderRadius: 5 }}
              btnColor={Colors.button.cancel.btnBackground}
              onPress={() => {
                console.log("cancel press.");
                props.setModalVisible(false);
              }}
              btnTitleColor={Colors.button.cancel.btnText}
              btnTitleFontSize={12}
            >
              ปิดหน้าต่าง
            </CustomButton>

            <CustomButton
              style={{ width: "40%", height: "100%", borderRadius: 5 }}
              btnColor={Colors.button.submit_primary_bright.btnBackground}
              btnTitleColor={Colors.button.submit_primary_bright.btnText}
              onPress={addWasteHandler}
              btnTitleFontSize={12}
            >
              ยืนยันการเพิ่มขยะ
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});
