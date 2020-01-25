const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./service_account.json')
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)
const fetch = require("node-fetch")
const geofirex = require('geofirex');

adminConfig.credential = admin.credential.cert(serviceAccount)
admin.initializeApp(adminConfig)
admin.firestore().settings({ timestampsInSnapshots: true })

const firestore = admin.firestore()
const auth = admin.auth()

const usersDB = firestore.collection('users')
const buyerDB = firestore.collection('buyerLists')
const sellerDB = firestore.collection('sellerItems')
const txDB = firestore.collection('transactions')

const geo = geofirex.init(admin)
const geoBuyers = geo.query(buyerDB)
const geoSellers = geo.query(txDB.where("txStatus", "==", 0).where("txType", "==", 1))

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
      addr_geopoint: geo.point(data.addr.latitude, data.addr.longitude),
      notificationToken: admin.firestore.FieldValue.arrayUnion(notificationToken)
    }).catch(err => {
      console.log("Error has occurred in createAccount() while adding the account " + userRecord.uid + " to firestore")
      console.log(err)
      return {errorMessage: err.message}
    })
  }).then(() => {
    return true
  }).catch(err => {
    console.log("Error has occurred in createAccount() while creating an account")
    console.log(err)
    return {errorMessage: err.message}
  })
})

exports.addWaste = functions.https.onCall((data, context) => {
  if (context.auth != null){
    return sellerDB.doc(context.auth.uid).set({ items: data.items }).then(() => {
      return true
    }).catch(err => {
      console.log("Error has occurred in addWaste() while setting the document " + context.auth.uid)
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.sellWaste = functions.https.onCall((data, context) => {
  if (context.auth != null) {
    let saleList = data.saleList
    let buyer = (data.txType == 0) ? data.buyer : ""
    let addr = data.addr.readable
    let addr_geopoint = geo.point(data.addr.latitude, data.addr.longitude)
    let txType = data.txType
    if (txType == 0 || txType == 1) {
      return sellerDB.doc(context.auth.uid).get().then(doc => {
        if (doc.exists) {
          let newItems = {}
          newItems.length = 0
          for (let type in saleList) {
            for(let subtype in saleList[type]) {
              if (newItems[type] == undefined)
                newItems[type] = {}
              if (doc.data().items[type][subtype] != undefined && doc.data().items[type][subtype] > saleList[type][subtype].amount) {
                newItems[type][subtype] = doc.data().items[type][subtype] - saleList[type][subtype].amount
                newItems.length++
              }
              else if (doc.data().items[type][subtype] == saleList[type][subtype].amount) continue
              else return {errorMessage: "Item's amount doesn't match"}
            }
          }
          return sellerDB.doc(context.auth.uid).set({items: newItems}, {merge: true}).then(() => {
            let assignedTime = []
            for (index in data.assignedTime) assignedTime.push(new Date(data.assignedTime[index]))
            return txDB.add({
              txType,
              buyer,
              seller: context.auth.uid,
              saleList,
              addr,
              addr_geopoint,
              createTimestamp: new Date(),
              assignedTime,
              txStatus: 0
            }).then(() => {
              const message = getTitleAndBody({
                uid: context.auth.uid,
                txType,
                txStatus: 0
              })
              if (txType == 0)
                return sendNotification(buyer, message.title, message.body).then(result => { return result })
              else 
                return quickSellingNotification(addr_geopoint, message.title, message.body).then(result => { return result })
            }).catch(err => {
              console.log("Error has occurred in sellWaste() while adding a transaction")
              console.log(err)
              return {errorMessage: err.message}
            })
          }).catch(err => {
            console.log("Error has occurred in sellWaste() while updating the document " + context.auth.uid)
            console.log(err)
            return {errorMessage: err.message}
          })
        }
        else return {errorMessage: "The document doesn't exist"}
      }).catch(err => {
        console.log("Error has occurred in sellWaste() while getting the document " + context.auth.uid)
        console.log(err)
        return {errorMessage: err.message}
      })
    }
    else return {errorMessage: "Transaction type is incorrect"}
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.toggleSearch = functions.https.onCall((data, context) => {
  if (context.auth != null) {
    return buyerDB.doc(context.auth.uid).update({enableSearch: data.toggleSearch}).then(() => {
      return true
    }).catch(err => {
      console.log("Error has occurred in toggleSearch() while updating the document " + context.auth.uid)
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.changeTxStatus = functions.https.onCall((data, context) => {
  if (context.auth != null) {
    return firestore.runTransaction(transaction => {
      return transaction.get(txDB.doc(data.txID)).then(doc => {
        if (data.status == 1 && doc.data().assignedTime[data.chosenTime].toMillis() < new Date())
          return {errorMessage: "The time you chose has already been passed"}

        const meesage = getTitleAndBody({
          uid: context.auth.uid,
          txType: doc.data().txType,
          txStatus: data.status,
          date: doc.data().assignedTime[data.chosenTime]
        })
        return sendNotification(doc.data().seller, meesage.title, meesage.body).then(result => {
          if (result.errorMessage != null) return {errorMessage: result.errorMessage}

          if (doc.data().txStatus >= data.status)
            return {errorMessage: "The transaction has already passed the state"}
          else if (data.status < 1 || data.status > 4)
            return {errorMessage: "The transaction status is incorrect"}
          else if (doc.data().buyer != "" && doc.data().buyer != undefined && doc.data().buyer != context.auth.uid && doc.data().seller != context.auth.uid)
            return {errorMessage: "The transaction has already been changed"}
          else if (doc.data().seller == context.auth.uid && doc.data().txType != 1 && data.status != 4)
            return {errorMessage: "You cannot complete your own selling transaction"}
          else if (doc.data().txStatus >= 3)
            return {errorMessage: "The transaction has already closed"}
          
          if (doc.data().txType == 0 || doc.data().txType == 1) {
            switch (data.status) {
              case 1:
                transaction.update(txDB.doc(data.txID), {
                  txStatus: data.status,
                  assignedTime: data.assignedTime,
                  buyer: context.auth.uid
                })
                break
              case 2:
                transaction.update(txDB.doc(data.txID), {
                  txStatus: data.status,
                  chosenTime: doc.data().assignedTime[data.chosenTime],
                  buyer: doc.data().buyer || context.auth.uid
                })
                break
              case 3:
                transaction.update(txDB.doc(data.txID), { txStatus: data.status })
                break
              default:
                transaction.update(txDB.doc(data.txID), {
                  txStatus: data.status,
                  completedTime: new Date()
                })
                break
            }
            return true
          }
          else return {errorMessage: "The transaction format is incorrect"}
        })
      })
    }).catch(err => {
      console.log("Error has occurred in changeTxStatus() while updating transaction " + context.auth.uid)
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.editBuyerInfo = functions.https.onCall((data, context) => {
  if (context.auth != null) {
    let purchaseList = data.purchaseList || {}
    let description = data.desc || "default description"
    let addr = data.addr.readable || {}
    let enableSearch = data.enableSearch || false
    return buyerDB.doc(context.auth.uid).set({
      addr,
      addr_geopoint: geo.point(data.addr.latitude, data.addr.longitude),
      purchaseList,
      description,
      enableSearch,
    }).then(() => {
      return true
    }).catch(err => {
      console.log("Error has occurred in editBuyerInfo() while updating the document " + context.auth.uid)
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.editUserInfo = functions.https.onCall((data, context) => {
  if (context.auth != null) {
    let name = data.name
    let surname = data.surname
    let addr = data.addr.readable
    return usersDB.doc(context.auth.uid).update({
      name,
      surname,
      addr,
      addr_geopoint: geo.point(data.addr.latitude, data.addr.longitude)
    }).then(() => {
      auth.updateUser(context.auth.uid, {
        phoneNumber: data.phoneNo,
        photoURL: data.photoURL
      })
    }).catch(err => {
      console.log("Error has occurred in editUserInfo() while updating the document " + context.auth.uid)
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.updateNotificationToken = functions.https.onCall((data,context) => {
  if (context.auth != null) {
    return usersDB
    .doc(context.auth.uid)
    .update({notificationToken: admin.firestore.FieldValue.arrayUnion(data.notificationToken)})
    .then(() => {
      return true
    }).catch(err => {
      console.log("Error has occurred in updateNotificationToken() while updating the document " + context.auth.uid)
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.removeNotificationToken = functions.https.onCall((data,context) => {
  if (context.auth != null) {
    return usersDB
    .doc(context.auth.uid)
    .update({notificationToken: admin.firestore.FieldValue.arrayRemove(data.notificationToken)})
    .then(() => {
      return true
    }).catch(err => {
      console.log("Error has occurred in updateNotificationToken() while updating the document " + context.auth.uid)
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.queryBuyers = functions.https.onCall((data,context) => {
  if (context.auth != null) {
    const center = geo.point(data.addr.latitude, data.addr.longitude)
    const radius = data.distance
    const query = geoBuyers.within(center, radius, "addr_geopoint")
    let buyerList = []
    const wasteType = data.wasteType
    return geofirex.get(query).then(querySnapshot => {
      querySnapshot.forEach(buyer => {
        if (buyer.id != context.auth.id && buyer.enableSearch) {
          const lastestArray = buyerList.push(buyer) - 1
          buyerList[lastestArray].totalPrice = 0
          buyerList[lastestArray].unavailableTypes = []
          for (type in wasteType)
            for (subtype in wasteType[type]) {
              if (buyerList[lastestArray].purchaseList[type] != undefined && buyerList[lastestArray].purchaseList[type][subtype] != undefined) 
                buyerList[lastestArray].totalPrice += buyerList[lastestArray].purchaseList[type][subtype] * wasteType[type][subtype]
              else
                buyerList[lastestArray].unavailableTypes.push(subtype)
            }
          if (buyerList[lastestArray].unavailableTypes.length == wasteType.length)
            buyerList.pop()
          else
            buyerList[lastestArray].sorting = (wasteType.length - buyerList[lastestArray].unavailableTypes.length) * 100000000 +
            buyerList[lastestArray].totalPrice * 100 + (radius - buyerList[lastestArray].hitMetadata.distance)
        }
      })
      buyerList.sort((a, b) => {
        return b.sorting - a.sorting
      })
      return buyerList
    }).catch(err => {
      console.log("Error has occurred in queryBuyers() while geo querying")
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.querySellers = functions.https.onCall((data,context) => {
  if (context.auth != null) {
    const saleList = data.saleList
    let txList = []
    const center = geo.point(data.addr.latitude, data.addr.longitude)
    const radius = data.distance
    const query = geoSellers.within(center, radius, "addr_geopoint")
    return geofirex.get(query).then(querySnapshot => {
      querySnapshot.forEach(seller => {
        if (seller.id != context.auth.id) {
          const lastestArray = txList.push(seller) - 1
          txList[lastestArray].unavailableTypes = []
          for (type in saleList)
            for (subtype in saleList[type])
              if (txList[lastestArray].saleList[type] == undefined && txList[lastestArray].saleList[type][subtype] == undefined)
                txList[lastestArray].unavailableTypes.push(subtype)
          if (txList[lastestArray].unavailableTypes.length == saleList.length)
            txList.pop()
          else
            txList[lastestArray].sorting = (saleList.length - txList[lastestArray].unavailableTypes.length) * 100 +
            (radius - txList[lastestArray].hitMetadata.distance)
        }
      })
      txList.sort((a, b) => {
        return b.sorting - a.sorting
      })
      return txList
    }).catch(err => {
      console.log("Error has occurred in querySellers() while geo querying")
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

const getTitleAndBody = (data) => {
  const milis = data.date == undefined ? 0 : data.date.toMillis()
  const days = ((milis - milis % 86400000) - (new Date() - (new Date().getTime() + 25200000) % 86400000)) / 86400000
  const uid = data.uid
  const daysLeft = (days != 0) ? "อีก " + days + " วัน" : "วันนี้"
  const hour = new Date(milis).getHours() || ""
  const min = new Date(milis).getMinutes() || ""
  const index = (data.txType + 1) % 2 + data.txStatus
  const title = [
    "คำร้องขอในบริเวณของคุณ",
    "คำร้องขอถึงคุณ",
    "ผู้ซื้อตอบตกลงคำร้องขอ",
    "วันนี้คุณมีนัดซื้อ-ขายขยะ",
    "ผู้ซื้อกำลังเดินทางมา"
  ]
  const body = [
    uid + " ต้องการขายขยะ",
    uid + " ต้องการขายขยะให้คุณ",
    uid + " จะเดินทางมาใน" + daysLeft,
    uid + " จะเดินทางมาถึงเวลาประมาณ " + hour + ":" + min + " น.",
    uid + " กำลังเดินทางมาหาคุณ"
  ]
  return {title: title[index], body: body[index]}
}

const quickSellingNotification = (center, title, body) => {
  const query = geoBuyers.within(center, 5, "addr_geopoint")
  return geofirex.get(query).then(querySnapshot => {
    querySnapshot.forEach(buyer => {
      sendNotification(buyer.id, title, body + " (ห่างจากคุณ " + buyer.hitMetadata.distance.toFixed(2) + " กม.)")
    })
    return true
  }).catch(err => {
    console.log("Error has occurred in quickSellingNotification() while geo querying")
    console.log(err)
    return {errorMessage: err.message}
  })
}

const sendNotification = (uid, title, body) => {
  return usersDB.doc(uid).get().then(doc => {
    if (doc.exists) return doc.data().notificationToken
    else throw "Seller doesn't exist"
  }).then(tokens => {
    tokens.forEach(token => {
      fetch("https://exp.host/--/api/v2/push/send", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: token,
          priority: "normal",
          sound: "default",
          title,
          body
        })
      })
    })
    return true
  }).catch(err => {
    console.log("Error has occurred in sendNotification()")
    console.log(err)
    return {errorMessage: err}
  })
}

// exports.quickSelling = functions.https.onCall((data, context) => {
//   if (context.auth.uid != null) {

//   }
//   else return {err: "The request is denied because of authetication"}
// })
