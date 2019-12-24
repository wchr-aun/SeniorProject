import { YellowBox } from "react-native";
import React, { useState, useEffect } from "react";
import AppNavigator from "./navigation/AppNavigator";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { Provider } from "react-redux";
import authReducer from "./store/reducers/authReducer";

import ImportedFonts from "./constants/ImportedFonts.js";
// Ignore warning timer
import "./utils/jsTimerFix";
YellowBox.ignoreWarnings(["Setting a timer"]);

// --- App'sFont Set-up --- //
const fetchFonts = () => {
  return Font.loadAsync(ImportedFonts);
};

// --- Redux Settup --- //
const rootReducer = combineReducers({
  authReducer: authReducer
});
const store = createStore(
  rootReducer,
  composeWithDevTools(
    //ref. https://stackoverflow.com/questions/50385592/how-to-apply-redux-developer-tools-with-reduxthunk
    applyMiddleware(ReduxThunk)
  )
);

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

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
