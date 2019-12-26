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
  return firebaseUtil.functions().httpsCallable("addWaste")(items)
  .then(result => {
    if (result.data.err == null) return true
    else return result
  })
};

const sellWaste = transaction => {
  return firebaseUtil.functions().httpsCallable("sellWaste")(transaction)
  .then(function(result) {
    // Read result of the Cloud Function.
    if (result.data.err == null) return true
    else return result
  })
}

const toggleSwitches = (toggleSearch, toggleAddr) => {
  console.log('hello toggle')
  return firebaseUtil.functions().httpsCallable("toggleConfig")({toggleSearch, toggleAddr})
  .then(result => {
    if (result.data.err == null) {
      console.log(result.data)
      return true
    }
    else return result
  })
}

export default {
  getUsers,
  getSellerItems,
  getWasteTypeDetail,
  getSellerListAndWasteType,
  getTransactions,
  searchBuyers,
  addTrashHandler,
  toggleSwitches,
  sellWaste
};
