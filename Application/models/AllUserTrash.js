export class AllUserTrash {
  constructor(userId, trashName, imgUrl, amountOfTrash, trashAdjustPrice) {
    this.userId = userId;
    this.trashName = trashName;
    this.imgUrl = imgUrl;
    this.amountOfTrash = amountOfTrash;
    this.trashAdjustPrice = trashAdjustPrice;
  }
}

export class Wastes {
  constructor(firebaseObj) {
    this.length = 0
    this.obj = {}
    firebaseObj = firebaseObj || []
    for (type in firebaseObj) {
      for (subtype in firebaseObj[type]) {
        if (this[type] == undefined) {
          this[type] = {}
          this.obj[type] = {}
        }
        this[type][subtype] = firebaseObj[type][subtype]
        this.obj[type][subtype] = firebaseObj[type][subtype]
        this.length += 1
      }
    }
  }
  addWaste(type, subtype, amount) {
    if (amount == 0) this.removeWaste(type, subtype)
    else {
      if (this[type] == undefined) {
        this[type] = {}
        this.obj[type] = {}
      }
      this[type][subtype] = amount
      this.obj[type][subtype] = amount
      this.length += 1
    }
  }
  removeWaste(type, subtype) {
    if (this[type] != undefined) {
      delete this[type][subtype]
      delete this.obj[type][subtype]
      if (Object.keys(this.obj[type]).length == 0) {
        delete this[type]
        delete this.obj[type]
      }
      this.length -= 1
    }
  }
  getObject() {
    this.obj.length = this.length
    return this.obj
  }
}
