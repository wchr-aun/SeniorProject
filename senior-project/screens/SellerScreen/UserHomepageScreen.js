import React from "react";
import { StyleSheet, FlatList, View, Text, SafeAreaView } from "react-native";

export default UserHomepageScreen = props => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>UserHomepageScreen</Text>
    </SafeAreaView>
  );
};

// UserHomepageScreen.navigationOptions = navData => {
//   return null;
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  }
});
