import React, { useState, useReducer, useEffect } from "react";
import { StyleSheet, FlatList, View, Alert } from "react-native";
import ImagePickerCmp from "../../components/ImagePicker";
import { useDispatch, useSelector } from "react-redux";
import * as imgActions from "../../store/actions/imageAction";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AppVariableSetting from "../../constants/AppVariableSetting";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { getStatusBarHeight } from "react-native-status-bar-height";
import ModalLoading from "../../components/ModalLoading";
import TrashCard from "../../components/TrashCard";
import { GET_PREDICTION } from "../../store/actions/imageAction";
import ThaiMdText from "../../components/ThaiMdText";

const SET_LOCAL_SELLERITEMS = "SET_LOCAL_SELLERITEMS";
const ADD_SELLERITEMS_AMOUNT = "ADD_SELLERITEMS_AMOUNT";
const MINUS_SELLERITEMS_AMOUNT = "MINUS_SELLERITEMS_AMOUNT";
const RESET = "RESET";
const sellerItemsCameraReducer = (state, action) => {
  let targetIndex = "";
  let updatedSellerItemsCamera = [...state.sellerItemsCamera];
  let updatedSellerItemsCameraObj = { ...state.sellerItemsCameraObj };
  switch (action.type) {
    case SET_LOCAL_SELLERITEMS:
      return {
        ...state,
        sellerItemsCamera: [...action.sellerItemsCamera],
        sellerItemsCameraObj: { ...action.sellerItemsCameraObj },
      };
    case ADD_SELLERITEMS_AMOUNT:
      //find that element
      targetIndex = updatedSellerItemsCamera.indexOf(
        updatedSellerItemsCamera.filter(
          (item) => item.subtype === action.subtype
        )[0]
      );
      // updated flatList
      updatedSellerItemsCamera[targetIndex].amount += 1;
      // updated Payload
      updatedSellerItemsCameraObj[action.majortype][action.subtype] += 1;
      return {
        ...state,
        updatedSellerItemsCamera,
        updatedSellerItemsCameraObj,
        sellerItemsCamera: updatedSellerItemsCamera,
        sellerItemsCameraObj: updatedSellerItemsCameraObj,
      };
    case MINUS_SELLERITEMS_AMOUNT:
      //find that element
      targetIndex = updatedSellerItemsCamera.indexOf(
        updatedSellerItemsCamera.filter(
          (item) => item.subtype === action.subtype
        )[0]
      );
      // update flatList
      if (updatedSellerItemsCamera[targetIndex].amount > 0) {
        updatedSellerItemsCamera[targetIndex].amount -= 1;
        updatedSellerItemsCameraObj[action.majortype][action.subtype] -= 1;
      }

      return {
        ...state,
        updatedSellerItemsCamera,
        updatedSellerItemsCameraObj,
        sellerItemsCamera: updatedSellerItemsCamera,
        sellerItemsCameraObj: updatedSellerItemsCameraObj,
      };
    case RESET:
      return {
        sellerItemsCamera: [],
        sellerItemsCameraObj: {},
      };
    default:
      return { ...state };
  }
};

export default OptionTrashCheck = (props) => {
  const dispatch = useDispatch();

  const sellerItemsCamera = useSelector(
    (state) => state.sellerItems.sellerItemsCamera
  );

  const sellerItemsCameraObj = useSelector(
    (state) => state.sellerItems.sellerItemsCameraObj
  );
  const wasteTypesDB = useSelector((state) => {
    return state.wasteType.wasteTypes;
  });

  const [sellerItemsState, dispatchSellerItemsState] = useReducer(
    sellerItemsCameraReducer,
    {
      sellerItemsCamera: [],
      sellerItemsCameraObj: {},
    }
  );

  const [pickedImage, setPickedImage] = useState();
  const [isInOperation, setIsInOperation] = useState(false);

  // take picture for get prediction
  const takeImageHandler = async () => {
    // get img
    const resultedImg = await libary.takeImgForGetprediction();
    if (!resultedImg) {
      return;
    }
    // set image
    setPickedImage(resultedImg);
  };

  // use the picked image for prediction process
  const getPredictionHandler = async () => {
    setIsInOperation(true);
    // const result = [
    //   {
    //     class: "plastic_bottle",
    //     score: "0.9232149",
    //     xmax: "410",
    //     xmin: "168",
    //     ymax: "770",
    //     ymin: "32",
    //   },
    //   {
    //     class: "plastic_bottle",
    //     score: "0.9232149",
    //     xmax: "410",
    //     xmin: "168",
    //     ymax: "770",
    //     ymin: "32",
    //   },
    //   {
    //     class: "plastic_bottle",
    //     score: "0.9232149",
    //     xmax: "410",
    //     xmin: "168",
    //     ymax: "770",
    //     ymin: "32",
    //   },
    // ];
    try {
      const res = await libary.getPrediction(pickedImage, 10000);
      if (res.results) {
        dispatch({
          type: GET_PREDICTION,
          results: res.results,
          wasteTypesDB,
        });
      } else {
        Alert.alert(
          "มีข้อผิดพลาดบางอย่างเกิดขึ้น!",
          // "ไม่สามารถติดต่อกับ Server ได้",
          error,
          [{ text: "OK" }]
        );
        setPickedImage("");
      }
    } catch (error) {
      Alert.alert(
        // "ไม่สามารถติดต่อกับ Server ได้",
        error.message,
        "ไม่สามารถติดต่อ Server ได้"[{ text: "OK" }]
      );
      setPickedImage("");
    }
    // await setTimeout(() => console.log("1000ms run"), 5000);
    // dispatch({
    //   type: GET_PREDICTION,
    //   results: result,
    //   wasteTypesDB,
    // });
    setIsInOperation(false);
  };

  const reset = () => {
    setPickedImage("");
    dispatchSellerItemsState({ type: RESET });
  };

  const confirmHandler = () => {
    dispatch(imgActions.confirmSellerItemsCamera(sellerItemsCameraObj));
    reset();
    props.navigation.navigate("ShowSellerItemsScreen");
  };

  useEffect(() => {
    dispatchSellerItemsState({
      type: SET_LOCAL_SELLERITEMS,
      sellerItemsCamera,
      sellerItemsCameraObj,
    });
  }, [sellerItemsCamera]);

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight,
        }}
      >
        <ModalLoading modalVisible={isInOperation} text={"ตรวจสอบรูปภาพ..."} />
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            backgroundColor: Colors.secondary,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View style={{ width: "20%" }}></View>
          <View style={{ width: "50%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_secondary.high_constrast,
                fontSize: 18,
              }}
            >
              ตรวจสอบขยะด้วยกล้อง
            </ThaiBoldText>
          </View>
          <View
            style={{
              width: "20%",
            }}
          />
        </View>
        <ImagePickerCmp
          style={{ height: "40%", width: "100%" }}
          pickedImage={pickedImage}
          onClick={takeImageHandler}
        />
        {sellerItemsState.sellerItemsCamera.length > 0 ? (
          <View
            style={{
              width: "100%",
              height: "5%",
              padding: 10,
              margin: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThaiMdText
              style={{
                color: Colors.hard_primary_dark,
                fontSize: 15,
              }}
            >
              ยืนยันจำนวนขยะที่ถ่าย
            </ThaiMdText>
          </View>
        ) : null}

        <View
          style={{
            width: "100%",
            height: "25%",
            alignItems: "center",
          }}
        >
          <FlatList
            data={
              sellerItemsState.sellerItemsCamera
                ? sellerItemsState.sellerItemsCamera
                : []
            }
            keyExtractor={(item) => item.subtype}
            renderItem={({ item }) => {
              return (
                <TrashCard
                  imgUrl={wasteTypesDB[item.type][item.subtype]["imgUrl"]}
                  type={item.type}
                  subtype={item.subtype}
                  wasteName={wasteTypesDB[item.type][item.subtype]["name"]}
                  wasteDisposal={
                    wasteTypesDB[item.type][item.subtype]["disposal"]
                  }
                  wasteDescription={
                    wasteTypesDB[item.type][item.subtype]["description"]
                  }
                  editingValue={item.amount.toString()}
                  trashAdjustPrice={
                    wasteTypesDB[item.type][item.subtype]["price"]
                  }
                  wasteTag={wasteTypesDB[item.type][item.subtype]["trashTag"]}
                  cameraMode={true}
                  onIncrease={() =>
                    dispatchSellerItemsState({
                      type: ADD_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type,
                    })
                  }
                  onDecrease={() => {
                    dispatchSellerItemsState({
                      type: MINUS_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type,
                    });
                  }}
                />
              );
            }}
          />
        </View>
        <View
          style={{
            height: "20%",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            paddingBottom: getStatusBarHeight(),
          }}
        >
          {pickedImage ? (
            <CustomButton
              style={{
                width: "40%",
                height: "80%",
                borderRadius: 8,
                maxHeight: 40,
              }}
              btnColor={Colors.button.start_operation_info.btnBackground}
              onPress={
                sellerItemsState.sellerItemsCamera.length
                  ? reset
                  : getPredictionHandler
              }
              btnTitleColor={Colors.button.start_operation_info.btnText}
              btnTitleFontSize={12}
            >
              {sellerItemsState.sellerItemsCamera.length
                ? "ยกเลิก"
                : "ตรวจสอบประเภทขยะ"}
            </CustomButton>
          ) : null}

          {sellerItemsState.sellerItemsCamera.length > 0 ? (
            <CustomButton
              style={{
                width: "40%",
                height: "80%",
                borderRadius: 8,
                maxHeight: 40,
              }}
              btnColor={Colors.button.submit_primary_bright.btnBackground}
              onPress={confirmHandler}
              btnTitleColor={Colors.button.submit_primary_bright.btnText}
              btnTitleFontSize={12}
            >
              ยืนยันจำนวน
            </CustomButton>
          ) : null}
        </View>
      </View>
    </View>
  );
};
