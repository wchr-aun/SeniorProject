import React, { useReducer, useCallback, useState, useEffect } from "react";
import { View, Alert, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Colors from "../../constants/Colors";
import ModalShowInteractMap from "../../components/ModalShowInteractMap";
import { fetchTransactionForPathOp } from "../../store/actions/transactionAction";
import libary, { getCurrentLocation } from "../../utils/libary";
import SellTransactionCard from "../../components/SellTransactionCard";
import { LinearGradient } from "expo-linear-gradient";
import { ConfirmDialog } from "react-native-simple-dialogs";
import * as transactionAction from "../../store/actions/transactionAction";

const destinationReducer = (state, action) => {
  let geopoint = state.geopoint;
  for (index in geopoint) {
    if (action.geopoint.txId == geopoint[index].txId) {
      let newGeopoint = [];
      newGeopoint = geopoint.splice(0, index);
      geopoint.shift();
      return {
        geopoint: newGeopoint.concat(geopoint),
      };
    }
  }
  geopoint.push(action.geopoint);
  return {
    geopoint,
  };
};

export default PathOptimizationScreen = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSelected, setisSelected] = useState({});
  const [addrModalVisible, setAddrModalVisible] = useState(false);
  const [addrReadable, setAddrReadable] = useState("");
  const [sellerAddr, setSellerAddr] = useState(""); // really used
  const userProfile = useSelector((state) => state.user.userProfile);
  const [currentLocation, setCurrentLocation] = useState("");
  const [destinationState, dispatchDestination] = useReducer(
    destinationReducer,
    { geopoint: [] }
  );
  const [isInOperation, setIsInOperation] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const loadTodayTx = async () => {
    setIsInOperation(true);
    await dispatch(fetchTransactionForPathOp());
    setIsInOperation(false);
  };

  useEffect(() => {
    console.log("path optimize");
    try {
      loadTodayTx();
    } catch (err) {
      setError(err.message);
    }
  }, []);
  const transactions = useSelector((state) => state.transactions.todayTx);

  useEffect(() => {
    if (error) {
      Alert.alert("มีข้อผิดพลาดบางอย่างเกิดขึ้น!", error, [{ text: "OK" }]);
      setError("");
    }
  }, [error]);

  useEffect(() => {
    setIsLoading(true);
    if (userProfile.uid) setIsLoading(false);
  }, [userProfile]);

  // Search map from user input form
  const searchMapHandler = async () => {
    const location = await getCurrentLocation();
    setCurrentLocation(location);
    setAddrModalVisible(true);
  };

  const selectedHandler = (tx) => {
    let temp = isSelected;
    if (temp[tx.txId] == undefined) temp[tx.txId] = true;
    else delete temp[tx.txId];
    setisSelected(temp);
    dispatchDestination({
      geopoint: {
        txId: tx.txId,
        latitude: tx.detail.addr_geopoint.geopoint.latitude,
        longitude: tx.detail.addr_geopoint.geopoint.longitude,
      },
    });
  };

  if (addrModalVisible) {
    return (
      <ModalShowInteractMap
        setModalVisible={setAddrModalVisible}
        modalVisible={addrModalVisible}
        origin={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        }}
        destination={destinationState.geopoint}
        pathOptimize={true}
        setSellerAddr={setSellerAddr}
        addrReadable={addrReadable}
      />
    );
  }

  const changeTxStatus = async () => {
    setIsInOperation(true);
    try {
      let promises = [];
      for (let txID in isSelected) {
        promises.push(
          dispatch(
            transactionAction.changeTransactionStatus({
              txID,
              oldStatus: 2,
              newStatus: 3,
            })
          )
        );
      }
      await Promise.all(promises).then(() => {
        dispatch(transactionAction.fetchTransaction("buyer"));
        dispatch(fetchTransactionForPathOp());
        setIsInOperation(false);
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={Colors.linearGradientDark}>
      <ModalLoading modalVisible={isInOperation} />
      <ConfirmDialog
        title="เพื่อความรวดเร็ว"
        message="คุณต้องการแจ้งเตือนผู้ขายทันทีว่ากำลังไปรับหรือไม่?"
        visible={confirmVisible}
        onTouchOutside={() => setConfirmVisible(false)}
        positiveButton={{
          title: "ตกลง",
          onPress: () => {
            setConfirmVisible(false);
            changeTxStatus();
            searchMapHandler();
          },
        }}
        negativeButton={{
          title: "เปลี่ยนด้วยตัวเอง",
          onPress: () => {
            setConfirmVisible(false);
            searchMapHandler();
          },
        }}
      />
      <View
        style={{
          width: "100%",
          height: "10%",
          flexDirection: "row",
          backgroundColor: Colors.hard_primary_dark,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <ThaiBoldText
            style={{
              color: Colors.on_primary_dark.low_constrast,
              fontSize: 18,
            }}
          >
            เลือกคำขอที่ต้องการหาเส้นทาง
          </ThaiBoldText>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          height: "80%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {transactions && transactions.length > 0 ? (
          <FlatList
            onRefresh={loadTodayTx}
            refreshing={isInOperation}
            data={transactions}
            keyExtractor={(item) => item.txId}
            renderItem={({ item }) => {
              return (
                <SellTransactionCard
                  amountOfType={item.detail.saleList.length}
                  imgUrl={""}
                  userName={item.detail.seller}
                  txStatus={item.detail.txStatus}
                  meetDate={libary.formatDate(
                    item.detail.assignedTime[0].toDate()
                  )}
                  selected={isSelected[item.txId]}
                  onPress={() => {
                    selectedHandler(item);
                  }}
                />
              );
            }}
          />
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 60,
            }}
          >
            <ThaiRegText style={{ color: Colors.secondary }}>
              ยังไม่มีรายการที่ต้องไปรับในวันนี้
            </ThaiRegText>
          </View>
        )}
      </View>
      <View
        style={{
          width: "100%",
          height: "10%",
          justifyContent: "center",
          padding: 10,
        }}
      >
        <CustomButton
          disable={Boolean(Object.keys(isSelected).length == 0)}
          style={{
            width: "40%",
            height: "100%",
            borderRadius: 10,
            margin: wp("1.25%"),
            alignSelf: "center",
          }}
          // onPress={searchMapHandler}
          onPress={() => {
            if (Object.keys(isSelected).length != 0) setConfirmVisible(true);
          }}
          btnColor={Colors.button.submit_primary_dark.btnBackground}
          btnTitleColor={Colors.button.submit_primary_dark.btnText}
          btnTitleFontSize={14}
        >
          ค้นหาเส้นทาง
        </CustomButton>
      </View>
    </LinearGradient>
  );
};
