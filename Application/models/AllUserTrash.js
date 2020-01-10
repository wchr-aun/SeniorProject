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
  constructor(obj) {
    this.length = 0;
    this._obj = {};
    this._count = {};
    for (let type in obj) {
      for (let subtype in obj[type]) {
        if (this[type] == undefined) {
          this[type] = {};
          this._obj[type] = {};
        }
        this[type][subtype] = obj[type][subtype];
        this._obj[type][subtype] = obj[type][subtype];
        this.length += 1;
      }
    }
  }
  editValue(type, subtype, value) {
    if (this._count[type] == undefined) {
      this._count[type] = {};
      this._count[type][subtype] = 0;
    }
    else if (this._count[type][subtype] == undefined) this._count[type][subtype] = 0;
    this._count[type][subtype] += value;
  }
  confirmValue() {
    this.length = 0;
    for (let type in this._count) {
      for (let subtype in this._count[type]) {
        if (this[type] == undefined) {
          this[type] = {};
          this._obj[type] = {};
          this[type][subtype] = 0;
          this._obj[type][subtype] = 0;
        }
        else if (this[type][subtype] == undefined) {
          this[type][subtype] = 0;
          this._obj[type][subtype] = 0;
        }
        this[type][subtype] += this._count[type][subtype];
        this._obj[type][subtype] += this._count[type][subtype];
        this.length += 1;
      }
    }
    this._count = {};
  }
  addWaste(type, subtype, value) {
    if (value == 0) this._removeWaste(type, subtype);
    else {
      if (this[type] == undefined) {
        this[type] = {};
        this._obj[type] = {};
      }
      this[type][subtype] = value;
      this._obj[type][subtype] = value;
      this.length += 1;
    }
  }
  addWasteObj(obj) {
    for (let type in obj) {
      for (let subtype in obj[type]) {
        if (this[type] == undefined) {
          this[type] = {};
          this._obj[type] = {};
          this[type][subtype] = 0;
          this._obj[type][subtype] = 0;
        }
        else if (this[type][subtype] == undefined) {
          this[type][subtype] = 0;
          this._obj[type][subtype] = 0;
        }
        this[type][subtype] += obj[type][subtype];
        this._obj[type][subtype] += obj[type][subtype];
        this.length += 1;
      }
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
    for (let type in this) {
      if (this[type][subtype] != undefined)
        return { type, value: this[type][subtype] };
    }
    return false;
  }
  getCountBySubtype(subtype) {
    for (let type in this._count) {
      if (this._count[type][subtype] != undefined)
        return { type, value: this._count[type][subtype] };
    }
    return false;
  }
  getObject() {
    this._obj.length = this.length;
    return this._obj;
  }
  getFlatListFormat() {
    // loop through "Plastic", "Glass"
    let data = [];
    for (let type in this) {
      // loop through "HDPE", "PP"
      for (let subtype in this[type]) {
        // console.log(subtype);
        data.push({ type, subtype, amount: this[type][subtype] });
      }
    }
    return data;
  }
}
