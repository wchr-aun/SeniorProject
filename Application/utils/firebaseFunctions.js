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
    .catch(err => {
      throw new Error(err);
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
      } else throw new Error("The document doesn't exist")
    })
    .catch(err => {
      throw new Error(err);
    });
};

// Get firebase UserProfile
const getWasteTypeDetail = async wasteTypeId => {
  return firestore
    .collection("wasteType")
    .doc(wasteTypeId)
    .get()
    .then(function(doc) {
      if (doc.exists) return doc.data()
      else throw new Error("The document doesn't exist")
    })
    .catch(err => {
      throw new Error(err);
    });
};

const getSellerListAndWasteType = async () => {
  return getSellerItems().then(itemsReturned => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < itemsReturned.length; i++) {
        getWasteTypeDetail(itemsReturned[i].wasteType).then(wasteTypeDetail => {
          itemsReturned[i].wasteDisposal = wasteTypeDetail.disposal;
          itemsReturned[i].wasteDescription = wasteTypeDetail.description;
          if (i === itemsReturned.length - 1) resolve();
        });
      }
    }).then(() => {
      return itemsReturned;
    }).catch(err => {
      throw new Error(err);
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
    .catch(err => {
      throw new error(err);
    });
};

const getFavBuyers = async () => {
  return firestore
    .collection("users")
    .doc(firebaseUtil.auth().currentUser.uid)
    .then(doc => {
      if (doc.data().favBuyers != null) return doc.data().favBuyers
      else return false
    }).then(favBuyers => {
      let buyersInfo = []
      favBuyers.forEach(async buyer => {
        await firestore.collection("buyerList").doc(buyer).get().then(doc => {
          if (doc.exists) buyersInfo.push(doc.data())
          else throw new Error("The document doesn't exist")
        })
      })
      return buyersInfo
    }).catch(err => {
      throw new error(err)
    })
}

const searchBuyers = async (condition, orderBy) => {
  return firestore
    .collection("buyerList")
    .orderBy(condition || "purchaseList", orderBy)
    .get()
    .then(querySnapshot => {
      let buyers = [];
      querySnapshot.forEach(doc => {
        buyers.push(doc.data())
      })
      return buyers
    }).catch(function(error) {
      throw new error(error)
    });
};

const addWaste = async items => {
  return functions
    .httpsCallable("addWaste")(items)
    .then(result => {
      if (result.data.err == null) return true
      else throw new Error(result.data.err)
    })
};

const sellWaste = async transaction => {
  return functions
    .httpsCallable("sellWaste")(transaction)
    .then(function(result) {
      // Read result of the Cloud Function.
      if (result.data.err == null) return true
      else throw new Error(result.data.err)
    })
};

const toggleSwitches = async (toggleSearch) => {
  console.log("hello")
  return functions
    .httpsCallable("toggleSearch")({toggleSearch})
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
            throw new Error(err);
          });
      } else throw new Error(result.data.err);
    })
    .catch(err => {
      throw new Error(err);
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
  createAccount,
  getFavBuyers
};
