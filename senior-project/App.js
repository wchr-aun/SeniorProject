import React, { useState } from "react";
import SellerNavigator from "./navigation/SellerNavigator.js";
import { AppLoading } from "expo";
import * as Font from "expo-font";

import ImportedFonts from "./constants/ImportedFonts.js";

// --- App'sFont Set-up --- //
const fetchFonts = () => {
  return Font.loadAsync(ImportedFonts);
};

export default function App() {
  // -- Get font, test
  const [fontIsLoaded, setFontIsLoaded] = useState(false);
  if (!fontIsLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontIsLoaded(true)}
      />
    );
  }

  return <SellerNavigator />;
}
