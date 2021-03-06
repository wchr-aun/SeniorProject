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
import firebaseUtil from "../../firebase";

export default EditTrashForSellerScreen = props => {
  // Get value from provious page
  const [items, setItems] = useState(props.navigation.getParam("items"));

  const [wasteType, setWasteType] = useState(null);
  const [amount, setAmount] = useState(0);

  const addTrashHandler = () => {
    // data that sent
    let newTrash = {
      items: [{ amount: Number(amount), wasteType: wasteType }]
    };

    let addWaste = firebaseUtil.functions().httpsCallable("addWaste");
    // Call firebase cloud functio
    return addWaste(newTrash).catch(function(error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.log("From EditTrashForSeller: error code :" + code);
      console.log("From EditTrashForSeller: error message :" + message);
      console.log("From EditTrashForSeller: error details :" + details);
    });
  };

  return (
    <View style={styles.screen}>
      <Text>Test Adding Screen</Text>
      <View style={{ width: "50%", height: "10%" }}>
        <Dropdown
          label="ประเภทของขยะ"
          data={[
            { value: "wasteType/PETE" },
            { value: "wasteType/HDPE" },
            { value: "wasteType/PP" }
          ]}
          onChangeText={thisValue => {
            setWasteType(thisValue);
          }}
        />
      </View>
      <View style={styles.input}>
        <TextInput
          onChangeText={thisValue => {
            setAmount(thisValue);
          }}
        ></TextInput>
      </View>
      <View>
        <Button
          title={"Add it"}
          color={Colors.primary_dark}
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
  },
  input: {
    backgroundColor: Colors.on_primary,
    width: "80%",
    height: "20%"
  }
});
