import firebaseUtil from "../firebase";

const firestore = firebaseUtil.firestore();
const functions = firebaseUtil.functions();

// Get firebase document (trashOfUser)
const getSellerItems = async () => {
  return firestore
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
  return firestore
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
  return firestore
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
    return new Promise((resolve, reject) => {
      if (itemsReturned.length > 0) {
        // there are items
        itemsReturned.forEach((item, index) => {
          getWasteTypeDetail(item.wasteType).then(wasteTypeDetail => {
            itemsReturned[index].wasteDisposal = wasteTypeDetail.disposal;
            itemsReturned[index].wasteDescription = wasteTypeDetail.description;
            if (index === itemsReturned.length - 1) {
              resolve();
            }
          });
        });
      } else resolve(); // no items
    }).then(() => {
      return itemsReturned;
    });
  });
};

const getTransactions = async (role, status) => {
  return firestore
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

const searchBuyers = async wasteType => {
  return firestore
    .collection("buyerList")
    .orderBy("purchaseList." + wasteType, "desc")
    .then(querySnapshot => {
      let buyers = [];
      querySnapshot.forEach(doc => {
        buyers.push(doc.data());
      });
      return buyers;
    })
    .catch(function(error) {
      throw new error("Error getting document:", error);
    });
};

const addWaste = async items => {
  return functions
    .httpsCallable("addWaste")(items)
    .then(result => {
      if (result.data.err == null) return true;
      else return result;
    });
};

const sellWaste = async transaction => {
  return functions
    .httpsCallable("sellWaste")(transaction)
    .then(function(result) {
      // Read result of the Cloud Function.
      if (result.data.err == null) return true;
      else return result;
    });
};

const toggleSwitches = async toggleSearch => {
  return functions
    .httpsCallable("toggleSearch")({ toggleSearch })
    .then(result => {
      if (result.data.err == null) {
        console.log(result.data);
        return true;
      } else throw new Error(result.data.err);
    });
};

const createAccount = async user => {
  return functions
    .httpsCallable("createAccount")(user)
    .then(result => {
      if (result.data.err == null) {
        return firebaseUtil
          .auth()
          .signInWithEmailAndPassword(user.email, user.password)
          .catch(err => {
            throw new Error(result.data.err);
          });
      } else throw new Error(result.data.err);
    })
    .catch(err => {
      throw new Error(result.data.err);
    });
};

export default {
  getUsers,
  getSellerItems,
  getWasteTypeDetail,
  getSellerListAndWasteType,
  getTransactions,
  searchBuyers,
  addWaste,
  toggleSwitches,
  sellWaste,
  createAccount
};
