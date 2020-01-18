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
import { getCurrentLocation, getManualStringLocation } from "../../utils/libary";
import ModalShowInteractMap from "../../components/ModalShowInteractMap";
import firebaseUtil from "../../firebase";

// CHOOSE_CURRENT_ADDR
// for updaing value of variable form

export default UserSignupScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentAddr, setCurrentAddr] = useState(false);

  // 'formState (state snapshot) will be updated when state changed

  useEffect(() => {
    console.log("path optimize");
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("มีข้อผิดพลาดบางอย่างเกิดขึ้น!", error, [{ text: "OK" }]);
      setError("");
    }
  }, [error]);

  const userProfile = useSelector(state => state.user.userProfile);
  useEffect(() => {
    setIsLoading(true);
    if (userProfile.uid) setIsLoading(false);
  }, [userProfile]);

  const [addrModalVisible, setAddrModalVisible] = useState(false);
  const [addrReadable, setAddrReadable] = useState("");
  const [addrCord, setAddrCord] = useState("");
  const [sellerAddr, setSellerAddr] = useState(""); // really used

  // Search map from user input form
  const searchMapHandler = async () => {
    // do async task
    setAddrCord(userProfile.addr);
    setAddrModalVisible(true);
  };

  if (addrModalVisible) {
    return (
      <ModalShowInteractMap
        setModalVisible={setAddrModalVisible}
        modalVisible={addrModalVisible}
        origin={{latitude: addrCord.latitude, longitude: addrCord.longitude}}
        destination={{latitude: 13.6487268, longitude: 100.5007013}}
        pathOptimize={true}
        setSellerAddr={setSellerAddr}
        addrReadable={addrReadable}
      />
    );
  }

  return (
    <View>
      <View style={{ width: "100%", height: hp("60%s") }}>
        {/* <FlatList
          data={}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  width: wp("90%"),
                  height: hp("15%"),
                  backgroundColor: Colors.screen,
                  alignSelf: "center",
                  borderRadius: 10,
                  margin: wp("3.75%"),
                  justifyContent: "center"
                }}
                onPress={() => buyerSelectHandler(item.id, item.purchaseList)}
              >
                <View style={{ alignSelf: "center" }}>
                  <Text>{item.id}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        /> */}
      </View>
      <CustomButton
        disable={currentAddr}
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
          currentAddr ? Colors.lineSeparate : Colors.primary
        }
        btnTitleFontSize={14}
      >
        Find my path
      </CustomButton>
    </View>
  );
};
