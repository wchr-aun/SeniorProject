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
    this.length = 0;
    this._obj = {};
    for (let type in firebaseObj) {
      for (let subtype in firebaseObj[type]) {
        if (this[type] == undefined) {
          this[type] = {};
          this._obj[type] = {};
        }
        this[type][subtype] = firebaseObj[type][subtype];
        this._obj[type][subtype] = firebaseObj[type][subtype];
        this.length += 1;
      }
    }
  }
  addWaste(type, subtype, amount) {
    if (amount == 0) this.removeWaste(type, subtype);
    else {
      if (this[type] == undefined) {
        this[type] = {};
        this._obj[type] = {};
      }
      this[type][subtype] = amount;
      this._obj[type][subtype] = amount;
      this.length += 1;
    }
  }
  _removeWaste(type, subtype) {
    if (this[type] != undefined) {
      delete this[type][subtype];
      delete this._obj[type][subtype];
      if (Object.keys(this._obj[type]).length == 0) {
        delete this[type];
        delete this._obj[type];
      }
      this.length -= 1;
    }
  }
  getValueBySubtype(subtype) {
    for (let type in this._obj) {
      if (this[type][subtype] != undefined)
        return {type, amount: this[type][subtype]}
    }
    return false;
  }
  getObject() {
    this._obj.length = this.length;
    return this._obj;
  }
}
