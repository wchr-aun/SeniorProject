import React from "react";
import { Platform } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "./CustomHeaderButton";

export default HamburgerButton = props => {
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title={props.title}
        iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
        onPress={() => {
          props.navigation.navigation.toggleDrawer();
        }}
      />
    </HeaderButtons>
  );
};
