import firebaseFunctions from './firebaseFunctions'

const formatDate = date => {
  let monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฏาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  ];
  return date.getDate() + " " + monthNames[date.getMonth()] + " " + (date.getFullYear() + 543);
}

const getTransactionList = async (role) => {
  let allTx = []
  for (let i = 0; i < 6; i++) {
    await firebaseFunctions.getTransactions(role, i).then(eachTxStatus => {
      allTx.push(eachTxStatus)
    }).catch(error => {
      throw new error("Error getting document:", error)
    })
  }
  return allTx
}

export default {
  formatDate,
  getTransactionList
}
