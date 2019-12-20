export default class SellingTransaction {
  constructor(transactionId, buyerName, imgUrl, amountOfType, meetTime, tel) {
    this.transactionId = transactionId;
    this.buyerName = buyerName;
    this.imgUrl = imgUrl;
    this.amountOfType = amountOfType;
    this.meetTime = meetTime;
    this.tel = tel;
  }
}
