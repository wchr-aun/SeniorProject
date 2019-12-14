import React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Platform,
  Dimensions
} from "react-native";
import Colors from "../../constants/Colors";
import ThaiText from "../../components/ThaiText";

export default UserHomepageScreen = props => {
  return (
    <View style={styles.screen}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoContentContainer}>
          {/* Row 1 */}
          <View style={styles.userInfoContentContainerRow1}>
            <View style={{ ...styles.imgContainer, backgroundColor: "yellow" }}>
              <Image
                source={require("../../assets/img/user.png")}
                style={styles.userImg}
                resizeMode="center"
              />
            </View>
            <View
              style={{
                width: "70%",
                backgroundColor: "green",
                paddingLeft: 20
              }}
            >
              <ThaiText style={styles.userName}>นราวิชญ์ ทับทิมโต</ThaiText>
              <Text>226/17</Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />
          {/* Row 2 */}
          <View style={styles.userInfoContentContainerRow2}>
            <ThaiText style={{ fontSize: 14 }}>การรับซื้อขยะรอบต่อไป</ThaiText>
            <ThaiText style={{ fontSize: 20 }}>18 มกรา 15.00 น.</ThaiText>
          </View>
        </View>
      </View>
      <Text>UserHomepageScreen</Text>
    </View>
  );
};

// UserHomepageScreen.navigationOptions = navData => {
//   return null;
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    marginTop: 20,
    backgroundColor: Colors.screen
  },
  userInfoContainer: {
    backgroundColor: Colors.on_primary,
    borderRadius: 10,
    margin: 10,
    marginTop: Dimensions.get("window").height * 0.025,
    width: Dimensions.get("window").width * 0.9,
    height: 200,
    alignSelf: "center"
  },
  userInfoContentContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: "red",
    height: "100%"
  },
  imgContainer: {
    width: "30%"
    // height: "100%"
  },
  userInfoContentContainerRow1: {
    height: "50%",
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#f67280"
  },
  userInfoContentContainerRow2: {
    height: "50%",
    width: "100%",
    flexDirection: "column",
    backgroundColor: "#f67280",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
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
  }
});
