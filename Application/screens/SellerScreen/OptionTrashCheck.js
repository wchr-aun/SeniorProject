import React, { useState, useReducer, useEffect } from "react";
import { StyleSheet, FlatList, View, Text, Button } from "react-native";
import ImagePickerCmp from "../../components/ImagePicker";
import { useDispatch, useSelector } from "react-redux";
import * as imgActions from "../../store/actions/imageAction";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import AppVariableSetting from "../../constants/AppVariableSetting";
import CustomStatusBar from "../../components/UI/CustomStatusBar";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/UI/CustomButton";
import libary from "../../utils/libary";
import { getStatusBarHeight } from "react-native-status-bar-height";

const SET_LOCAL_SELLERITEMS = "SET_LOCAL_SELLERITEMS";
const ADD_SELLERITEMS_AMOUNT = "ADD_SELLERITEMS_AMOUNT";
const MINUS_SELLERITEMS_AMOUNT = "MINUS_SELLERITEMS_AMOUNT";
const sellerItemsCameraReducer = (state, action) => {
  let targetIndex = "";
  let updatedSellerItemsCamera = [...state.sellerItemsCamera];
  let updatedSellerItemsCameraObj = { ...state.sellerItemsCameraObj };
  switch (action.type) {
    case SET_LOCAL_SELLERITEMS:
      return {
        ...state,
        sellerItemsCamera: [...action.sellerItemsCamera],
        sellerItemsCameraObj: { ...action.sellerItemsCameraObj }
      };
    case ADD_SELLERITEMS_AMOUNT:
      //find that element
      targetIndex = updatedSellerItemsCamera.indexOf(
        updatedSellerItemsCamera.filter(
          item => item.subtype === action.subtype
        )[0]
      );
      // updated flatList
      updatedSellerItemsCamera[targetIndex].amount += 1;
      // updated Payload
      updatedSellerItemsCameraObj[action.majortype][action.subtype] += 1;
      console.log(updatedSellerItemsCameraObj);
      return {
        ...state,
        updatedSellerItemsCamera,
        updatedSellerItemsCameraObj
      };
    case MINUS_SELLERITEMS_AMOUNT:
      //find that element
      targetIndex = updatedSellerItemsCamera.indexOf(
        updatedSellerItemsCamera.filter(
          item => item.subtype === action.subtype
        )[0]
      );
      // update flatList
      if (updatedSellerItemsCamera[targetIndex].amount > 0) {
        updatedSellerItemsCamera[targetIndex].amount -= 1;
        updatedSellerItemsCameraObj[action.majortype][action.subtype] -= 1;
      }
      console.log(updatedSellerItemsCameraObj);

      return {
        ...state,
        updatedSellerItemsCamera,
        updatedSellerItemsCameraObj
      };
    default:
      return { ...state };
  }
};

export default OptionTrashCheck = props => {
  const dispatch = useDispatch();

  const sellerItemsCamera = useSelector(
    state => state.sellerItems.sellerItemsCamera
  );

  const sellerItemsCameraObj = useSelector(
    state => state.sellerItems.sellerItemsCameraObj
  );
  const wasteTypesDB = useSelector(state => {
    return state.wasteType.wasteTypes;
  });

  const [sellerItemsState, dispatchSellerItemsState] = useReducer(
    sellerItemsCameraReducer,
    {
      sellerItemsCamera: [],
      sellerItemsCameraObj: {}
    }
  );

  const [pickedImage, setPickedImage] = useState();

  // take picture for get prediction
  const takeImageHandler = async () => {
    // get img
    const resultedImg = await libary.takeImgForGetprediction();

    // set react
    setPickedImage(resultedImg);
    dispatch(imgActions.getPrediction(resultedImg, wasteTypesDB));
  };

  // const takeImageHandler = async () => {
  //   const resultedImg = await libary.uploadingImg();
  //   console.log("resultedImg");
  //   console.log(resultedImg);
  // };

  const confirmHandler = () => {
    dispatch(imgActions.confirmSellerItemsCamera(sellerItemsCameraObj));
    props.navigation.navigate("ShowSellerItemsScreen");
  };

  useEffect(() => {
    dispatchSellerItemsState({
      type: SET_LOCAL_SELLERITEMS,
      sellerItemsCamera,
      sellerItemsCameraObj
    });
  }, [sellerItemsCamera]);

  return (
    <View>
      <CustomStatusBar />
      <View
        style={{
          width: wp("100%"),
          height: hp("100%") - AppVariableSetting.bottomBarHeight
        }}
      >
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            backgroundColor: Colors.soft_primary_dark,
            paddingVertical: 10,
            alignItems: "center"
          }}
        >
          <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
            <ThaiBoldText
              style={{
                color: Colors.on_primary_dark.low_constrast,
                fontSize: 26
              }}
            >
              ตรวจสอบขยะด้วยกล้อง
            </ThaiBoldText>
          </View>
        </View>
        <ImagePickerCmp
          style={{ height: "40%", width: "100%" }}
          pickedImage={pickedImage}
        />
        <View style={{ width: "100%", height: "5%", padding: 10 }}>
          <ThaiBoldText>ยืนยันจำนวนขยะที่ถ่าย</ThaiBoldText>
        </View>
        <View
          style={{
            width: "100%",
            height: "25%",
            alignItems: "center"
          }}
        >
          <FlatList
            data={
              sellerItemsState.sellerItemsCamera
                ? sellerItemsState.sellerItemsCamera
                : []
            }
            style={{
              flex: 1
            }}
            keyExtractor={item => item.subtype}
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
                  cameraMode={true}
                  onIncrease={() =>
                    dispatchSellerItemsState({
                      type: ADD_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type
                    })
                  }
                  onDecrease={() => {
                    dispatchSellerItemsState({
                      type: MINUS_SELLERITEMS_AMOUNT,
                      subtype: item.subtype,
                      majortype: item.type
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
            paddingBottom: getStatusBarHeight()
          }}
        >
          <CustomButton
            style={{
              width: "40%",
              height: "80%",
              borderRadius: 8,
              maxHeight: 40
            }}
            btnColor={Colors.button.start_operation_info.btnBackground}
            onPress={takeImageHandler}
            btnTitleColor={Colors.button.start_operation_info.btnText}
            btnTitleFontSize={12}
          >
            ถ่ายรูป
          </CustomButton>
          <CustomButton
            style={{
              width: "40%",
              height: "80%",
              borderRadius: 8,
              maxHeight: 40
            }}
            btnColor={Colors.button.submit_primary_bright.btnBackground}
            onPress={confirmHandler}
            btnTitleColor={Colors.button.submit_primary_bright.btnText}
            btnTitleFontSize={12}
          >
            ยืนยันจำนวน
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
