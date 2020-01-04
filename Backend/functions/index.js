const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./service_account.json')
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)
const fetch = require("node-fetch")

adminConfig.credential = admin.credential.cert(serviceAccount)
admin.initializeApp(adminConfig)
admin.firestore().settings({ timestampsInSnapshots: true })

const firestore = admin.firestore()
const auth = admin.auth()

const usersDB = firestore.collection('users')
const buyerDB = firestore.collection('buyerLists')
const sellerDB = firestore.collection('sellerItems')
const txDB = firestore.collection('transactions')

exports.createAccount = functions.https.onCall((data, context) => {
  let name = data.name
  let surname = data.surname
  let addr = data.addr.readable
  let notificationToken = data.notificationToken || false
  return auth.createUser({
    uid: data.username,
    email: data.email,
    phoneNumber: data.phoneNo,
    password: data.password
  }).then(userRecord => {
    usersDB.doc(userRecord.uid).set({
      name,
      surname,
      addr,
      addr_geopoint: new admin.firestore.GeoPoint(data.addr.latitude, data.addr.longitude),
      enableSearch: false,
      notificationToken
    }).catch(err => {
      return {err}
    })
  }).then(() => {
    return true
  }).catch(err => {
    return {err}
  })
})

exports.addWaste = functions.https.onCall((data, context) => {
  if (context.auth != null){
    let items = []
    data.items.forEach(item => { items.push({wasteType: item.wasteType, amount: Number(item.amount)}) })
    return sellerDB.doc(context.auth.uid).set({ items }, {merge: true}).then(() => {
      return true
    }).catch(err => {
      return {err}
    })
  }
  else return {err: "The request is denied because of authetication"}
})

exports.sellWaste = functions.https.onCall((data, context) => {
  if (context.auth != null){
    let items = data.items
    let buyer = data.buyer
    let addr = data.addr
    let txType = data.txType
    if (txType == 0 || txType == 1) {
      return sellerDB.doc(context.auth.uid).get().then(doc => {
        if (doc.exists) {
          let newItems = []
          for(let i = 0; i < doc.data().items.length; i++) {
            for(let j = 0; j < items.length; j++) {
              if (items[j].wasteType == doc.data().items[i].wasteType) {
                if (items[j].amount < doc.data().items[i].amount)
                  newItems.push({wasteType: items[j].wasteType, amount: doc.data().items[i].amount - items[j].amount})
                else if (items[j].amount == doc.data().items[i].amount) continue
                else return {err: "Item's amount doesn't match"}
              }
            }
          }
          return sellerDB.doc(context.auth.uid).set({items: newItems}, {merge: true}).then(() => {
            return txDB.add({
              txType,
              buyer,
              seller: context.auth.uid,
              items,
              addr,
              createTimestamp: new Date(),
              assignedTime: new Date(data.assignedTime) || "TBA",
              txStatus: 0
            }).then(() => {
              return true
            }).catch(err => {
              return {err}
            })
          }).catch(err => {
            return {err}
          })
        }
        else return {err: "The document doesn't exist"}
      }).catch(err => {
        return {err}
      })
    }
    else return {err: "Transaction type is incorrect"}
  }
  else return {err: "The request is denied because of authetication"}
})

exports.toggleSearch = functions.https.onCall((data, context) => {
  if (context.auth != null) {
    return usersDB.doc(context.auth.uid).update({enableSearch: data.toggleSearch}).then(() => {
      return true
    }).catch(err => {
      return {err}
    })
  }
  else return {err: "The request is denied because of authetication"}
})

exports.changeTxStatus = functions.https.onCall((data, context) => {
  if (context.auth != null){
    return txDB.doc(data.txID).get().then(doc => {
      if (doc.data().txStatus < data.status && doc.data().txStatus != 4) {
        if (doc.data().txType == 0) {
          if (data.status != 4 && data.status != 5) {
            return txDB.doc(data.txID).update({
              txStatus: data.status
            }).then(() => {
              return true
            }).catch(err => {
              return {err}
            })
          }
          else {
            return txDB.doc(data.txID).update({
              txStatus: data.status,
              completedTime: new Date()
            }).then(() => {
              return true
            }).catch(err => {
              return {err}
            })
          }
        }
        else if (doc.data().txType == 1) {
          if (doc.data().txStatus == 0) {
            return txDB.doc(data.txID).set({
              txStatus: data.status,
              buyer: context.auth.uid,
              items: data.items
            }, { merge: true }).then(() => {
              return true
            }).catch(err => {
              return {err}
            })
          }
          else if (doc.data().txStatus == 4 || doc.data().txStatus == 5) {
            return txDB.doc(data.txID).set({
              txStatus: data.status,
              completedTime: new Date()
            }, { merge: true }).then(() => {
              return true
            }).catch(err => {
              return {err}
            })
          }
        }
        else return {err: "The transaction format is incorrect"}
      }
      else return {err: "The transaction is already completed"}
    })
  }
  else return {err: "The request is denied because of authetication"}
})

exports.editBuyerInfo = functions.https.onCall((data, context) => {
  if (context.auth.uid != null) {
    let purchaseList = data.purchaseList
    let description = data.desc
    return buyerDB.doc(context.auth.id).update({
      purchaseList,
      description
    }).then(() => {
      return true
    }).catch(err => {
      return {err}
    })
  }
  else return {err: "The request is denied because of authetication"}
})

exports.editUserInfo = functions.https.onCall((data, context) => {
  if (context.auth.uid != null) {
    let name = data.name
    let surname = data.surname
    let addr = data.addr.readable
    return userDB.doc(context.auth.id).update({
      name,
      surname,
      addr,
      addr_geopoint: new admin.firestore.GeoPoint(data.addr.latitude, data.addr.longitude)
    }).then(() => {
      return true
    }).catch(err => {
      return {err}
    })
  }
  else return {err: "The request is denied because of authetication"}
})

exports.updateNotificationToken = functions.https.onCall((data,context) => {
  if (context.auth.uid != null) {
    return usersDB
    .doc(context.auth.uid)
    .update({notificationToken: data.notificationToken})
    .then(() => {
      return true
    }).catch(err => {
      return {err}
    })
  }
  else return {err: "The request is denied because of authetication"}
})

exports.sendNotification = functions.https.onCall((data,context) => {
  let reponse = fetch("https://exp.host/--/api/v2/push/send", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: data.token,
      priority: "normal",
      sound: "default",
      title: data.title,
      body: data.body
    })
  })
  return {reponse}
})

// exports.quickSelling = functions.https.onCall((data, context) => {
//   if (context.auth.uid != null) {

//   }
//   else return {err: "The request is denied because of authetication"}
// })
