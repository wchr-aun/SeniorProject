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
        return doc.data().items;
      } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!");
        return [];
      }
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
    });
};

// Get firebase UserProfile
const getUsers = async () => {
  let uid = firebaseUtil.auth().currentUser.uid; // get uid

  let docRef = firebaseUtil
    .firestore()
    .collection("users")
    .doc(uid);

  return docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        let userProfile = {
          uid: uid,
          name: doc.data().name,
          surname: doc.data().surname,
          addr: doc.data().addr,
          enableAddr: doc.data().enableAddr,
          enableSearch: doc.data().enableSearch
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

const getTransactions = async (role, status) => {
  return firebaseUtil
    .firestore()
    .collection("transactions")
    .where(role, "==", firebaseUtil.auth().currentUser.uid)
    .where("txStatus", "==", status)
    .orderBy("createTimestamp", "desc")
    .get()
    .then(querySnapshot => {
      let tx = [];
      querySnapshot.forEach(function(doc) {
        tx.push(doc.data());
      });
      return tx;
    })
    .catch(function(error) {
      throw new error("Error getting document:", error);
    });
};

const searchBuyers = async () => {};

export default {
  getSellerList: getSellerItems,
  getUserProfile: getUsers,
  getWasteTypeDetail,
  getTransactions,
  searchBuyers
};
