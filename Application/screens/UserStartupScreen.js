import React, { useEffect } from "react";
import { View, AsyncStorage } from "react-native";
import firebaseUtil from "../firebase";
import { useDispatch } from "react-redux";
import * as authAction from "../store/actions/authAction";

export default UserStartupScreen = props => {
  const dispatch = useDispatch();
  console.log('startup')

  useEffect(() => {
    firebaseUtil.auth().onIdTokenChanged(user => {
      if (user != null) {
        dispatch(authAction.signin()).then(() => {
          AsyncStorage.getItem('CONFIG_ROLE').then(config_role => {
            if (config_role == "seller")
              props.navigation.navigate("SellerNavigator")
            else if (config_role == "buyer") {
              props.navigation.navigate("SellerNavigator") // wait for buyer screen
            }
            else props.navigation.navigate("ConfigAccountScreen")
          })
        })
      }
      else props.navigation.navigate("UserAuthenNavigator")
    });
  }, []);

  return <View></View>;
};
