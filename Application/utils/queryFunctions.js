import firebaseUtil from "../firebase"

// Get firebase document (trashOfUser)
const getSellerList = async () => {
  return firebaseUtil
  .firestore()
  .collection("sellerItems")
  .doc(firebaseUtil.auth().currentUser.uid)
  .get()
  .then(doc => {
    if (doc.exists) return doc.data().items
    else throw new error("No such document!") // doc.data() will be undefined in this case
  })
  .catch(function(error) {
    throw new error("Error getting document:", error)
  })
}

// Get firebase UserProfile
const getUserProfile = async () => {
  return firebaseUtil
  .firestore()
  .collection("users")
  .doc(firebaseUtil.auth().currentUser.uid)
  .get()
  .then(doc => {
    if (doc.exists) {
      let userProfile = {
        name: doc.data().name + " " + doc.data().surname,
        addr: doc.data().addr
      }
      return userProfile
    } else throw new error("No such document!") // doc.data() will be undefined in this case
  })
  .catch(function(error) {
    throw new error("Error getting document:", error)
  })
}

const getTransactions = async (role, status) => {
  return firebaseUtil
  .firestore()
  .collection("transactions")
  .where(role, "==", firebaseUtil.auth().currentUser.uid)
  .where("txStatus", "==", status)
  .orderBy("createTimestamp", "desc")
  .get()
  .then(querySnapshot => {
    let tx = []
    querySnapshot.forEach(function(doc) {
      tx.push(doc.data())
    })
    return tx
  })
  .catch(function(error) {
    throw new error("Error getting document:", error)
  })
}

const searchBuyers = async () => {
  
}

export default {
  getSellerList,
  getUserProfile,
  getTransactions,
  searchBuyers
}
