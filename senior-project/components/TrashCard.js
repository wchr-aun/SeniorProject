import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import ThaiTitleText from "./ThaiTitleText";
import ThaiText from "./ThaiText";
import Colors from "../constants/Colors";

export default TrashCard = props => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <View style={{ ...styles.trashCard, ...props.style }}>
      <View style={styles.imgContainer}>
        <Image
          source={{
            uri: props.imgUrl
          }}
          style={styles.trashImg}
          resizeMode="center"
        />
      </View>
      <View style={styles.descriptionContainer}>
        <View style={{ ...styles.descriptionRowOne, flexWrap: "wrap" }}>
          <ThaiTitleText style={styles.trashName}>
            {props.trashName}
          </ThaiTitleText>
        </View>
        <View style={styles.descriptionRowOne}>
          <ThaiTitleText style={styles.trashAdjustPrice}>
            {props.trashAdjustPrice} บ./กก.
          </ThaiTitleText>
        </View>
        <View style={styles.descriptionRowTwo}>
          <ThaiText style={styles.amountOfTrash}>
            จำนวน {props.amountOfTrash} ชิ้น
          </ThaiText>
          <TouchableWithoutFeedback
            onPress={() => setIsSelected(previousState => !previousState)}
          >
            <MaterialIcons
              name={isSelected ? "check-box" : "check-box-outline-blank"}
              size={20}
              color={Colors.primary}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trashCard: {
    width: "100%",
    height: "20%",
    flexDirection: "row",
    borderColor: "yellow",
    borderWidth: 1
  },
  trashImg: {
    width: "100%",
    height: "100%"
  },
  imgContainer: {
    height: "100%",
    width: "30%",
    borderColor: "black",
    borderWidth: 1
  },
  descriptionContainer: {
    height: "100%",
    width: "70%",
    borderColor: "black",
    borderWidth: 1
  },
  descriptionRowOne: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: 5,
    height: "30%",
    borderColor: "red",
    borderWidth: 1
  },
  descriptionRowTwo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    height: "40%",
    borderColor: "green",
    borderWidth: 1
  },
  trashName: {
    fontSize: 16
  },
  trashAdjustPrice: {
    fontSize: 12
  },
  amountOfTrash: {
    fontSize: 14
  }
});
