import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { CATEGORIES } from "./../data/dummy-data";

import CategoryGrid from "./../components/CategoryGrid";
import HamburgerButton from "./../components/HamburgerButton";

const CategoriesScreen = props => {
  const renderGridItem = itemData => {
    return (
      <CategoryGrid
        color={itemData.item.color}
        id={itemData.item.id}
        title={itemData.item.title}
        onPress={() => {
          props.navigation.navigate({
            routeName: "CategoryMeal",
            params: {
              categoryId: itemData.item.id
            }
          });
        }}
      />
    );
  };

  return (
    <FlatList
      keyExtractor={(item, index) => item.id}
      data={CATEGORIES}
      numColumns={2}
      renderItem={renderGridItem}
    />
  );
};

CategoriesScreen.navigationOptions = navData => {
  return {
    headerLeft: <HamburgerButton title="Menu" navigation={navData} />
  };
};

const styles = StyleSheet.create({});

export default CategoriesScreen;
