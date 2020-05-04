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
  const name = data.name
  const surname = data.surname
  const addr = data.addr.readable
  const notificationToken = data.notificationToken || false
  const zipcode = Number(data.zipcode)
  const phoneNo = data.phoneNo
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
      zipcode,
      phoneNo,
      notificationToken: admin.firestore.FieldValue.arrayUnion(notificationToken)
    }).then(() => {
      buyerDB.doc(userRecord.uid).set({
        enableSearch: false
      }).catch(err => {
        console.log("Error has occurred in createAccount() while adding the account " + userRecord.uid + " to firestore")
        console.log(err)
        return {errorMessage: err.message}
      })
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
    const saleList = data.saleList
    const buyer = (data.txType == 0) ? data.buyer : ""
    const addr = data.addr.readable
    const addr_geopoint = geo.point(data.addr.latitude, data.addr.longitude)
    const zipcode = Number(data.addr.zipcode)
    const txType = data.txType
    const img = data.img
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
            for (index in data.assignedTime) {
              if (new Date(data.assignedTime[index]) > new Date())
                assignedTime.push(new Date(data.assignedTime[index]))
              else return {errorMessage: "The date has already passed"}
            }
            return txDB.add({
              txType,
              buyer,
              seller: context.auth.uid,
              saleList,
              addr,
              addr_geopoint,
              zipcode,
              createTimestamp: new Date(),
              assignedTime,
              txStatus: 0,
              img
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
        if (data.status == 2 && new Date(data.chosenTime) < new Date())
          return {errorMessage: "The time you chose has already been passed"}

        let meesage = {}
        let sendTo
        if (data.status == 2 && doc.data().txStatus == 1) {
          meesage = getTitleAndBody({
            uid: context.auth.uid,
            txType: doc.data().txType,
            txStatus: 6,
            date: data.chosenTime
          })
          sendTo = doc.data().buyer
        }
        else if (data.status == 4) {
          meesage = getTitleAndBody({
            uid: context.auth.uid,
            txType: doc.data().txType,
            txStatus: data.status,
            date: data.chosenTime
          })
          sendTo = doc.data().seller
        }
        else {
          meesage = getTitleAndBody({
            uid: context.auth.uid,
            txType: doc.data().txType,
            txStatus: data.status,
            date: data.chosenTime
          })
          sendTo = (context.auth.uid == doc.data().seller) ? doc.data().buyer : doc.data().seller
        }
        return sendNotification(sendTo, meesage.title, meesage.body).then(result => {
          if (result.errorMessage != null) return {errorMessage: result.errorMessage}

          if (doc.data().txStatus >= data.status)
            return {errorMessage: "The transaction has already passed the state"}
          else if (data.status < 1 || data.status > 5)
            return {errorMessage: "The transaction status is incorrect"}
          else if (doc.data().buyer != "" && doc.data().buyer != undefined && doc.data().buyer != context.auth.uid && doc.data().seller != context.auth.uid)
            return {errorMessage: "The transaction has already been changed"}
          else if (doc.data().seller == context.auth.uid && doc.data().txType != 1 && data.status != 4 && data.status != 2)
            return {errorMessage: "You cannot complete your own selling transaction"}
          
          if (doc.data().txType == 0 || doc.data().txType == 1) {
            switch (data.status) {
              case 1:
                let assignedTime = []
                for (index in data.assignedTime) assignedTime.push(new Date(data.assignedTime[index]))
                transaction.update(txDB.doc(data.txID), {
                  txStatus: data.status,
                  assignedTime,
                  buyer: context.auth.uid
                })
                break
              case 2:
                transaction.update(txDB.doc(data.txID), {
                  txStatus: data.status,
                  chosenTime: new Date(data.chosenTime),
                  buyer: doc.data().buyer || context.auth.uid
                })
                break
              case 3:
                transaction.update(txDB.doc(data.txID), { txStatus: data.status })
                break
              case 4:
                transaction.update(txDB.doc(data.txID), {
                  txStatus: data.status,
                  completedTime: new Date()
                })
                sellerDB.doc(doc.data().seller).get().then(item => {
                  let items = item.data().items
                  for (let i in doc.data().saleList) {
                    if (items[i]) {
                      for (let j in doc.data().saleList[i]) {
                        if (items[i][j])
                          items[i][j] += doc.data().saleList[i][j].amount
                        else items[i][j] = doc.data().saleList[i][j].amount
                      }
                    }
                    else {
                      items[i] = doc.data().saleList[i]
                      for (let j in items[i]) items[i][j] = items[i][j].amount
                    }
                  }
                  sellerDB.doc(doc.data().seller).update({
                    items
                  })
                })
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
    const purchaseList = data.purchaseList || {}
    const description = data.desc || "default description"
    const addr = data.addr.readable || {}
    const enableSearch = data.enableSearch || false
    const zipcode = Number(data.addr.zipcode)
    return buyerDB.doc(context.auth.uid).set({
      addr,
      zipcode,
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
    const name = data.name
    const surname = data.surname
    const addr = data.addr.readable
    const zipcode = Number(data.addr.zipcode)
    const phoneNo = data.phoneNo
    return usersDB.doc(context.auth.uid).update({
      name,
      surname,
      addr,
      zipcode,
      phoneNo,
      addr_geopoint: geo.point(data.addr.latitude, data.addr.longitude)
    }).then(() => {
      auth.updateUser(context.auth.uid, {
        phoneNumber: phoneNo
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
        if (buyer.id != context.auth.uid && buyer.enableSearch) {
          const lastestArray = buyerList.push(buyer) - 1
          buyerList[lastestArray].totalPrice = 0
          buyerList[lastestArray].unavailableTypes = {}
          for (type in wasteType)
            for (subtype in wasteType[type]) {
              if (buyerList[lastestArray].purchaseList[type] != undefined && buyerList[lastestArray].purchaseList[type][subtype] != undefined) 
                buyerList[lastestArray].totalPrice += buyerList[lastestArray].purchaseList[type][subtype] * wasteType[type][subtype]
              else
                buyerList[lastestArray].unavailableTypes[subtype] = subtype
            }
          if (Object.keys(buyerList[lastestArray].unavailableTypes).length == wasteType.length)
            buyerList.pop()
          else
            buyerList[lastestArray].sorting = (wasteType.length - Object.keys(buyerList[lastestArray].unavailableTypes).length) * 100000000 +
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
      querySnapshot.forEach(quickSellingTx => {
        if (quickSellingTx.seller != context.auth.uid) {
          const lastestArray = txList.push(quickSellingTx) - 1
          let unavailableTypes = 0
          for (type in txList[lastestArray].saleList)
            for (subtype in txList[lastestArray].saleList[type])
              if (saleList[type] == undefined || saleList[type][subtype] == undefined)
                unavailableTypes += 1
          if (unavailableTypes != 0) txList.pop()
        }
      })
      txList.sort((a, b) => {
        return a.hitMetadata.distance - b.hitMetadata.distance
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

exports.setFavBuyer = functions.https.onCall((data,context) => {
  if (context.auth != null) {
    return usersDB.doc(context.auth.uid).get().then(doc => {
      if (doc.exists) {
        if (doc.data().favBuyers != undefined && doc.data().favBuyers.includes(data.favBuyer)) {
          usersDB.doc(context.auth.uid).update({
            favBuyers: admin.firestore.FieldValue.arrayRemove(data.favBuyer)
          })
          return 'unset'
        }
        else {
          usersDB.doc(context.auth.uid).update({
            favBuyers: admin.firestore.FieldValue.arrayUnion(data.favBuyer)
          })
          return 'set'
        }
      }
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

exports.sendComment = functions.https.onCall((data,context) => {
  if (context.auth != null) {
    if (data.comment.length < 5 && data.rating == 0)
      return {errorMessage: "Error has occurred due to incompleted data: The comment needs to have more than 5 characters, and the rating needs to be given"}
    return firestore.runTransaction(transaction => {
      return transaction.get(buyerDB.doc(data.seller)).then(doc => {
        if (doc.data().rating == undefined || doc.data().review == undefined) {
          oldRating = 0
          numberOfReviews = 0
        }
        else {
          oldRating = doc.data().rating
          numberOfReviews = doc.data().review.length
        }
        newRating = ((oldRating * numberOfReviews) + data.rating) / (numberOfReviews + 1)

        transaction.update(buyerDB.doc(data.seller), {
          rating: newRating,
          review: admin.firestore.FieldValue.arrayUnion({
            comment: data.comment,
            rating: data.rating,
            user: "wchr.aun",
            timestamp: new Date()
          })
        })
        return true
      })
    }).catch(err => {
      console.log("Error has occurred in sendComment() while updating transaction " + "wchr.aun")
      console.log(err)
      return {errorMessage: err.message}
    })
  }
  else return {errorMessage: "The request is denied because of authetication"}
})

const getTitleAndBody = (data) => {
  const milis = data.date == undefined ? 0 : Number(data.date)
  const days = Math.floor(((milis - milis % 86400000) - (new Date() - (new Date().getTime() + 25200000) % 86400000)) / 86400000)
  const uid = data.uid
  const daysLeft = (days != 0) ? "อีก " + days + " วัน" : "วันนี้"
  const hour = new Date(milis).getHours() || ""
  const min = new Date(milis).getMinutes() || ""
  const title = [
    ["คำร้องขอถึงคุณ",
    "มีการร้องขอเปลี่ยนแปลงเวลา",
    "ผู้ซื้อตอบตกลงคำร้องขอ",
    "ผู้ซื้อกำลังเดินทางมา",
    "คำขอร้องถูกยกเลิก",
    "",
    "ผู้ขายขยะได้ทำการเลือกเวลาใหม่แล้ว"],
    ["คำร้องขอในบริเวณของคุณ",
    "",
    "ผู้ซื้อตอบตกลงคำร้องขอขายด่วน",
    "ผู้ซื้อกำลังเดินทางมา",
    "คำขอร้องถูกยกเลิก",
    "",
    "ผู้ขายขยะได้ทำการเลือกเวลาใหม่แล้ว"]
  ]
  const body = [
    [uid + " ต้องการขายขยะให้คุณ",
    uid + " ต้องการขอเปลี่ยนแปลงเวลานัดหมายของคุณ",
    uid + " จะเดินทางมาใน" + daysLeft,
    uid + " จะเดินทางมาถึงเวลาประมาณ " + hour + ":" + min + " น.",
    uid + " ได้ทำการยกเลิกคำขอซื้อ-ขายกับคุณแล้ว",
    "",
    uid + " ได้ทำการเลือกเวลาใหม่แล้ว จะต้องเดินทางใน" + daysLeft],
    [uid + " ต้องการขายขยะ",
    "",
    uid + " จะเดินทางมาใน" + daysLeft,
    uid + " จะเดินทางมาถึงเวลาประมาณ " + hour + ":" + min + " น.",
    uid + " ได้ทำการยกเลิกคำขอซื้อ-ขายกับคุณแล้ว",
    "",
    uid + " ได้ทำการเลือกเวลาใหม่แล้ว จะต้องเดินทางใน" + daysLeft]
  ]
  return {title: title[data.txType][data.txStatus], body: body[data.txType][data.txStatus]}
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
    else if (uid == "") return ""
    else throw "Seller doesn't exist"
  }).then(tokens => {
    if (title == "" || body == "" || tokens == "") return false
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

// exports.temp = functions.https.onCall((data, context) => {
//   txDB.get().then(querySnapshot => {
//     querySnapshot.forEach(doc => {
//       console.log(doc.data().addr)
//       const addr = doc.data().addr.split(" ")
//       const zipcode = addr[addr.length - 1]
//       txDB.doc(doc.id).update({
//         zipcode: Number(zipcode)
//       }).catch(err => console.log)
//     })
//   })
// })
