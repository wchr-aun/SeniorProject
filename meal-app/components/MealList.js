import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import MealItem from "./MealItem";

const MealList = props => {
  // For the Showing an header-right star that indicate if is meal favourite?
  const favouriteMeals = useSelector(
    reducers => reducers.mealsReducer.favouriteMeals
  );

  const renderMealItem = itemData => {
    const isFavourite = favouriteMeals.some(
      meal => meal.id === itemData.item.id
    );

    console.log("meallist - render - isFav " + isFavourite);

    return (
      <MealItem
        titleItem={itemData.item.title}
        image={itemData.item.imageUrl}
        duration={itemData.item.duration}
        onSelectMeal={() => {
          props.navigation.navigate({
            routeName: "MealDetail",
            params: {
              mealId: itemData.item.id,
              // pass by this method for initial load (quick)
              mealTitle: itemData.item.title,
              isFav: isFavourite
            }
          });
        }}
        affordability={itemData.item.affordability}
        complexity={itemData.item.complexity}
      />
    );
  };

  return (
    <View style={styles.list}>
      <FlatList
        data={props.listData}
        keyExtractor={(item, index) => item.id}
        renderItem={renderMealItem}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  flatList: {
    width: "100%"
  }
});

export default MealList;
