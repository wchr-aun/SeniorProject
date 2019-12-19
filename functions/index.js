const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./service_account.json')
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)

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
  let username = data.username
  let email = data.email
  let password = data.password
  let name = data.name
  let surname = data.surname
  let addr = data.addr
  let phoneNo = data.phoneNo
  return auth.createUser({
    uid: username,
    email: email,
    phoneNumber: phoneNo,
    password: password
  }).then(userRecord => {
    usersDB.doc(userRecord.uid).set({
      name: name,
      surname: surname,
      addr: addr,
      enableAddr: false
    }).then(() => {
      buyerDB.doc(userRecord.uid).set({
        enableSearch: false
      }).catch(err => {
        return {err}
      })
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
  let items = []
  data.items.forEach(item => { items.push({wasteType: firestore.doc(item.wasteType), amount: Number(item.amount)}) })

  return sellerDB.doc(context.auth.uid).set({
    items: items
  }).then(() => {
    return true
  }).catch(err => {
    return {err}
  })
})

exports.chooseBuyerSelling = functions.https.onCall((data, context) => {
  let items = data.items
  let buyer = data.buyer
  let addr = data.addr
  return sellerDB.doc(context.auth.uid).get().then(doc => {
    if (doc.exists) {
      for(let i = 0; i < items.length; i++)
        if (items[i].amount <= doc.data().items[i].amount && items[i].wasteType == doc.data().items[i].wasteType)
          items[i].amount = doc.data().items[i].amount - items[i].amount
        else
          return {err: "Item's amount doesn't match"}
      return sellerDB.doc(context.auth.uid).set({items: items}).then(() => {
        return txDB.add({
          buyer,
          seller: context.auth.uid,
          items,
          addr,
          createTimestamp: admin.firestore.Timestamp.fromDate(new Date()),
          assignedTime,
          txStatus: "Waiting"
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
})

exports.toggleEnableAddr = functions.https.onCall((data, context) => {
  return usersDB.doc(context.auth.uid).get(doc => {
    return usersDB.doc(context.auth.uid).set({enableAddr: !doc.data().enableAddr}, {merge: true}).then(() => {
      return true
    }).catch(err => {
      return {err}
    })
  }).catch(err => {
    return {err}
  })
})

exports.toggleEnableSearch = functions.https.onCall((data, context) => {
  return buyerDB.doc(context.auth.uid).get(doc => {
    return buyerDB.doc(context.auth.uid).set({enableSearch: !doc.data().enableAddr}, {merge: true}).then(() => {
      return true
    }).catch(err => {
      return {err}
    })
  }).catch(err => {
    return {err}
  })
})
