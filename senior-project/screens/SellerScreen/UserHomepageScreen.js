import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  ActivityIndicator
} from "react-native";
import Colors from "../../constants/Colors";

import UserInfoCard from "../../components/UserInfoCard";
import ThaiTitleText from "../../components/ThaiTitleText";
import SellTransactionCard from "../../components/SellTransactionCard";
import { SELLINGTRANSACTION } from "../../data/dummy-data";

import firebaseUtil from "../../firebase";

export default UserHomepageScreen = props => {
  // // User profile
  const [userName, setUserName] = useState("");
  const [userAddr, setUserAddr] = useState("");
  const [userImgUrl, setUserImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // For look into selling transaction detail
  const selectedHandler = transactionItem => {
    props.navigation.navigate({
      routeName: "SellingTransactionDetailScreen",
      params: {
        transactionItem: transactionItem
      }
    });
  };

  //Get user data
  const getUserProfile = async () => {
    let user = await firebaseUtil.auth().currentUser; // get uid
    let uid = user.uid;

    let docRef = firebaseUtil
      .firestore()
      .collection("users")
      .doc(uid);

    await docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          console.log(doc.data());
          setUserName(doc.data().name + " " + doc.data().surname);
          setUserAddr(doc.data().addr);
          setIsLoading(false);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  };

  useEffect(() => {
    getUserProfile(); // Getting
  }, []);

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <View
          style={{
            ...styles.userInfoCardLoading,
            alignSelf: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      ) : (
        <UserInfoCard
          style={styles.userInfoCard}
          imgUrl={
            userImgUrl
              ? userImgUrl
              : "https://www.clipartkey.com/mpngs/m/107-1076987_user-staff-man-profile-person-icon-circle-png.png"
          }
          userName={userName}
          meetTime={"18 มกรา 15.00 น."}
          address={userAddr}
        />
      )}
      <View style={styles.recentSellTransactionContainer}>
        <View>
          <ThaiTitleText style={{ color: Colors.on_primary }}>
            การรับซื้อขยะล่าสุด
          </ThaiTitleText>
        </View>
        {isLoading ? (
          <View
            style={{
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator size="large" color={Colors.on_primary} />
          </View>
        ) : (
          <FlatList
            data={SELLINGTRANSACTION}
            keyExtractor={item => item.transactionId}
            renderItem={itemData => (
              <SellTransactionCard
                amountOfType={itemData.item.amountOfType}
                imgUrl={itemData.item.imgUrl}
                userName={itemData.item.buyerName}
                meetTime={itemData.item.meetTime}
                style={styles.sellTransactionCard}
                onPress={() => {
                  selectedHandler(itemData.item);
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Dimensions.get("window").height * 0.05,
    backgroundColor: Colors.screen
  },
  userInfoCard: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.3
  },
  userInfoCardLoading: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.3,
    backgroundColor: Colors.on_primary,
    borderRadius: 10,
    alignSelf: "center"
  },
  recentSellTransactionContainer: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.5,
    marginTop: 10,
    paddingVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Colors.primary_variant
  },
  sellTransactionCard: {
    backgroundColor: Colors.on_primary,
    width: "95%",
    height: 100,
    // height: "50%",
    alignSelf: "center",
    marginVertical: 5
  }
});
