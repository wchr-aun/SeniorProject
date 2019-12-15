import React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ThaiText from "./ThaiText";
import formatDate from "../utils/dateFormat";

export default SellTransactionCard = props => {
  // Set-up the touchable view
  let TouchableComponent = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <TouchableComponent onPress={props.onPress}>
      <View style={{ ...styles.container, ...props.style }}>
        <View style={{ ...styles.imgContainer }}>
          <Image
            source={{
              uri: props.imgUrl
            }}
            style={styles.userImg}
            resizeMode="center"
          />
        </View>
        <View style={styles.infoContainer}>
          {/* Row 1 */}
          <View style={{ ...styles.BuyerName, fontSize: 18 }}>
            <ThaiText>{props.userName}</ThaiText>
          </View>
          {/* Line Separate */}
          <View style={styles.lineSeparate} />
          {/* Row 2 */}
          <View style={styles.description}>
            <View style={styles.amountOfType}>
              <Ionicons name="md-trash" size={24} color={Colors.primary} />
              <ThaiText style={{ fontSize: 14 }}>
                {props.amountOfType} ประเภท
              </ThaiText>
            </View>
            <View>
              <ThaiText style={{ fontSize: 14 }}>
                {formatDate(props.meetTime)}
              </ThaiText>
            </View>
          </View>
        </View>
      </View>
    </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    flexDirection: "row"
  },
  imgContainer: {
    width: "20%",
    height: "80%",
    padding: 5
    // borderRadius: 500,
    // overflow: "hidden",
    // backgroundColor: "red"
  },
  userImg: {
    width: "100%",
    height: "100%"
  },
  infoContainer: {
    width: "80%",
    padding: 10
  },
  description: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  amountOfType: {
    flexDirection: "row",
    alignItems: "center"
  },
  lineSeparate: {
    borderBottomColor: Colors.lineSeparate,
    borderBottomWidth: 1,
    marginVertical: 2
  }
});
