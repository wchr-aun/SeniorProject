import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { getStatusBarHeight } from "react-native-status-bar-height";

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
import PathOptimization from "../screens/BuyerScreen/PathOptimizationScreen";
import BuyingTransactionScreen from "../screens/BuyerScreen/BuyingTransactionScreen";
import SearchQuicksellingScreen from "../screens/BuyerScreen/SearchQuicksellingScreen";

// Constant setting
import AppVariableSetting from "../constants/AppVariableSetting";
import EditingUserprofileScreen from "../screens/EditingUserprofileScreen";
import BuyingTransactionDetailScreen from "../screens/BuyerScreen/BuyingTransactionDetailScreen";
import BuyingQuickTransactionDetailScreen from "../screens/BuyerScreen/BuyingQuickTransactionDetailScreen";
import SellingReqBeforeSendingScreen from "../screens/SellerScreen/SellingReqBeforeSendingScreen";

// ************************************* Seller ***********************************
// for UserHomepageScreen
const SellerhomepageNavigator = createStackNavigator(
  {
    SellerHomepageScreen: SellerHomepageScreen,
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
    SellingTrashScreen: {
      screen: SellingTrashScreen,
      navigationOptions: { headerTitle: "ขายขยะ" }
    },
    chooseBuyerForSellScreen: ChooseBuyerScreen,
    sellReqBeforeSending: SellingReqBeforeSendingScreen
  },
  {
    headerMode: "none",
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
    }
  },
  { headerMode: "none" }
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
      tabBarColor: Colors.primary_dark
    }
  },
  AllTrash: {
    screen: ShowSellerItemsNavigator,
    navigationOptions: {
      tabBarLabel: "ขยะที่สะสมอยู่",
      tabBarIcon: tabInfo => {
        return <Ionicons name="md-trash" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primary_dark
    }
  },
  CheckTrash: {
    screen: OptionTrashCheckScreen,
    navigationOptions: {
      tabBarLabel: "เช็คขยะ",
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="md-camera" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary_dark
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
      tabBarColor: Colors.primary_dark
    }
  }
};

// Like a root navigator
const SellerNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(SellerBottomTabConfig, {
        activeColor: Colors.primary_bright,
        shifting: true,
        labeled: true,
        inactiveColor: Colors.soft_primary_dark,
        barStyle: {
          height: AppVariableSetting.bottomBarHeight,
          backgroundColor: Colors.primary_dark
        }
      })
    : createBottomTabNavigator(SellerBottomTabConfig, {
        tabBarOptions: {
          // when using like 'color={tabTintColor}
          activeTintColor: Colors.primary_bright,
          style: {
            backgroundColor: Colors.primary_dark,
            height: AppVariableSetting.bottomBarHeight
          }
        }
      });

// **************************** For Buyer ****************************
const SearchQuicksellingNavigator = createStackNavigator(
  {
    SearchQuicksellingScreen,
    BuyingTransactionDetailScreen
  },
  { headerMode: "none" }
);

const BuyingTransactionNavigator = createStackNavigator(
  {
    BuyingTransactionScreen,
    BuyingTransactionDetailScreen
  },
  { headerMode: "none" }
);

const BuyerTransactionNavigator = createMaterialTopTabNavigator(
  {
    PathOptimization: {
      screen: PathOptimization,
      navigationOptions: {
        tabBarLabel: "การรับซื้อขยะในวันนั้น",
        tabBarIcon: tabInfo => {
          return (
            <Ionicons
              name="md-map"
              size={25}
              color={Colors.on_primary_dark.low_constrast}
            />
          );
        }
      }
    },
    AllTypeTransaction: {
      screen: BuyingTransactionNavigator,
      navigationOptions: {
        headerTitle: "การรับซื้อขยะ",
        tabBarLabel: "การรับซื้อขยะในวันนั้น",
        tabBarIcon: tabInfo => {
          return (
            <Ionicons
              name="md-list-box"
              size={25}
              color={Colors.on_primary_dark.low_constrast}
            />
          );
        }
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "white",
      showIcon: true,
      showLabel: false,
      style: {
        backgroundColor: Colors.soft_primary_dark,
        paddingTop: getStatusBarHeight()
      }
    }
  }
);

// Trash Main
const BuyerBottomTabConfig = {
  Home: {
    screen: BuyerHomepageScreen,
    navigationOptions: {
      tabBarLabel: "หน้าหลัก",
      tabBarIcon: tabInfo => {
        return <Ionicons name="md-home" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primary_dark
    }
  },
  searchSellTransaction: {
    screen: SearchQuicksellingNavigator,
    navigationOptions: {
      tabBarLabel: "การรับซื้อขยะ",
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="md-search" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary_dark
    }
  },
  BuyerTransaction: {
    screen: BuyerTransactionNavigator,
    navigationOptions: {
      tabBarLabel: "การรับซื้อขยะ",
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="ios-list-box" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary_dark
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
      tabBarColor: Colors.primary_dark
    }
  }
};

// Like a root navigator
const BuyerNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(BuyerBottomTabConfig, {
        activeColor: Colors.primary_bright,
        shifting: true,
        labeled: true,
        inactiveColor: Colors.on_primary_dark.low_constrast,
        barStyle: {
          height: AppVariableSetting.bottomBarHeight,
          backgroundColor: Colors.primary_dark
        }
      })
    : createBottomTabNavigator(BuyerBottomTabConfig, {
        tabBarOptions: {
          // when using like 'color={tabTintColor}
          activeTintColor: Colors.on_primary_dark.high_constrast,
          style: {
            backgroundColor: Colors.primary_dark,
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
