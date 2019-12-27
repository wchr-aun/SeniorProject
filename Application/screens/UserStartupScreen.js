import React, { useEffect } from "react";
import { View, AsyncStorage } from "react-native";
import firebaseUtil from "../firebase";
import { useDispatch } from "react-redux";
import * as authAction from "../store/actions/authAction";

export default UserStartupScreen = props => {
  const dispatch = useDispatch();
  console.log('startup')

  useEffect(() => {
    trySignin();
  }, [dispatch]);

  const trySignin = async () => {
    firebaseUtil.auth().onAuthStateChanged(async user => {
      if (user != null) {
        let config_role = await AsyncStorage.getItem('CONFIG_ROLE');
        // get user profile from redux
        await dispatch(authAction.signin());

        if (config_role == null) 
          props.navigation.navigate("ConfigAccountScreen")
        else props.navigation.navigate("SellerNavigator")
      }
      else props.navigation.navigate("UserAuthenNavigator")
    });
  };

  return <View></View>;
};
