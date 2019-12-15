// class Category {
//   constructor(id, title, color) {
//     this.id = id;
//     this.title = title;
//     this.color = color;
//   }
// }
// export default Category;

export default class SellingTransaction {
  constructor(transactionId, buyerName, buyerImg, amountOfType, meetTime) {
    this.transactionId = transactionId;
    this.buyerName = buyerName;
    this.buyerImg = buyerImg;
    this.amountOfType = amountOfType;
    this.meetTime = meetTime;
  }
}
