import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-navigation";

export default ShowAllUserTrashScreen = props => {
  return (
    <View style={styles.container}>
      <Text>ShowAllUserTrashScreen</Text>
    </View>
  );
};

// UserHomepageScreen.navigationOptions = navData => {
//   return null;
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 40 //for screen
  }
});
