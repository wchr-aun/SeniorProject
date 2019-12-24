import React, { useEffect } from "react";
import { View, Text } from "react-native";
import firebaseUtil from "../firebase";
import { useDispatch } from "react-redux";
import * as authAction from "../store/actions/authAction";

export default UserStartupScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    trySignin();
  }, [dispatch]);

  const trySignin = async () => {
    firebaseUtil.auth().onAuthStateChanged(async user => {
      if (user != null) {
        // get user profile from redux
        dispatch(authAction.signin());

        // auto login
        props.navigation.navigate("SellerNavigator");
      } else {
        // No user no exist in firebase firestore
        props.navigation.navigate("UserAuthenNavigator");
      }
    });
  };

  return <View></View>;
};
