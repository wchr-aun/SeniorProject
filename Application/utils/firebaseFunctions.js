import firebaseUtil from "../firebase";
import { Notifications } from "expo";
import { Wastes } from "../models/AllUserTrash";
import { Alert } from "react-native";

const firestore = firebaseUtil.firestore();
const functions = firebaseUtil.functions();
const auth = firebaseUtil.auth();

// Get firebase UserProfile
export const getUsers = async () => {
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
            latitude: doc.data().addr_geopoint.geopoint.latitude,
            longitude: doc.data().addr_geopoint.geopoint.longitude,
            zipcode: doc.data().zipcode
          },
          email: auth.currentUser.email,
          phoneNo: doc.data().phoneNo
        };
      } else throw new Error("The document doesn't exist");
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
      throw new Error(err.message);
    });
};

export const getBuyerInfo = async () => {
  return firestore
    .collection("buyerLists")
    .doc(auth.currentUser.uid)
    .get()
    .then(doc => doc.data());
};

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
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
      throw new Error(err.message);
    });
};

// Get all wasteType in system for quering future.
export const getWasteType = async () => {
  return firestore
    .collection("wasteType")
    .get()
    .then(docs => {
      let wasteType = {};
      let wasteTypeDropdownFormat = []; //for dropdown value

      docs.forEach(doc => {
        wasteType = { ...wasteType, [doc.id]: doc.data() };
        let subTypes = [];
        for (let subType in doc.data()) {
          //PP, HDPE,
          subTypes.push({ value: subType });
        }
        wasteTypeDropdownFormat.push({ value: doc.id, subTypes: subTypes });
      });
      return {
        wasteTypes: { ...wasteType },
        wasteTypeDropdownFormat
      };
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
      throw new Error(err.message);
    });
};

// Get all wasteType in sectionList format
export const getSectionListFormatWasteType = async () => {
  let wasteListSectionFormat = [];
  return firestore
    .collection("wasteType")
    .get()
    .then(querySnapshot => {
      // loop type obj
      querySnapshot.forEach(doc => {
        let data = [];
        let type = "";
        type = doc.id;
        subtypesData = doc.data();
        // loop through subtype obj
        for (let subtypeData in subtypesData) {
          data.push({ [subtypeData]: { ...subtypesData[subtypeData] } });
        }
        wasteListSectionFormat.push({ type, data });
      });
      return wasteListSectionFormat;
    });
};

// Get all wasteType in system to be query in future
export const getPurchaseList = async () => {
  return firestore
    .collection("buyerLists")
    .doc(auth.currentUser.uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        return {
          ...doc.data().purchaseList
        };
      } else throw new Error("The document doesn't exist --- getPurchaseList!");
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
      throw new Error(err.message);
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
          Alert.alert(
            "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
            err.message,
            [{ text: "OK" }]
          );
          throw new error(err.message);
        })
    );
  }
  return Promise.all(promises).then(() => {
    return allTx;
  });
};

export const getTodayTxForPathOp = async () => {
  const timeNow = new Date(
    new Date() - ((new Date().getTime() + 25200000) % 86400000)
  );
  const nextDay = new Date(
    new Date() - ((new Date().getTime() + 25200000) % 86400000) + 86400000
  );
  return firestore
    .collection("transactions")
    .where("buyer", "==", auth.currentUser.uid)
    .where("txStatus", "==", 2)
    .where("chosenTime", ">=", timeNow)
    .get()
    .then(querySnapshot => {
      let tx = [];
      querySnapshot.forEach(doc => {
        if (doc.data().chosenTime.toMillis() < nextDay)
          tx.push({ txId: doc.id, detail: doc.data() });
      });
      return tx;
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
      throw new error(err.message);
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
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
      throw new error(err.message);
    });
};

export const addWaste = async items => {
  return functions
    .httpsCallable("addWaste")(items)
    .then(result => {
      if (result.data.errorMessage == null) return true;
      else throw new Error(result.data.errorMessage);
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
    });
};

export const sellWaste = async transaction => {
  return functions
    .httpsCallable("sellWaste")(transaction)
    .then(function(result) {
      // Read result of the Cloud Function.
      if (result.data.errorMessage == null) return true;
      else throw new Error(result.data.errorMessage);
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
    });
};

export const toggleSearch = async toggleSearch => {
  console.log("hello toggle");
  return functions
    .httpsCallable("toggleSearch")({ toggleSearch })
    .then(result => {
      if (result.data.errorMessage == null) {
        return true;
      } else throw new Error(result.data.errorMessage);
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
    });
};

export const createAccount = async user => {
  return functions
    .httpsCallable("createAccount")(user)
    .then(result => {
      if (result.data.errorMessage == null) {
        return true;
      } else throw new Error(result.data.errorMessage);
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
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
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
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
        Alert.alert(
          "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
          result.data.errorMessage,
          [{ text: "OK" }]
        );
      }
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
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
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
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
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
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
        Alert.alert(
          "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
          result.data.errorMessage,
          [{ text: "OK" }]
        );
      }
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
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
        Alert.alert(
          "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
          result.data.errorMessage,
          [{ text: "OK" }]
        );
      }
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
      throw new Error(err.message);
    });
};

export const querySellers = async queryData => {
  return functions
    .httpsCallable("querySellers")(queryData)
    .then(result => {
      if (result.data.errorMessage == null) return result.data;
      else {
        Alert.alert(
          "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
          result.data.errorMessage,
          [{ text: "OK" }]
        );
      }
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
      throw new Error(err.message);
    });
};

export const searchBuyer = async uid => {
  return firestore
    .collection("buyerLists")
    .doc(uid)
    .get()
    .then(doc => {
      if (doc.exists) return { txId: doc.id, detail: doc.data() };
      else return "No such users";
    })
    .catch(err => {
      Alert.alert(
        "เกิดข้อผิดพลาดในระหว่างการส่งข้อมูล & รับข้อมูล",
        err.message,
        [{ text: "OK" }]
      );
    });
};
