import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import Colors from "../../constants/Colors";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true
      };
    default:
      return state;
  }
};

export default Input = props => {
  const [inputState, dispatchInputReducer] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initialValid ? props.initialValid : false,
    touched: false
  });

  const textChangeHandler = text => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    dispatchInputReducer({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  // Send data back to screen that use this component
  const { onInputChange, id } = props;
  useEffect(() => {
    // if (inputState.touched) {
    onInputChange(id, inputState.value, inputState.isValid);
    // }
  }, [inputState, onInputChange, id]);

  const lostFocusHandler = () => {
    dispatchInputReducer({ type: INPUT_BLUR });
  };

  return (
    <View
      style={{ ...styles.formControl, ...props.style, alignSelf: "center" }}
    >
      <Text style={styles.label}>{props.label}</Text>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#ebebeb",
          alignItems: "center"
        }}
      >
        <View style={{ marginHorizontal: "1.5%" }}>
          <MaterialCommunityIcons
            size={wp("7%")}
            color="#ebebeb"
            name={props.iconName}
          />
        </View>
        <TextInput
          {...props}
          style={{
            ...styles.input,
            width: wp("70%")
          }}
          value={inputState.value}
          onChangeText={textChangeHandler}
          onBlur={lostFocusHandler}
        ></TextInput>
      </View>
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%"
  },
  label: {
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: Colors.error,
    fontSize: 13
  }
});
