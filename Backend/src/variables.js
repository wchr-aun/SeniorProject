export let wasteAmount = {}

import _zipcodejson from './zipcode.json'
let _zipcode = []
for (let index in _zipcodejson)
  _zipcode.push(String(_zipcodejson[index].zip))
export const zipcode = _zipcode