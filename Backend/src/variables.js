export let wasteAmountDC = {}
export let buyersDC = {}

import _zipcodejson from './zipcode.json'
let _zipcode = []
let _geopoint = {}
for (let index in _zipcodejson) {
  _zipcode.push(String(_zipcodejson[index].zipcode))
  _geopoint[_zipcodejson[index].zipcode] = {lat: _zipcodejson[index].latitude, lng: _zipcodejson[index].longitude}
}
export const zipcode = _zipcode
export const geopoint = _geopoint

export let totalWastesInTx = {}
export let totalWastesInSystem = {}
