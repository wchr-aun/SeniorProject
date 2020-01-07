import React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ThaiText from "./ThaiText";

export default UserInfoCard = props => {
  return (
    <View style={{ ...styles.userInfoContainer, ...props.style }}>
      <View style={styles.userInfoContentContainer}>
        {/* Row 1 */}
        <View style={styles.userInfoContentContainerRow1}>
          <View style={{ ...styles.imgContainer }}>
            <Image
              source={{
                uri: props.imgUrl
              }}
              style={styles.userImg}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              width: "60%",
              paddingLeft: 20
            }}
          >
            <ThaiText style={styles.userName}>{props.userName}</ThaiText>
            <Text>{props.address}</Text>
          </View>
          <View style={{ width: "10%" }}>
            <TouchableOpacity onPress={props.onSignout}>
              <Ionicons name="ios-settings" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Line Separate */}
        <View style={styles.lineSeparate} />
        {/* Row 2 */}
        <View style={styles.userInfoContentContainerRow2}>
          <ThaiText style={{ fontSize: 14 }}>การรับซื้อขยะรอบต่อไป</ThaiText>
          <ThaiText style={{ fontSize: 20 }}>{props.meetTime}</ThaiText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: Colors.on_primary,
    alignSelf: "center"
  },
  userInfoContentContainer: {
    flex: 1,
    margin: 10,
    height: "100%"
  },
  imgContainer: {
    width: "30%",
    height: "100%"
  },
  userInfoContentContainerRow1: {
    height: "50%",
    width: "100%",
    flexDirection: "row"
  },
  userInfoContentContainerRow2: {
    height: "40%",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16
  },
  userImg: {
    // If don't specify this, img size can't resize and organize
    width: "100%",
    height: "100%",
    paddingTop: 0
  },
  userName: {
    fontSize: 18
  },
  lineSeparate: {
    borderBottomColor: Colors.lineSeparate,
    borderBottomWidth: 1,
    marginVertical: 5
  }
});
