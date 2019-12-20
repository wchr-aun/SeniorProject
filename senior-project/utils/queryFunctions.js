import firebaseUtil from "../firebase";

// Get firebase document (trashOfUser)
const getSellerList = async () => {
  let user = await firebaseUtil.auth().currentUser; // get uid
  let uid = user.uid;

  let docRef = firebaseUtil
    .firestore()
    .collection("sellerItems")
    .doc(uid);

  return docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        // console.log(doc.data().items[0].amount);
        // console.log(doc.data().items[0].wasteType.id);
        return doc.data().items;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return;
      }
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
    });
};

// Get firebase UserProfile
const getUserProfile = async () => {
  let user = await firebaseUtil.auth().currentUser; // get uid
  let uid = user.uid;

  let docRef = firebaseUtil
    .firestore()
    .collection("users")
    .doc(uid);

  return docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        console.log(doc.data());
        let userProfile = {
          name: doc.data().name + " " + doc.data().surname,
          addr: doc.data().addr
        };
        return userProfile;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return;
      }
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
    });
};

export default {
  getSellerList,
  getUserProfile
};
