import firebase from "./firebase"
import { totalWastesInSystem, totalWastesInTx } from "./variables"

const txDb = firebase.firestore().collection("transactions")
const buyerDb = firebase.firestore().collection("buyerLists")
const sellerDb = firebase.firestore().collection("sellerItems")
const wasteDb = firebase.firestore().collection("wasteType")
const usersDb = firebase.firestore().collection("users")

export const queryWastesInAnArea = (zipcode) => {
  return txDb.where("zipcode", "==", Number(zipcode)).get().then(querySnapshot => {
    let wasteAmount = {}
    querySnapshot.forEach(doc => {
      const saleList = doc.data().saleList
      for (let type in saleList) {
        for (let subtype in saleList[type]) {
          if (wasteAmount[type] == undefined) {
            wasteAmount[type] = {}
            wasteAmount[type][subtype] = {}
            wasteAmount[type][subtype].inTx = 0
            wasteAmount[type][subtype].onHold = 0
          }
          else if (wasteAmount[type][subtype] == undefined) {
            wasteAmount[type][subtype] = {}
            wasteAmount[type][subtype].inTx = 0
            wasteAmount[type][subtype].onHold = 0
          }
          wasteAmount[type][subtype].inTx += saleList[type][subtype].amount
        }
      }
    })
    return wasteAmount
  }).then(wasteAmount => {
    let promises = []
    return usersDb.where("zipcode", "==", Number(zipcode)).get().then(querySnapshot => {
      querySnapshot.forEach(user => {
        promises.push(sellerDb.doc(user.id).get().then(doc => {
          if (doc.exists) {
            const items = doc.data().items
            for (let type in items) {
              for (let subtype in items[type]) {
                if (wasteAmount[type] == undefined) {
                  wasteAmount[type] = {}
                  wasteAmount[type][subtype] = {}
                  wasteAmount[type][subtype].inTx = 0
                  wasteAmount[type][subtype].onHold = 0
                }
                else if (wasteAmount[type][subtype] == undefined) {
                  wasteAmount[type][subtype] = {}
                  wasteAmount[type][subtype].inTx = 0
                  wasteAmount[type][subtype].onHold = 0
                }
                wasteAmount[type][subtype].onHold += items[type][subtype]
              }
            }
          }
        }))
      })
      return Promise.all(promises).then(() => {
        return wasteAmount
      })
    })
  })
}

export const getRandomColor = () => {
  let letters = '123456789ABC';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 11)];
  }
  return color;
}

export const queryTotalWastes = () => {
  return txDb.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const saleList = doc.data().saleList
      for (let type in saleList) {
        for (let subtype in saleList[type]) {
          if (totalWastesInSystem[type] == undefined) {
            totalWastesInSystem[type] = {}
            totalWastesInSystem[type][subtype] = 0
            totalWastesInTx[type] = {}
            totalWastesInTx[type][subtype] = 0
          }
          else if (totalWastesInSystem[type][subtype] == undefined) {
            totalWastesInSystem[type][subtype] = 0
            totalWastesInTx[type][subtype] = 0
          }
          totalWastesInSystem[type][subtype] += saleList[type][subtype].amount
          totalWastesInTx[type][subtype] += saleList[type][subtype].amount
        }
      }
    })
  }).then(() => {
    return sellerDb.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const items = doc.data().items
        for (let type in items) {
          for (let subtype in items[type]) {
            if (totalWastesInSystem[type] == undefined) {
              totalWastesInSystem[type] = {}
              totalWastesInSystem[type][subtype] = 0
            }
            else if (totalWastesInSystem[type][subtype] == undefined)
              totalWastesInSystem[type][subtype] = 0
            totalWastesInSystem[type][subtype] += items[type][subtype]
          }
        }
      })
    })
  })
}

export const queryBuyerInAnArea = (zipcode) => {
  return buyerDb.where("zipcode", "==", Number(zipcode)).get().then(querySnapshot => {
    let markers = []
    querySnapshot.forEach(buyer => {
      markers.push({
        position: {
          lat: buyer.data().addr_geopoint.geopoint.latitude,
          lng: buyer.data().addr_geopoint.geopoint.longitude
        }
      })
    })
    return markers
  })
}
