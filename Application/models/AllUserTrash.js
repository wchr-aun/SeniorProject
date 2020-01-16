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
    this._count = {};
    for (let type in obj) {
      for (let subtype in obj[type]) {
        if (this[type] == undefined) {
          this[type] = {};
          this._count[type] = {};
        }
        this[type][subtype] = obj[type][subtype];
        this._count[type][subtype] = 0;
        this.length += 1;
      }
    }
  }
  addWaste(type, subtype, value) {
    if (value <= 0) this._removeWaste(type, subtype);
    else {
      if (this[type] == undefined || this[type][subtype] == undefined) {
        if (this[type] == undefined) this[type] = {};
        this.length += 1;
      }
      this[type][subtype] = value;
    }
  }
  editValue(type, subtype, value) {
    if (this._count[type] == undefined) {
      this._count[type] = {};
      this._count[type][subtype] = 0;
    } else if (this._count[type][subtype] == undefined)
      this._count[type][subtype] = 0;
    this._count[type][subtype] = value;
  }
  incrementalValue(type, subtype, value) {
    this._count[type][subtype] += value;
  }
  confirmValue() {
    let value;
    for (let type in this._count) {
      for (let subtype in this._count[type]) {
        if (this._count[type][subtype] != 0) {
          if (this[type] == undefined || this[type][subtype] == undefined)
            value = 0 + this._count[type][subtype];
          else value = this[type][subtype] + this._count[type][subtype];
          this._count[type][subtype] = 0;
          this.addWaste(type, subtype, value);
        }
      }
    }
  }
  clearValue() {
    this._count = {};
    for (let type in this)
      for (let subtype in this[type]) {
        if (this._count[type] == undefined) this._count[type] = {};
        this._count[type][subtype] = 0;
      }
  }
  // addWasteObj(obj) { // For backup
  //   for (let type in obj) {
  //     for (let subtype in obj[type]) {
  //       if (this[type] == undefined) {
  //         this[type] = {};
  //         this[type][subtype] = 0;

  //         this.length += 1;
  //       } else if (this[type][subtype] == undefined) {
  //         this[type][subtype] = 0;
  //         this.length += 1;
  //       }
  //       this[type][subtype] += obj[type][subtype];
  //     }
  //   }
  // }

  // need to added to _count for showing an dif
  addWasteObj(obj) {
    for (let type in obj) {
      for (let subtype in obj[type]) {
        if (this[type] == undefined) {
          // for showing dif
          this._count[type] = {};
          this._count[type][subtype] = 0;
          // for render new flatList format item
          this[type] = {};
          this[type][subtype] = 0;

          this.length += 1;
        } else if (this[type][subtype] == undefined) {
          // for showing dif
          this._count[type][subtype] = 0;
          // for render new flatList format item
          this[type][subtype] = 0;
          this.length += 1;
        }
        this._count[type][subtype] += obj[type][subtype];
      }
    }
  }
  _removeWaste(type, subtype) {
    if (this[type] != undefined) {
      delete this[type][subtype];
      delete this._count[type][subtype];
      if (Object.keys(this[type]).length == 0) {
        delete this[type];
        delete this._count[type];
      }
      this.length -= 1;
    }
  }
  getValueBySubtype(subtype) {
    for (let type in this) {
      if (type[0] != "_")
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
    let obj = {};
    obj.length = 0;
    for (let type in this) {
      if (type[0] != "_")
        for (let subtype in this[type]) {
          if (obj[type] == undefined) obj[type] = {};
          obj[type][subtype] = this[type][subtype];
          obj.length += 1;
        }
    }
    return obj;
  }
  getFlatListFormat() {
    let data = [];
    for (let type in this) {
      if (type[0] != "_")
        for (let subtype in this[type])
          data.push({ type, subtype, amount: this[type][subtype] });
    }
    return data;
  }
}
