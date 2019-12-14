import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import SellerNavigation from "./navigation/SellerNavigation.js";

export default function App() {
  return <SellerNavigation />;
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
