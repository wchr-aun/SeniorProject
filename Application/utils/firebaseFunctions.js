import firebaseUtil from "../firebase";
import { Notifications } from "expo";

const firestore = firebaseUtil.firestore();
const functions = firebaseUtil.functions();

// Get firebase document (trashOfUser)
export const getSellerItems = async () => {
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
export const getUsers = async () => {
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
      } else throw new Error("The document doesn't exist");
    })
    .catch(err => {
      throw new Error(err);
    });
};

// Get firebase firestore wasteType
export const getWasteType = async () => {
  let wasteTypes = [];
  return firestore
    .collection("wasteType")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        wasteTypes.push({ wasteTypeId: doc.id, info: doc.data() });
      });
      return wasteTypes;
    });
};

// Get firebase UserProfile
export const getWasteTypeDetail = async wasteTypeId => {
  return firestore
    .collection("wasteType")
    .doc(wasteTypeId)
    .get()
    .then(function(doc) {
      if (doc.exists) return doc.data();
      else throw new Error("The document doesn't exist");
    })
    .catch(err => {
      throw new Error(err);
    });
};

export const getSellerListAndWasteType = async () => {
  return getSellerItems().then(itemsReturned => {
    return new Promise((resolve, reject) => {
      if (itemsReturned.length > 0) {
        for (let i = 0; i < itemsReturned.length; i++) {
          getWasteTypeDetail(itemsReturned[i].wasteType).then(
            wasteTypeDetail => {
              itemsReturned[i].wasteDisposal = wasteTypeDetail.disposal;
              itemsReturned[i].wasteDescription = wasteTypeDetail.description;
              if (i === itemsReturned.length - 1) resolve();
            }
          );
        }
      } else resolve();
    })
      .then(() => {
        return itemsReturned;
      })
      .catch(err => {
        return [];
      });
  });
};

export const getTransactions = async role => {
  let allTx = [];
  let promises = [];
  for (let status = 0; status < 5; status++) {
    promises.push(
      firestore
        .collection("transactions")
        .where(role, "==", firebaseUtil.auth().currentUser.uid)
        .where("txStatus", "==", status)
        .orderBy("createTimestamp", "desc")
        .get()
        .then(querySnapshot => {
          let tx = [];
          querySnapshot.forEach(doc => {
            tx.push({ txId: doc.id, detail: doc.data() });
          });
          allTx[status] = tx;
        })
        .catch(err => {
          throw new error(err);
        })
    );
  }
  return Promise.all(promises).then(() => {
    return allTx;
  });
};

export const getFavBuyers = async () => {
  return firestore
    .collection("users")
    .doc(firebaseUtil.auth().currentUser.uid)
    .then(doc => {
      if (doc.data().favBuyers != null) return doc.data().favBuyers;
      else return [];
    })
    .then(favBuyers => {
      let buyersInfo = [];
      favBuyers.forEach(async buyer => {
        await firestore
          .collection("buyerList")
          .doc(buyer)
          .get()
          .then(doc => {
            if (doc.exists)
              buyersInfo.push({ txId: doc.id, detail: doc.data() });
            else
              buyersInfo.push({
                txId: doc.id,
                detail: "The document doesn't exist"
              });
          });
      });
      return buyersInfo;
    })
    .catch(err => {
      throw new error(err);
    });
};

export const searchBuyers = async (condition, orderBy) => {
  return firestore
    .collection("buyerList")
    .orderBy(condition || "purchaseList", orderBy)
    .get()
    .then(querySnapshot => {
      let buyers = [];
      querySnapshot.forEach(doc => {
        buyers.push({ id: doc.id, wastePriceInfo: doc.data() });
      });
      return buyers;
    })
    .catch(function(error) {
      throw new error(error);
    });
};

export const addWaste = async items => {
  return functions
    .httpsCallable("addWaste")(items)
    .then(result => {
      if (result.data.err == null) return true;
      else throw new Error(result.data.err);
    });
};

export const sellWaste = async transaction => {
  return functions
    .httpsCallable("sellWaste")(transaction)
    .then(function(result) {
      // Read result of the Cloud Function.
      if (result.data.err == null) return true;
      else throw new Error(result.data.err);
    });
};

export const toggleSwitches = async toggleSearch => {
  console.log("hello");
  return functions
    .httpsCallable("toggleSearch")({ toggleSearch })
    .then(result => {
      if (result.data.err == null) {
        console.log(result.data);
        return true;
      } else throw new Error(result.data.err);
    });
};

export const createAccount = async user => {
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
      } else throw new Error(result.data.err.errorInfo.message);
    })
    .catch(err => {
      throw new Error(err);
    });
};

export const updateTxStatus = async () => {};

export const editUserInfo = async () => {};

export const updateNotificationToken = async () => {
  let notificationToken = await Notifications.getExpoPushTokenAsync();
  return functions
    .httpsCallable("updateNotificationToken")({ notificationToken })
    .then(result => {
      if (result.data.err == null) {
        return true;
      } else throw new Error(result.data.err);
    })
    .catch(err => {
      throw new Error(err);
    });
};
