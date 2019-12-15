import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";

import Colors from "../../constants/Colors";
import ThaiText from "../../components/ThaiText";
import ThaiTitleText from "../../components/ThaiTitleText";

export default ShowAllUserTrashScreen = props => {
  return (
    <View style={styles.screen}>
      <View style={styles.titleScreen}>
        <ThaiTitleText>ขยะที่เก็บไว้</ThaiTitleText>
      </View>
      <View style={styles.allTrashInfo}></View>
    </View>
  );
};

// ShowAllUserTrashScreen.navigationOptions = navData => {
//   return null;
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    backgroundColor: Colors.screen
  },
  userInfoCard: {
    marginTop: Dimensions.get("window").height * 0.025,
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.3
  },
  recentSellTransactionContainer: {
    marginTop: 10,
    paddingVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: Colors.primary_variant
  },
  sellTransactionCard: {
    backgroundColor: Colors.on_primary,
    width: "90%",
    height: Dimensions.get("window").height * 0.14,
    marginVertical: 5
  }
});
