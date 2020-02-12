import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmDialog } from "react-native-simple-dialogs";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import Colors from "../../constants/Colors";
import ModalShowInteractMap from "../../components/ModalShowInteractMap";
import { fetchTransactionForPathOp } from "../../store/actions/transactionAction";
import libary, { getCurrentLocation } from "../../utils/libary";
import SellTransactionCard from "../../components/SellTransactionCard";
import { LinearGradient } from "expo-linear-gradient";
import ModalLoading from "../../components/ModalLoading";
import * as transactionAction from "../../store/actions/transactionAction";
import ThaiRegText from "../../components/ThaiRegText";

const destinationReducer = (state, action) => {
  let geopoint = state.geopoint;
  for (index in geopoint) {
    if (action.geopoint.txId == geopoint[index].txId) {
      let newGeopoint = [];
      newGeopoint = geopoint.splice(0, index);
      geopoint.shift();
      return {
        geopoint: newGeopoint.concat(geopoint)
      };
    }
  }
  geopoint.push(action.geopoint);
  return {
    geopoint
  };
};

export default PathOptimizationScreen = props => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSelected, setisSelected] = useState({});
  const [addrModalVisible, setAddrModalVisible] = useState(false);
  const [addrReadable, setAddrReadable] = useState("");
  const [sellerAddr, setSellerAddr] = useState(""); // really used
  const userProfile = useSelector(state => state.user.userProfile);
  const [currentLocation, setCurrentLocation] = useState("");
  const [destinationState, dispatchDestination] = useReducer(
    destinationReducer,
    { geopoint: [] }
  );

  const loadCurrentLocation = async () => {
    setIsInOperation(true);
    const location = await getCurrentLocation();
    setCurrentLocation(location);
    setIsInOperation(false);
  };

  const loadTodayTx = async () => {
    setIsInOperation(true);
    await dispatch(fetchTransactionForPathOp());
    setIsInOperation(false);
  };

  // 'formState (state snapshot) will be updated when state changed
  useEffect(() => {
    console.log("path optimize");
    try {
      loadCurrentLocation();
      loadTodayTx();
    } catch (err) {
      setError(err.message);
    }
  }, []);
  const transactions = useSelector(state => state.transactions.todayTx);

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
  const searchMapHandler = async isBuyerOnTheWay => {
    // do async task
    if (Object.keys(isSelected).length == 0)
      return setError("กรุณาเลือก Transaction ที่จะไปรับขยะ");
    console.log("-- searchMapHandler");
    setAddrModalVisible(true);

    if (isBuyerOnTheWay) {
      changeTxStatus();
    }
  };

  //select unselect tx
  const [txForShow, setTxForShow] = useState([]);
  useEffect(() => {
    setTxForShow(transactions);
  }, [transactions]);

  const selectedHandler = useCallback(
    tx => {
      let temp = isSelected;
      if (temp[tx.txId] == undefined) temp[tx.txId] = true;
      else delete temp[tx.txId];
      setisSelected(temp);
      dispatchDestination({
        geopoint: {
          txId: tx.txId,
          latitude: tx.detail.addr_geopoint.geopoint.latitude,
          longitude: tx.detail.addr_geopoint.geopoint.longitude
        }
      });

      //for UI
      let updatedSelectedTx = [...txForShow];

      // check there is already have that item ?
      let targetIndex = updatedSelectedTx.indexOf(tx);
      updatedSelectedTx[targetIndex].selected = !updatedSelectedTx[targetIndex]
        .selected;
      setTxForShow(updatedSelectedTx);
    },
    [txForShow]
  );

  if (addrModalVisible && currentLocation) {
    return (
      <ModalShowInteractMap
        setModalVisible={setAddrModalVisible}
        modalVisible={addrModalVisible}
        origin={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        }}
        destination={destinationState.geopoint}
        pathOptimize={true}
        setSellerAddr={setSellerAddr}
        addrReadable={addrReadable}
      />
    );
  }

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isInOperation, setIsInOperation] = useState(false);

  const changeTxStatus = async () => {
    setIsInOperation(true);
    try {
      let promises = [];
      for (let index = 0; index < txForShow.length; index++) {
        if (txForShow[index].selected) {
          promises.push(
            dispatch(
              transactionAction.changeTransactionStatus({
                txID: transactions[index].txId,
                oldStatus: transactions[index].detail.txStatus, //for query
                newStatus: 3
              })
            )
          );
        }
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
            searchMapHandler(true);
          }
        }}
        negativeButton={{
          title: "เปลี่ยนด้วยตัวเอง",
          onPress: () => {
            setConfirmVisible(false);
            searchMapHandler(false);
          }
        }}
      />
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
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center"
          }}
        >
          <ThaiBoldText
            style={{
              color: Colors.on_primary_bright.high_constrast,
              fontSize: 20
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
          alignItems: "center"
        }}
      >
        {txForShow ? (
          txForShow.length > 0 ? (
            <FlatList
              onRefresh={loadTodayTx}
              refreshing={isInOperation}
              data={txForShow}
              keyExtractor={item => item.txId}
              renderItem={({ item }) => {
                return (
                  <SellTransactionCard
                    selected={item.selected} //true --> selected
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
                height: 60
              }}
            >
              <ThaiRegText style={{ color: Colors.secondary }}>
                ยังไม่มีรายการที่ต้องไปรับในวันนี้
              </ThaiRegText>
            </View>
          )
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 60
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
          padding: 10
        }}
      >
        <CustomButton
          disable={Boolean(Object.keys(isSelected).length == 0)}
          style={{
            width: "40%",
            height: "100%",
            borderRadius: 10,
            margin: wp("1.25%"),
            alignSelf: "center"
          }}
          // onPress={searchMapHandler}
          onPress={() => setConfirmVisible(true)}
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
