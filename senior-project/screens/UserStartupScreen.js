import React from "react";
import { View, Text } from "react-native";
import firebaseUtil from "../firebase";

export default UserStartupScreen = props => {
  firebaseUtil.auth().onAuthStateChanged(user => {
    if (user != null) {
      // auto login
      props.navigation.navigate("SellerNavigator");
    } else {
      // No user no exist in firebase firestore
      props.navigation.navigate("UserAuthenNavigator");
    }
  });

  return <View></View>;
};
