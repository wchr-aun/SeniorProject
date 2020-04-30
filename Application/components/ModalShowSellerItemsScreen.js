import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import Colors from "../constants/Colors";
import { Dropdown } from "react-native-material-dropdown";
import CustomButton from "./UI/CustomButton";
import { AntDesign } from "@expo/vector-icons";

export default ModalShowSellersItemsScreen = (props) => {
  console.log("From file modalShowSellerItems props.wasteTypes");

  const [amount, setAmount] = useState("0");
  const [majorType, setMajorType] = useState(
    props.wasteTypeDropdownFormat[0].value
  );
  const [subType, setSubType] = useState(
    props.wasteTypeDropdownFormat[0].subTypes[0].subType
  );
  const [subTypeView, setSubTypeView] = useState(
    props.wasteTypeDropdownFormat[0].subTypes[0].value
  );
  const [subTypes, setSubTypes] = useState(
    props.wasteTypeDropdownFormat[0].subTypes
  );
  const [imageUrl, setImageUrl] = useState(
    props.wasteTypes[majorType][subType]["imgUrl"]
  );
  const getSubTypeFromMajorType = (majorType) => {
    let focusItem = props.wasteTypeDropdownFormat.filter(
      (item) => item.value === majorType
    )[0]; //get subtype
    setSubTypes(focusItem.subTypes);
  };

  const onDropdownSelectMajorType = (majorType) => {
    getSubTypeFromMajorType(majorType);
    setMajorType(majorType);
    setSubType("");
  };

  const onDropdownSelectSubType = (value) => {
    const subTypeObj = subTypes.filter((item) => item.value === value)[0];

    setSubType(subTypeObj.subType);
    setSubTypeView(subTypeObj.value);
    setImageUrl(props.wasteTypes[majorType][subType]["imgUrl"]);
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
          ...props.style,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      >
        <View
          style={{
            ...styles.realContent,
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: Colors.secondary,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: Colors.hard_secondary,
            padding: 10,
          }}
        >
          <View
            style={{
              ...styles.realContent_ModalHeader,
              height: "10%",
              backgroundColor: Colors.soft_secondary,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{ width: "100%", height: "100%", alignItems: "center" }}
            >
              <ThaiBoldText
                style={{
                  color: Colors.on_primary_bright.low_constrast,
                  fontSize: 26,
                  textAlign: "center",
                }}
              >
                เพิ่มประเภทขยะ
              </ThaiBoldText>
            </View>
          </View>
          {/* Image */}
          <View
            style={{
              width: "100%",
              height: "40%",
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: "100%", height: "100%" }}
              source={{
                uri: imageUrl,
              }}
            />
          </View>
          <View
            style={{
              ...styles.inputs,
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              height: "40%",
              maxHeight: 200,
              flexDirection: "row",
              padding: 10,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                ...styles.inputs_leftInputs,
                width: "70%",
                height: "100%",
                padding: 10,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  ...styles.firstDropdown,
                  width: "100%",
                  height: 80,
                }}
              >
                <Dropdown
                  label="ประเภทวัสดุ"
                  value={majorType}
                  data={props.wasteTypeDropdownFormat} //Plastic, Glass --- [{value: Plastic}, {value: Glass},]
                  onChangeText={(value) => {
                    onDropdownSelectMajorType(value);
                  }}
                  animationDuration={100}
                />
              </View>
              <View
                style={{
                  ...styles.secondDropdown,
                  width: "100%",
                  height: 80,
                }}
              >
                <Dropdown
                  label="ชนิดของขยะ"
                  value={subTypeView}
                  data={subTypes}
                  onChangeText={(thisValue) => {
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
                padding: 10,
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
                  padding: 10,
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
                    borderWidth: 3,
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
                      borderBottomWidth: 0.5,
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() =>
                        setAmount((preAmount) =>
                          (Number(preAmount) + 1).toString()
                        )
                      }
                    >
                      <AntDesign
                        name="plus"
                        size={24}
                        color={Colors.soft_primary_dark}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                  {/* number */}
                  <View
                    style={{
                      width: "100%",
                      height: "30%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      style={{ textAlign: "center" }}
                      selectTextOnFocus={true}
                      keyboardType="numeric"
                      value={amount}
                      onChangeText={(thisValue) => {
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
                      borderTopWidth: 0.5,
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (amount !== "0")
                          setAmount((preAmount) =>
                            (Number(preAmount) - 1).toString()
                          );
                      }}
                    >
                      <AntDesign
                        name="minus"
                        size={24}
                        color={Colors.soft_primary_dark}
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
              height: "10%",
              maxHeight: 50,
              flexDirection: "row",
              justifyContent: "space-around",
              marginVertical: 10,
            }}
          >
            <CustomButton
              style={{
                width: "40%",
                height: "100%",
                borderRadius: 5,
                borderColor: Colors.button.cancel.btnText,
                borderWidth: 1,
              }}
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
