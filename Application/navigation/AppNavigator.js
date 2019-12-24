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
import UserHomepageScreen from "../screens/SellerScreen/UserHomepageScreen";
import UserSigninScreen from "../screens/UserSigninScreen";
import { Ionicons } from "@expo/vector-icons";
import SellingTransactionDetailScreen from "../screens/SellerScreen/SellingTransactionDetailScreen";
import UserSignupScreen from "../screens/UserSignupScreen";
import EditTrashForSellerScreen from "../screens/SellerScreen/EditTrashForSellerScreen";
import StartupScreen from "../screens/UserStartupScreen";
import SellingTrashScreen from "../screens/SellerScreen/SellingTrashScreen";

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
    ShowAllUserTrashScreen: {
      screen: ShowAllUserTrashScreen,
      navigationOptions: {
        headerTitle: "ขยะที่สะสมไว้"
      }
    },
    // EditTrashForSellerScreen: {screen: EditTrashForSellerScreen},
    SellingTrashScreen: {
      screen: SellingTrashScreen,
      navigationOptions: { headerTitle: "ขายขยะ" }
    }
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
        activeColor: Colors.on_primary,
        shifting: true,
        labeled: true,
        barStyle: {
          height: Dimensions.get("window").height * 0.1,
          backgroundColor: Colors.on_secondary
        }
      })
    : createBottomTabNavigator(SellerBottomTabConfig, {
        tabBarOptions: {
          // when using like 'color={tabTintColor}
          activeTintColor: Colors.on_primary,
          style: {
            backgroundColor: Colors.primary,
            height: Dimensions.get("window").height * 0.1
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
  SellerNavigator: SellerNavigator //Seller Homepage
});

export default createAppContainer(MainNavigator);
