import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

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

export default UserSignupScreen = props => {
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

  // 'formState (state snapshot) will be updated when state changed

  useEffect(() => {
    console.log("path optimize");
    try {
      dispatch(fetchTransactionForPathOp());
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
  const searchMapHandler = async () => {
    // do async task
    if (Object.keys(isSelected).length == 0)
      return setError("กรุณาเลือก Transaction ที่จะไปรับขยะ");
    const location = await getCurrentLocation();
    setCurrentLocation(location);
    setAddrModalVisible(true);
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

  if (addrModalVisible) {
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

  return (
    <LinearGradient style={{ flex: 1 }} colors={Colors.linearGradientDark}>
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
      <View style={{ width: "100%", height: "80%" }}>
        <FlatList
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
          onPress={searchMapHandler}
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
