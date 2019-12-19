import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Button,
  TextInput
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";

import Colors from "../../constants/Colors";

export default EditTrashForSellerScreen = props => {
  const [type, setType] = useState(null);
  const [amount, setAmount] = useState(0);

  const addTrashHandler = () => {};

  return (
    <View style={styles.screen}>
      <Text>Test Adding Screen</Text>
      <View style={{ width: "50%", height: "30%" }}>
        <Dropdown
          label="ประเภทของขยะ"
          data={[{ value: "PETE" }, { value: "HDPE" }, { value: "PP" }]}
          onChangeText={thisValue => {
            console.log(thisValue);
            setType(thisValue);
          }}
        />
      </View>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={thisValue => {
            console.log(thisValue);
            setAmount(thisValue);
          }}
          onBlur={lostFocusHandler}
        ></TextInput>
      </View>
      <View>
        <Button
          title={"Add it"}
          color={Colors.primary}
          onPress={addTrashHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Dimensions.get("window").height * 0.05,
    backgroundColor: Colors.screen,
    alignItems: "center"
  },
  allTrashContainer: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.7,
    padding: 10,
    alignItems: "center",
    backgroundColor: Colors.on_primary
  },
  eachTrashCard: {
    marginBottom: 5
  }
});
