import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  FlatList
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import Colors from "../../constants/Colors";
import ModalShowInteractMap from "../../components/ModalShowInteractMap";
import { fetchTransactionForPathOp } from "../../store/actions/transactionAction";
import libary from "../../utils/libary"
import SellTransactionCard from "../../components/SellTransactionCard";

const destinationReducer = (state, action) => {
  let geopoint = state.geopoint
  switch(action.type) {
    case "PUSH_DESTINATION":
      geopoint.push(action.geopoint)
      return {
        geopoint
      };
    case "POP_DESTINATION":
      geopoint.pop()
      return {
        geopoint
      };
  }
}

export default UserSignupScreen = props => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSelected, setisSelected] = useState(false);
  const [addrModalVisible, setAddrModalVisible] = useState(false);
  const [addrReadable, setAddrReadable] = useState("");
  const [sellerAddr, setSellerAddr] = useState(""); // really used
  const userProfile = useSelector(state => state.user.userProfile);
  const [destinationState, dispatchDestination] = useReducer(destinationReducer, { geopoint: [] })

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
    setAddrModalVisible(true);
  };

  const selectedHandler = tx => {
    dispatchDestination({
      type: "PUSH_DESTINATION",
      geopoint: {
        txId: tx.txId,
        latitude: tx.detail.addr_geopoint.geopoint.latitude,
        longitude: tx.detail.addr_geopoint.geopoint.longitude
      }
    })
  }

  if (addrModalVisible) {
    return (
      <ModalShowInteractMap
        setModalVisible={setAddrModalVisible}
        modalVisible={addrModalVisible}
        origin={{latitude: userProfile.addr.latitude, longitude: userProfile.addr.longitude}}
        destination={destinationState.geopoint}
        pathOptimize={true}
        setSellerAddr={setSellerAddr}
        addrReadable={addrReadable}
      />
    );
  }

  return (
    <View>
      <View style={{ width: "100%", height: hp("60%s") }}>
        <FlatList
          data={transactions}
          keyExtractor={item => item.txId}
          renderItem={({ item }) => {
            return (
              <SellTransactionCard
                amountOfType={item.detail.saleList.length}
                imgUrl={
                  "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/393181_101079776715663_1713951835_n.jpg?_nc_cat=107&_nc_eui2=AeEfWDFdtSlGFFjF6BoDJHuxELzTu9FOooinuAkIpIjHImVL2HwARq_OuEI4p63j_X6uN7Pe8CsdOxkg9MFPW9owggtWs3f23aW46Lbk_7ahHw&_nc_oc=AQnoUrFNQsOv1dtrGlQO9cJdPhjxF0yXadmYTrwMAXz2C3asf9CIw59tbNDL8jPKHhI&_nc_ht=scontent.fbkk17-1.fna&oh=4b6bbf9f1d83cffd20a9e028d3967bdd&oe=5E65C748"
                }
                userName={item.detail.seller}
                txStatus={item.detail.txStatus}
                meetDate={libary.formatDate(
                  item.detail.assignedTime[0].toDate()
                )}
                onPress={() => {
                  selectedHandler(item);
                }}
              />
            );
          }}
        />
      </View>
      <CustomButton
        disable={isSelected}
        style={{
          width: wp("40%"),
          height: hp("6%"),
          borderRadius: 10,
          margin: wp("1.25%"),
          alignSelf: "center"
        }}
        onPress={searchMapHandler}
        btnColor={Colors.on_primary}
        btnTitleColor={
          isSelected ? Colors.lineSeparate : Colors.primary
        }
        btnTitleFontSize={14}
      >
        ค้นหาเส้นทาง
      </CustomButton>
    </View>
  );
};
