import React from "react";
import { useSelector } from "react-redux";

import { CATEGORIES } from "./../data/dummy-data";
import MealList from "../components/MealList";

const CategoryMealScreen = props => {
  // For Forcing CategoryMealsScreen re-render and then < MealList /> will be re-create
  const favouriteMeals = useSelector(
    reducers => reducers.mealsReducer.favouriteMeals
  );

  console.log("categoryMealScreen - render");

  // get from categoriesScreen
  const catId = props.navigation.getParam("categoryId");

  const availableMeals = useSelector(
    reducers => reducers.mealsReducer.filteredMeals
  );

  const displayedMeals = availableMeals.filter(
    // If indexOf(catId) < 0, so 'meal.categoryIds' not have an 'catId' item
    meal => meal.categoryIds.indexOf(catId) >= 0
  );

  return <MealList listData={displayedMeals} navigation={props.navigation} />;
};

// Dynimic Header
CategoryMealScreen.navigationOptions = navigationData => {
  const catId = navigationData.navigation.getParam("categoryId");

  const selectedCategory = CATEGORIES.find(cat => cat.id === catId);
  return {
    headerTitle: selectedCategory.title
  };
};

export default CategoryMealScreen;
