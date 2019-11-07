import { MEALS } from "../../data/dummy-data";
import { TOGGLE_FAVORITE, SET_FILTERS } from "../actions/mealsAction";

// inital state when app lunch
const instialState = {
  meals: MEALS,
  filteredMeals: MEALS,
  favouriteMeals: []
};

const mealsReducer = (currentState = instialState, action) => {
  switch (action.type) {
    case TOGGLE_FAVORITE:
      // Find the meal in 'favouriteMeals' array
      const existingIndex = currentState.favouriteMeals.findIndex(
        meal => meal.id === action.mealId
      );
      // If that meal is Existing. Remove it
      if (existingIndex >= 0) {
        const updateFavMeals = [...currentState.favouriteMeals];
        updateFavMeals.splice(existingIndex, 1);
        return { ...currentState, favouriteMeals: updateFavMeals };
      }
      // It not, Add the meal as new favItem
      else {
        const newFavMeal = currentState.meals.find(
          meal => meal.id === action.mealId
        );
        return {
          ...currentState,
          favouriteMeals: currentState.favouriteMeals.concat(newFavMeal)
        };
      }
    case SET_FILTERS:
      const appliedFilters = action.filters;
      const updatedFilteredMeals = currentState.meals.filter(meal => {
        if (appliedFilters.glutenFree && !meal.isGlutenFree) {
          return false;
        }
        if (appliedFilters.lactoseFree && !meal.isLactoseFree) {
          return false;
        }
        if (appliedFilters.vegan && !meal.isVegan) {
          return false;
        }
        if (appliedFilters.isVegetarian && !meal.isVegetarian) {
          return false;
        }
        return true;
      });

      return { ...currentState, filteredMeals: updatedFilteredMeals };
    default:
      return currentState;
  }
};

export default mealsReducer;
