import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import Colors from "../constants/Colors";
import ShowAllUserTrashScreen from "../screens/SellerScreen/ShowAllUserTrashScreen";
import OptionTrashCheck from "../screens/SellerScreen/OptionTrashCheck";
import SellingTransactionScreen from "../screens/SellerScreen/SellingTransactionScreen";
import UserHomepageScreen from "../screens/SellerScreen/UserHomepageScreen";
import UserSigninScreen from "../screens/UserSigninScreen";
import { Ionicons } from "@expo/vector-icons";
import SellingTransactionDetailScreen from "../screens/SellerScreen/SellingTransactionDetailScreen";
import UserSignupScreen from "../screens/UserSignupScreen";
import EditTrashForSellerScreen from "../screens/SellerScreen/EditTrashForSellerScreen";
import UserStartupScreen from "../screens/UserStartupScreen";

// for UserHomepageScreen
const UserhomepageNavigator = createStackNavigator(
  {
    UserHomepageScreen: UserHomepageScreen,
    SellingTransactionDetailScreen: SellingTransactionDetailScreen
  },
  { headerMode: "none" }
);

const ShowAllUserTrashNavigator = createStackNavigator(
  {
    ShowAllUserTrashScreen: ShowAllUserTrashScreen,
    EditTrashForSellerScreen: EditTrashForSellerScreen
  },
  { headerMode: "none" }
);

// Trash Main
const SellerBottomTabConfig = {
  Home: {
    screen: UserhomepageNavigator,
    navigationOptions: {
      tabBarLabel: "หน้าหลัก",
      tabBarIcon: tabInfo => {
        return <Ionicons name="md-home" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primary
    }
  },
  AllTrash: {
    screen: ShowAllUserTrashNavigator,
    navigationOptions: {
      tabBarLabel: "ขยะที่สะสมอยู่",
      tabBarIcon: tabInfo => {
        return <Ionicons name="md-trash" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primary
    }
  },
  CheckTrash: {
    screen: OptionTrashCheck,
    navigationOptions: {
      tabBarLabel: "เช็คขยะ",
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="md-search" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary
    }
  },
  SellTransaction: {
    screen: SellingTransactionScreen,
    navigationOptions: {
      tabBarLabel: "การขายขยะ",
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="md-list-box" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary
    }
  }
};

// Like a root navigator
const SellerBottomNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(SellerBottomTabConfig, {
        activeColor: Colors.on_primary,
        shifting: true,
        labeled: true
      })
    : createBottomTabNavigator(SellerBottomTabConfig, {
        tabBarOptions: {
          // when using like 'color={tabTintColor}
          activeTintColor: Colors.on_primary
        }
      });

// for UserHomepageScreen
const UserAuthenNavigator = createStackNavigator(
  {
    UserSigninScreen: UserSigninScreen,
    UserSignupScreen: UserSignupScreen
  },
  { headerMode: "none" }
);

const MainNavigator = createSwitchNavigator({
  UserStartupScreen: UserStartupScreen,
  UserAuthenNavigator: UserAuthenNavigator,
  SellerNavigation: SellerBottomNavigator //bottom nav
});

export default createAppContainer(MainNavigator);
