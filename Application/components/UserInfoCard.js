import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ThaiRegText from "./ThaiRegText";
import ImageCircle from "./UI/ImageCircle";

export default UserInfoCard = props => {
  return (
    <View style={{ ...styles.userInfoContainer, ...props.style }}>
      <View style={styles.userInfoContentContainer}>
        {/* Row 1 */}
        <View style={styles.userInfoContentContainerRow1}>
          {/* <View style={{ ...styles.imgContainer }}>
            <Image
              source={{
                uri: props.imgUrl
              }}
              style={styles.userImg}
              resizeMode="contain"
            />
          </View> */}
          <ImageCircle
            imgUrl={props.imgUrl}
            avariableWidth={props.avariableWidth * 0.3}
          />
          <View
            style={{
              width: props.avariableWidth * 0.6,
              paddingLeft: 20
            }}
          >
            <ThaiRegText
              style={{
                ...styles.userName,
                color: Colors.on_primary_dark.high_constrast
              }}
            >
              {props.userName}
            </ThaiRegText>
            <ThaiRegText>{props.address}</ThaiRegText>
          </View>
          <View style={{ width: "10%" }}>
            <TouchableOpacity onPress={props.onSignout}>
              <Ionicons
                name="ios-settings"
                size={30}
                color={Colors.primary_dark}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Line Separate */}
        <View style={styles.lineSeparate} />
        {/* Row 2 */}
        <View style={styles.userInfoContentContainerRow2}>
          <ThaiRegText
            style={{
              fontSize: 14,
              color: Colors.on_primary_dark.low_constrast
            }}
          >
            การรับซื้อขยะรอบต่อไป
          </ThaiRegText>
          <ThaiRegText
            style={{
              fontSize: 20,
              color: Colors.on_primary_dark.high_constrast
            }}
          >
            {props.meetTime}
          </ThaiRegText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: Colors.primary_dark,
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
    borderBottomColor: Colors.soft_primary_dark,
    borderBottomWidth: 1,
    marginVertical: 5
  }
});
