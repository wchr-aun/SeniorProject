import React from "react";
import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";

import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryMealScreen from "./../screens/CategoryMealsScreen";
import MealDetailScreen from "./../screens/MealDetailScreen";
import Colors from "../constants/Colors";
import FavouritesScreen from "./../screens/FavouritesScreen";
import { Ionicons } from "@expo/vector-icons";
import FiltersScreen from "./../screens/FiltersScreen";

const defaultStackNavOptions = {
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary
};

const MealsNavigator = createStackNavigator(
  {
    Categories: {
      screen: CategoriesScreen,
      navigationOptions: {
        headerTitle: "Meal Categories"
      }
    },
    // Show all meals that fit on a category.
    CategoryMeal: CategoryMealScreen,
    MealDetail: MealDetailScreen
  },
  {
    defaultNavigationOptions: {
      ...defaultStackNavOptions,
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.secondary : "white"
      }
    }
  }
);

const FavouriteNavigator = createStackNavigator(
  {
    Favourites: {
      screen: FavouritesScreen,
      navigationOptions: {
        headerTitle: "Favourite Meals"
      }
    },
    MealDetail: MealDetailScreen
  },
  {
    defaultNavigationOptions: {
      ...defaultStackNavOptions,
      headerStyle: {
        backgroundColor:
          Platform.OS === "android" ? Colors.secondary_variant : "white"
      }
    }
  }
);

const tabScreenConfig = {
  Meals: {
    screen: MealsNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="ios-restaurant" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.secondary
    }
  },
  Favorites: {
    screen: FavouriteNavigator,
    navigationOptions: {
      tabBarLabel: "Favourite!",
      tabBarIcon: tabInfo => {
        return <Ionicons name="ios-star" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.secondary_variant
    }
  }
};

// Like a root navigator
const MealsFavTabNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        activeColor: "white",
        shifting: true
      })
    : createBottomTabNavigator(
        { tabScreenConfig },
        {
          tabBarOptions: {
            // when using like 'color={tabTintColor}
            activeTintColor: Colors.accent
          }
        }
      );

const FiltersNavigator = createStackNavigator(
  {
    Filters: {
      screen: FiltersScreen,
      navigationOptions: {
        headerTitle: "Filter Meals",
        headerStyle: {
          backgroundColor:
            Platform.OS === "android" ? Colors.secondary : "white"
        }
      }
    }
  },
  {
    defaultNavigationOptions: {
      ...defaultStackNavOptions,
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.secondary : "white"
      }
    }
  }
);

const MainNavigator = createDrawerNavigator(
  {
    MealsFavs: {
      screen: MealsFavTabNavigator,
      navigationOptions: {
        drawerLabel: "Meals"
      }
    },
    Filters: {
      screen: FiltersNavigator,
      navigationOptions: {
        drawerLabel: "Filtered Meals"
      }
    }
  },
  {
    contentOptions: {
      activeTintColor: Colors.accent
    }
  }
);

export default createAppContainer(MainNavigator);
