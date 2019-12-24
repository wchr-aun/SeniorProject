import firebaseUtil from "../firebase";

// Get firebase document (trashOfUser)
const getSellerItems = async () => {
  return firebaseUtil
    .firestore()
    .collection("sellerItems")
    .doc(firebaseUtil.auth().currentUser.uid)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        return doc.data().items;
      } else return [];
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
    });
};

// Get firebase UserProfile
const getUsers = async () => {
  return firebaseUtil
    .firestore()
    .collection("users")
    .doc(firebaseUtil.auth().currentUser.uid)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        let userProfile = {
          uid: firebaseUtil.auth().currentUser.uid,
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
  return firebaseUtil
    .firestore()
    .collection("wasteType")
    .doc(wasteTypeId)
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

const getSellerListAndWasteType = async () => {
  return getSellerItems().then(itemsReturned => {
    new Promise((resolve, reject) => {
      itemsReturned.forEach((item, index) => {
        getWasteTypeDetail(item.wasteType).then(wasteTypeDetail => {
          itemsReturned[index].wasteDisposal = wasteTypeDetail.disposal;
          itemsReturned[index].wasteDescription = wasteTypeDetail.description;
          if (index === itemsReturned.length - 1) {
            resolve();
          }
        });
      });
    }).then(() => {
      return itemsReturned;
    });
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

const addTrashHandler = items => {
  let addWaste = firebaseUtil.functions().httpsCallable("addWaste");
  console.log(items);
  // Call firebase cloud function
  return addWaste(items)
    .then(function(result) {
      // Read result of the Cloud Function.
      console.log("From EditTrashForSeller: addWaste added");
      console.log(result);
    })
    .catch(function(error) {
      // Getting the Error details.
      console.log("From EditTrashForSeller: error code :" + error.code);
      console.log("From EditTrashForSeller: error message :" + error.message);
      console.log("From EditTrashForSeller: error details :" + error.details);
    });
};

const configAccount = () => {
  firebaseUtil
    .auth()
    .currentUser.updateProfile({
      displayName: "enable"
    })
    .then(() => {
      return true;
    })
    .catch(error => {
      throw new error("Error getting document:", error);
    });
};

export default {
  getUsers,
  getSellerItems,
  getWasteTypeDetail,
  getSellerListAndWasteType,
  getTransactions,
  searchBuyers,
  addTrashHandler,
  configAccount
};
