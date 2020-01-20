import React, { useEffect } from "react";
import { View, AsyncStorage } from "react-native";
import firebaseUtil from "../firebase";
import { useDispatch } from "react-redux";
import * as authAction from "../store/actions/authAction";
import * as buyerAction from "../store/actions/buyerAction";
import * as wasteTypeAction from "../store/actions/wasteTypeAction";
import { verifyNotificationsPermissions } from "../utils/permissions";
import 'react-native-console-time-polyfill';

export default UserStartupScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("startup");
    verifyNotificationsPermissions();
    firebaseUtil.auth().onAuthStateChanged(user => {
      console.log("startup-afterOnAuth");
      console.time("Startup-Navigate")
      if (user != null) {
        dispatch(authAction.signin())
          .then(dispatch(wasteTypeAction.fetchWasteType()))
          .then(() => {
            AsyncStorage.getItem("CONFIG_ROLE").then(config_role => {
              dispatch(authAction.setUserRole(config_role));
              console.timeEnd("Startup-Navigate")
              console.log("startup-beforeNavigate");
              if (config_role == "seller")
                props.navigation.navigate("SellerNavigator");
              else if (config_role == "buyer") {
                props.navigation.navigate("BuyerNavigator");
              } else props.navigation.navigate("ConfigAccountScreen");
            });
          });
      } else {
        console.timeEnd("Startup-Navigate")
        console.log("startup-beforeNavigatetoLogin");
        props.navigation.navigate("UserAuthenNavigator")
      };
    });
  }, []);

  return <View></View>;
};
