import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MealList from "./../components/MealList";
import HamburgerButton from "./../components/HamburgerButton";

import { useSelector } from "react-redux";

const FavouritesScreen = props => {
  const favMeals = useSelector(
    reducers => reducers.mealsReducer.favouriteMeals
  );

  if (favMeals.length === 0 || !favMeals) {
    return (
      <View style={styles.content}>
        <Text> No Favorite meals found.</Text>
      </View>
    );
  }

  return <MealList listData={favMeals} navigation={props.navigation} />;
};

FavouritesScreen.navigationOptions = navData => {
  return {
    headerLeft: <HamburgerButton title="Menu" navigation={navData} />
  };
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default FavouritesScreen;
