import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

import StartupScreen from "../screens/UserStartupScreen";
import UserSigninScreen from "../screens/UserSigninScreen";
import UserSignupScreen from "../screens/UserSignupScreen";
import ConfigAccountScreen from "../screens/ConfigAccountScreen";

import ShowSellerItemsScreen from "../screens/SellerScreen/ShowSellerItemsScreen";
import OptionTrashCheckScreen from "../screens/SellerScreen/OptionTrashCheck";
import SellingTransactionScreen from "../screens/SellerScreen/SellingTransactionScreen";
import SellerHomepageScreen from "../screens/SellerScreen/SellerHomepageScreen";
import SellingTransactionDetailScreen from "../screens/SellerScreen/SellingTransactionDetailScreen";
import SellingTrashScreen from "../screens/SellerScreen/SellingTrashScreen";
import ChooseBuyerScreen from "../screens/SellerScreen/ChooseBuyerScreen";

import BuyerHomepageScreen from "../screens/BuyerScreen/BuyerHomepageScreen";
import EditBuyerInfomationScreen from "../screens/BuyerScreen/EditBuyerInfomationScreen";

// Constant setting
import AppVariableSetting from "../constants/AppVariableSetting";
import UIScreenTemplate from "../screens/UIScreenTemplate";
import EditingUserprofileScreen from "../screens/EditingUserprofileScreen";

// ************************************* Seller ***********************************
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

const ShowSellerItemsNavigator = createStackNavigator(
  {
    ShowSellerItemsScreen: {
      screen: ShowSellerItemsScreen
    },
    // EditTrashForSellerScreen: {screen: EditTrashForSellerScreen},
    SellingTrashScreen: {
      screen: SellingTrashScreen,
      navigationOptions: { headerTitle: "ขายขยะ" }
    },
    chooseBuyerForSellScreen: ChooseBuyerScreen
  },
  {
    headerMode: Platform.OS === "android" ? "screen" : "float",
    cardStyle: {
      paddingTop: 0
    }
  }
);

// Hiding bottom tabbar
ShowSellerItemsNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

SellingTransactionNavigator = createStackNavigator(
  {
    SellingTransactionScreen: {
      screen: SellingTransactionScreen,
      navigationOptions: { headerTitle: "การขายขยะ" }
    },
    SellingTransactionDetailScreen: {
      screen: SellingTransactionDetailScreen,
      navigationOptions: { headerTitle: "รายละเอียด" }
    },
    chooseBuyerForSellScreen: ChooseBuyerScreen
  },
  { headerMode: Platform.OS === "android" ? "screen" : "float" }
);

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
    screen: ShowSellerItemsNavigator,
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
    screen: SellingTransactionNavigator,
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

// **************************** For Buyer ****************************

// Trash Main
const BuyerBottomTabConfig = {
  Home: {
    screen: BuyerHomepageScreen,
    navigationOptions: {
      tabBarLabel: "หน้าหลัก",
      tabBarIcon: tabInfo => {
        return <Ionicons name="md-home" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primary
    }
  },
  EditBuyerInfo: {
    screen: EditBuyerInfomationScreen,
    navigationOptions: {
      tabBarLabel: "จัดการรายการ",
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="ios-build" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary
    }
  },
  buyerTransaction: {
    screen: EditBuyerInfomationScreen,
    navigationOptions: {
      tabBarLabel: "การรับซื้อขยะ",
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="ios-list-box" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary
    }
  },
  searchSellTransaction: {
    screen: BuyerHomepageScreen,
    navigationOptions: {
      tabBarLabel: "การรับซื้อขยะ",
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="md-search" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary
    }
  }
};

// Like a root navigator
const BuyerNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(BuyerBottomTabConfig, {
        activeColor: Colors.primary_variant,
        shifting: true,
        labeled: true,
        inactiveColor: Colors.on_primary,
        barStyle: {
          height: AppVariableSetting.bottomBarHeight,
          backgroundColor: Colors.primary
        }
      })
    : createBottomTabNavigator(BuyerBottomTabConfig, {
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
  BuyerNavigator: BuyerNavigator, //Seller Homepage
  EditingUserprofileScreen: EditingUserprofileScreen,
  ConfigAccountScreen: ConfigAccountScreen
});

EditingUserprofileScreen;
export default createAppContainer(MainNavigator);
