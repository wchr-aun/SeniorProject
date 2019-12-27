import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  FlatList
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../../constants/Colors";

export default UserAuthenScreen = props => {
  useEffect(() => {
    console.log("Choose Buyer Screen");
  }, []);

  const sellerItemsForSell = useSelector(
    state => state.sellerItems.itemsForSell
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        ...styles.screen,
        flex: 1
      }}
    >
      <View
        style={{
          paddingTop: getStatusBarHeight(),
          width: wp("100%"),
          height: hp("100%") + getStatusBarHeight(),
          backgroundColor: Colors.secondary,
          borderRadius: 10
        }}
      >
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            height: hp("30%")
          }}
        >
          <Text>Content Here</Text>
        </View>
        <FlatList
          data={SELLINGTRANSACTION}
          keyExtractor={item => item.transactionId}
          renderItem={itemData => (
            <SellTransactionCard
              amountOfType={itemData.item.amountOfType}
              imgUrl={itemData.item.imgUrl}
              userName={itemData.item.buyerName}
              meetTime={itemData.item.meetTime}
              style={styles.sellTransactionCard}
              onPress={() => {
                selectedHandler(itemData.item);
              }}
            />
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

UserAuthenScreen.navigationOptions = {
  headerTitle: "UserAuthenScreen"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});
