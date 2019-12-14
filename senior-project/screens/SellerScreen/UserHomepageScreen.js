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
          <View style={styles.imgContainer}>
            <Image
              source={require("../../assets/img/user.png")}
              style={styles.userImg}
              resizeMode="center"
            />
          </View>
          <View>
            <ThaiText>นราวิชญ์ ทับทิมโต</ThaiText>
            <Text>226/17</Text>
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
    backgroundColor: "red"
    // width: "100%",
    // height: "100%"
  },
  imgContainer: {
    width: "20%",
    height: "20%"
  },
  userImg: {
    // If don't specify this, img size can't resize and organize
    width: "100%",
    height: "100%"
  }
});
