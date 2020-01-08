import firebaseUtil from "../firebase";
import { Notifications } from "expo";

const firestore = firebaseUtil.firestore();
const functions = firebaseUtil.functions();
const auth = firebaseUtil.auth();

// Get firebase document (trashOfUser)
export const getSellerItems = async () => {
  return firestore
    .collection("sellerItems")
    .doc(auth.currentUser.uid)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        return doc.data().items;
      } else return [];
    })
    .catch(err => {
      throw new Error(err.message);
    });
};

// Get firebase UserProfile
export const getUsers = async () => {
  console.log("getUser(): ", auth.currentUser.uid);
  return firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        return {
          uid: auth.currentUser.uid,
          name: doc.data().name,
          surname: doc.data().surname,
          addr: {
            readable: doc.data().addr,
            latitude: doc.data().addr_geopoint.latitude,
            longitude: doc.data().addr_geopoint.longitude
          },
          enableSearch: doc.data().enableSearch,
          email: auth.currentUser.email,
          phoneNo: auth.currentUser.phoneNumber,
          photoURL:
            auth.currentUser.photoURL ||
            "https://firebasestorage.googleapis.com/v0/b/senior-project-83de1.appspot.com/o/profile_pictures%2Fdefault.png?alt=media&token=bf6d0624-ce7b-42e7-8703-a155cb6e84eb"
        };
      } else throw new Error("The document doesn't exist");
    })
    .catch(err => {
      throw new Error(err.message);
    });
};

// Get firebase firestore wasteType
export const getWasteType = async () => {
  return firestore
    .collection("wasteType")
    .get()
    .then(querySnapshot => {
      const WasteTypeList = []; // for storing Plastic, Glass
      querySnapshot.forEach(doc => {
        let subWasteTypes = doc.data(); //HDPE, PP, PS
        let data = [];
        /* Make data compatible with sectionList component */
        for (const subWasteType in subWasteTypes) {
          let properties = {};
          for (const subWasteTypeProp in subWasteTypes[subWasteType]) {
            properties = {
              ...properties,
              [subWasteTypeProp]: subWasteTypes[subWasteType][subWasteTypeProp]
            };
          }
          data.push({ value: subWasteType, ...properties });
        }

        WasteTypeList.push({ value: doc.id, data });
      });
      return WasteTypeList;
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
      throw new Error(err.message);
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
        .where(role, "==", auth.currentUser.uid)
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
          throw new error(err.message);
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
    .doc(auth.currentUser.uid)
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
      throw new error(err.message);
    });
};

export const addWaste = async items => {
  return functions
    .httpsCallable("addWaste")(items)
    .then(result => {
      if (result.data.errorMessage == null) return true;
      else throw new Error(result.data.errorMessage);
    });
};

export const sellWaste = async transaction => {
  return functions
    .httpsCallable("sellWaste")(transaction)
    .then(function(result) {
      // Read result of the Cloud Function.
      if (result.data.errorMessage == null) return true;
      else throw new Error(result.data.errorMessage);
    });
};

export const toggleSearch = async toggleSearch => {
  console.log("hello toggle");
  return functions
    .httpsCallable("toggleSearch")({ toggleSearch })
    .then(result => {
      if (result.data.errorMessage == null) {
        console.log(result.data);
        return true;
      } else throw new Error(result.data.errorMessage);
    });
};

export const createAccount = async user => {
  return functions
    .httpsCallable("createAccount")(user)
    .then(result => {
      if (result.data.errorMessage == null) {
        return firebaseUtil
          .auth()
          .signInWithEmailAndPassword(user.email, user.password)
          .catch(err => {
            throw new Error(err);
          });
      } else throw new Error(result.data.errorMessage);
    })
    .catch(err => {
      throw new Error(err.message);
    });
};

/* 
updatedTx = {
  txID: "transaction identity",

  ----only for quick selling----
  items: {
    wasteType: "waste type",
    price: value
  }
  ----only for quick selling----

  status: number from 0 to 5 as we have discussed
} */

export const updateTxStatus = async updatedTx => {
  return functions
    .httpsCallable("changeTxStatus")(updatedTx)
    .then(result => {
      if (result.data.errorMessage == null) return true;
      else throw new Error(result.data.errorMessage);
    })
    .catch(err => {
      throw new Error(err.message);
    });
};

/* 
newInfo = {
  name: "asdfasdfasdfasdfasdf",
  surname: "asdfasdfasdfasdf",
  addr: {
    "latitude": number,
    "longitude": number,
    "readable": "E",
  },
  photoURL: "https://url.url.url.com",
  phoneNo: "+666666666666"
} */

export const editUserInfo = async newInfo => {
  return functions
    .httpsCallable("editUserInfo")(newInfo)
    .then(result => {
      if (result.data.errorMessage == null) return true;
      // else throw new Error(result.data.errorMessage);
      else {
        console.log("----1 -----result.data.errorMessage in editUserInfo");
        console.log(result.data.errorMessage);
        throw new Error(result.data.errorMessage);
      }
    })
    .catch(err => {
      console.log("----2 -----result.data.errorMessage in editUserInfo");
      console.log(err.message);
      throw new Error(err.message);
    });
};

export const updateNotificationToken = async () => {
  let notificationToken = await Notifications.getExpoPushTokenAsync();
  return functions
    .httpsCallable("updateNotificationToken")({ notificationToken })
    .then(result => {
      if (result.data.errorMessage == null) return true;
      else throw new Error(result.data.errorMessage);
    })
    .catch(err => {
      throw new Error(err.message);
    });
};

export const removeNotificationToken = async () => {
  let notificationToken = await Notifications.getExpoPushTokenAsync();
  return functions
    .httpsCallable("removeNotificationToken")({ notificationToken })
    .then(result => {
      if (result.data.errorMessage == null) return true;
      else throw new Error(result.data.errorMessage);
    })
    .catch(err => {
      throw new Error(err.message);
    });
};

/* 
buyerInfo = {
  purchaseList: {
    PP(waste type): 159(price),
    HDPE(waste type): 999(price)
  },
  desc: "description",
  addr: {
    "latitude": number,
    "longitude": number,
    "readable": "E",
  }
} */

export const editBuyerInfo = async buyerInfo => {
  return functions
    .httpsCallable("editBuyerInfo")(buyerInfo)
    .then(result => {
      if (result.data.errorMessage == null) return true;
      // else throw new Error(result.data.errorMessage);
      else {
        console.log(result.data.errorMessage);
        throw new Error(result.data.errorMessage);
      }
    })
    .catch(err => {
      console.log(err.message);
      throw new Error(err.message);
    });
};

/*
queryData = {
  distance: 99,
  wasteType: {
    "PP": 159
  },
  addr_geopoint: {
    "latitude": 13.6487182,
    "longitude": 100.5007269
  }
}*/

export const queryBuyers = async queryData => {
  return functions
    .httpsCallable("queryBuyers")(queryData)
    .then(result => {
      if (result.data.errorMessage == null) return result.data;
      else {
        console.log(result.data.errorMessage);
        throw new Error(result.data.errorMessage);
      }
    })
    .catch(err => {
      console.log(err.message);
      throw new Error(err.message);
    });
}
