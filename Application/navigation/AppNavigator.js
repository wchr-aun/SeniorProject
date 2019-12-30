import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform, Dimensions } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import Colors from "../constants/Colors";
import ShowAllUserTrashScreen from "../screens/SellerScreen/ShowAllUserTrashScreen";
import OptionTrashCheckScreen from "../screens/SellerScreen/OptionTrashCheck";
import SellingTransactionScreen from "../screens/SellerScreen/SellingTransactionScreen";
import SellerHomepageScreen from "../screens/SellerScreen/SellerHomepageScreen";
import UserSigninScreen from "../screens/UserSigninScreen";
import { Ionicons } from "@expo/vector-icons";
import SellingTransactionDetailScreen from "../screens/SellerScreen/SellingTransactionDetailScreen";
import UserSignupScreen from "../screens/UserSignupScreen";
import StartupScreen from "../screens/UserStartupScreen";
import SellingTrashScreen from "../screens/SellerScreen/SellingTrashScreen";
import ConfigAccountScreen from "../screens/ConfigAccountScreen";
import ChooseBuyerScreen from "../screens/SellerScreen/ChooseBuyerScreen";

// Constant setting
import AppVariableSetting from "../constants/AppVariableSetting";
import UIScreenTemplate from "../screens/UIScreenTemplate";

// for UserHomepageScreen
const SellerhomepageNavigator = createStackNavigator(
  {
    SellerHomepageScreen: SellerHomepageScreen,
    UIScreenTemplate: UIScreenTemplate,
    SellingTransactionDetailScreen: SellingTransactionDetailScreen
  },
  { headerMode: "none" }
);

// Hiding bottom tabbar for childe of UserhomepageNavigator
SellerhomepageNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

const ShowAllUserTrashNavigator = createStackNavigator(
  {
    ShowAllUserTrashScreen: {
      screen: ShowAllUserTrashScreen
    },
    // EditTrashForSellerScreen: {screen: EditTrashForSellerScreen},
    SellingTrashScreen: {
      screen: SellingTrashScreen,
      navigationOptions: { headerTitle: "ขายขยะ" }
    },
    chooseBuyerForSellScreen: ChooseBuyerScreen
  },
  { headerMode: Platform.OS === "android" ? "screen" : "float" }
);

// Hiding bottom tabbar
ShowAllUserTrashNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

// Trash Main
const SellerBottomTabConfig = {
  Home: {
    screen: SellerhomepageNavigator,
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
    screen: OptionTrashCheckScreen,
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
const SellerNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(SellerBottomTabConfig, {
        activeColor: Colors.primary_variant,
        shifting: true,
        labeled: true,
        inactiveColor: Colors.on_primary,
        barStyle: {
          height: AppVariableSetting.bottomBarHeight,
          backgroundColor: Colors.primary
        }
      })
    : createBottomTabNavigator(SellerBottomTabConfig, {
        tabBarOptions: {
          // when using like 'color={tabTintColor}
          activeTintColor: Colors.on_primary,
          style: {
            backgroundColor: Colors.primary,
            height: AppVariableSetting.bottomBarHeight
          }
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
  StartupScreen: StartupScreen,
  UserAuthenNavigator: UserAuthenNavigator,
  SellerNavigator: SellerNavigator, //Seller Homepage
  ConfigAccountScreen: ConfigAccountScreen
});

export default createAppContainer(MainNavigator);
