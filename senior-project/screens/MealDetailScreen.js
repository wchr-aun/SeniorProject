import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { toggleFavorite } from "../store/actions/mealsAction";

const ListItem = props => {
  return (
    <View style={styles.listItem}>
      <Text>{props.children}</Text>
    </View>
  );
};

const MealDetailScreen = props => {
  const availableMeals = useSelector(reducers => reducers.mealsReducer.meals);
  const mealId = props.navigation.getParam("mealId");
  const selectedMeal = availableMeals.find(meal => meal.id === mealId);

  // Toggle Favourite meal
  const dispatch = useDispatch();
  const toggleFavouriteHandler = useCallback(() => {
    dispatch(toggleFavorite(mealId));
  }, [dispatch, mealId]);

  // Send meal-title to navigation header bar
  useEffect(() => {
    props.navigation.setParams({
      toggleFavouriteHandler: toggleFavouriteHandler
    });
  }, [toggleFavouriteHandler]);

  // isFav to navigation header bar
  const currentIsMealFavourite = useSelector(reducers =>
    reducers.mealsReducer.favouriteMeals.some(meal => meal.id === mealId)
  );

  // Send isFav to navigation header bar
  useEffect(() => {
    props.navigation.setParams({ isFav: currentIsMealFavourite });
  }, [currentIsMealFavourite]);

  return (
    <ScrollView>
      <Image source={{ uri: selectedMeal.imageUrl }} style={styles.image} />
      <View style={{ ...styles.details }}>
        <Text>{selectedMeal.duration}m</Text>
        <Text>{selectedMeal.complexity.toUpperCase()}</Text>
        <Text>{selectedMeal.affordability.toUpperCase()}</Text>
      </View>
      <Text style={styles.title}>Ingredients</Text>
      {selectedMeal.ingredients.map(ingredient => (
        <ListItem key={ingredient}>{ingredient}</ListItem>
      ))}
      <Text style={styles.title}>Steps</Text>
      {selectedMeal.steps.map(step => (
        <ListItem key={step}>{step}</ListItem>
      ))}
    </ScrollView>
  );
};

// This function wil call automatically when loading this page by redirection.
MealDetailScreen.navigationOptions = navigationData => {
  // Get Meal-title that sent from above
  const mealTitle = navigationData.navigation.getParam("mealTitle");

  // Get toggleFavouriteHandler function
  const toggleFavourite = navigationData.navigation.getParam(
    "toggleFavouriteHandler"
  );

  // information that signal the start icon to open/off
  const isFavourite = navigationData.navigation.getParam("isFav");

  return {
    headerTitle: mealTitle,
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Favorite"
          iconName={isFavourite ? "ios-star" : "ios-star-outline"}
          onPress={toggleFavourite}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200
  },
  details: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-around"
  },
  title: {
    fontSize: 22,
    textAlign: "center"
  },
  listItem: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10
  }
});

export default MealDetailScreen;
