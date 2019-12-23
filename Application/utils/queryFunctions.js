import firebaseUtil from "../firebase";

// Get firebase document (trashOfUser)
const getSellerItems = async () => {
  let user = firebaseUtil.auth().currentUser; // get uid
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
const getUsers = async () => {
  let user = firebaseUtil.auth().currentUser; // get uid
  let uid = user.uid;

  let docRef = firebaseUtil
    .firestore()
    .collection("users")
    .doc(uid);

  return docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
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

// Get firebase UserProfile
const getWasteTypeDetail = async wasteTypeId => {
  let docRef = firebaseUtil
    .firestore()
    .collection("wasteType")
    .doc(wasteTypeId);

  return docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        return {
          description: doc.data().description,
          disposal: doc.data().disposal
        };
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
  getSellerList: getSellerItems,
  getUserProfile: getUsers,
  getWasteTypeDetail
};
