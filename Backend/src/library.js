import firebase from "./firebase"
import { wasteAmount } from "./variables"

const txDb = firebase.firestore().collection("transactions")
const buyerDb = firebase.firestore().collection("buyerLists")
const sellerDb = firebase.firestore().collection("sellerItems")
const wasteDb = firebase.firestore().collection("wasteType")

export const queryWastesInAnArea = (zipcode) => {
  wasteAmount[String(zipcode)] = {}
  return txDb.where("zipcode", "==", Number(zipcode)).get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const saleList = doc.data().saleList
      for (let type in saleList) {
        for (let subtype in saleList[type]) {
          if (wasteAmount[String(zipcode)][subtype] == undefined)
            wasteAmount[String(zipcode)][subtype] = 0
          wasteAmount[String(zipcode)][subtype] += saleList[type][subtype].amount
        }
      }
    })
  })
}