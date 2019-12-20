import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { View, Text, StyleSheet, Switch } from "react-native";
import HamburgerButton from "./../components/HamburgerButton";
import Colors from "../constants/Colors";
import { Item, HeaderButtons } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { setFilter } from "../store/actions/mealsAction";

const FilterSwitch = props => {
  return (
    <View style={styles.filterContainer}>
      <Text>{props.label}</Text>
      <Switch
        trackColor={{ true: Colors.secondary }}
        thumbColor={Colors.secondary_variant}
        value={props.state}
        onValueChange={props.onChange}
      />
    </View>
  );
};

const FiltersScreen = props => {
  const { navigation } = props;

  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isLactoseFree, setIsLactoseFree] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);

  const dispatch = useDispatch();

  // useCalBack --> only re-create when dep is updated.
  const saveFilters = useCallback(() => {
    // This code below will be update or re-created only when [dep...] is updated
    const appliedFilters = {
      glutenFree: isGlutenFree,
      lactoseFree: isLactoseFree,
      vegan: isVegan,
      isVegetarian: isVegetarian
    };

    dispatch(setFilter(appliedFilters));
  }, [isGlutenFree, isLactoseFree, isVegan, isVegetarian]);

  // useEffect --> run code when dep is updated
  useEffect(() => {
    // this code below will run only when [dep...] is updated
    navigation.setParams({
      save: saveFilters
    });
  }, [saveFilters]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}> The FiltersScreen Screen!</Text>
      <FilterSwitch
        label="Gluten-free"
        state={isGlutenFree}
        onChange={newValue => {
          setIsGlutenFree(newValue);
        }}
      ></FilterSwitch>
      <FilterSwitch
        label="LactoseFree"
        state={isLactoseFree}
        onChange={newValue => {
          setIsLactoseFree(newValue);
        }}
      ></FilterSwitch>
      <FilterSwitch
        label="Vegan"
        state={isVegan}
        onChange={newValue => {
          setIsVegan(newValue);
        }}
      ></FilterSwitch>
      <FilterSwitch
        label="Vegetarian"
        state={isVegetarian}
        onChange={newValue => {
          setIsVegetarian(newValue);
        }}
      ></FilterSwitch>
    </View>
  );
};

FiltersScreen.navigationOptions = navData => {
  return {
    headerLeft: <HamburgerButton title="Menu" navigation={navData} />,
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Save"
          iconName="ios-save"
          onPress={navData.navigation.getParam("save")}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center"
  },
  title: {
    fontSize: 22,
    margin: 20,
    textAlign: "center"
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginVertical: 10
  }
});

export default FiltersScreen;
