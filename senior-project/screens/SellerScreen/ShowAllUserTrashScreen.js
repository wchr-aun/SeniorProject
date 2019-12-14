import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../constants/Colors";

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
    margin: 40,
    backgroundColor: Colors.screen
  }
});
