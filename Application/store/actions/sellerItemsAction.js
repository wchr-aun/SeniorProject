import {
  getSellerItems,
  addWaste,
  queryBuyers,
  sellWaste
} from "../../utils/firebaseFunctions";
import { Wastes } from "../../models/AllUserTrash";

// export const FETCH_SELLER_ITEMS = "FETCH_SELLER_ITEMS";
export const SET_SELLERITEMS = "SET_SELLERITEMS";
export const SET_WASTE_FOR_SELL = "SET_WASTE_FOR_SELL";
export const GET_BUYER_LIST = "GET_BUYER_LIST";
export const CHOOSEBUYER_SELL = "CHOOSEBUYER_SELL";
export const SET_FROM_CAMERA = "SET_FROM_CAMERA";

export const fetchSellerItems = () => {
  return async dispatch => {
    try {
      let result = await getSellerItems();
      let sellerItems = new Wastes(result);
      let sellerItemsForSell = new Wastes(result);

      dispatch({
        type: SET_SELLERITEMS,
        sellerItems,
        sellerItemsForSell,
        sellerItemsFlatListFormat: [...sellerItems.getFlatListFormat(true)]
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const updateSellerItems = sellerItems => {
  return async dispatch => {
    // update new wastesData on firebase
    let sellerItemsForSell = Object.assign(
      Object.create(sellerItems),
      sellerItems
    );

    try {
      await addWaste({
        items: sellerItems.getObject()
      });
      // set new wastesData
      dispatch({
        type: SET_SELLERITEMS,
        sellerItems,
        sellerItemsForSell,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat(true)
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const setSellerItemsForSell = sellerItemsForSell => {
  return async dispatch => {
    return dispatch({
      type: SET_WASTE_FOR_SELL,
      sellerItemsForSell
    });
  };
};

export const getBuyerList = queryData => {
  return async dispatch => {
    try {
      // search buyer
      let buyerList = await queryBuyers(queryData);

      // dispatch
      dispatch({
        type: GET_BUYER_LIST,
        buyerList: buyerList
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const chooseBuyerSell = (
  sellAddr,
  sellerItems,
  buyerName,
  buyerPriceInfo,
  assignedTime
) => {
  return async dispatch => {
    // sell only sellerItem that buyer have
    let saleList = {};
    saleList["length"] = 0;
    for (let type in sellerItems) {
      if (type != "length" && type != "_count" && type != "_selected") {
        for (let subtype in sellerItems[type]) {
          if (
            !(
              buyerPriceInfo[type] == undefined ||
              buyerPriceInfo[type][subtype] == undefined ||
              sellerItems._selected[type][subtype] == false
            )
          ) {
            if (saleList[type] == undefined) {
              saleList[type] = {};
            }
            saleList["length"] += 1;
            saleList[type][subtype] = {
              amount: sellerItems[type][subtype],
              price: buyerPriceInfo[type][subtype]
            };
          }
        }
      }
    }
    // do async task
    let sellRequest = {
      saleList,
      addr: sellAddr,
      buyer: buyerName,
      txType: 0,
      assignedTime: assignedTime
    };

    try {
      await sellWaste(sellRequest);
      // update redux store
      dispatch({
        type: CHOOSEBUYER_SELL,
        sellRequest
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

// Object {
//   "detail": Object {
//     "addr": "91 กรุงเทพมหานคร ประเทศไทย 10140",
//     "addr_geopoint": Object {
//       "geohash": "w4rmwucv7",
//       "geopoint": GeoPoint {
//         "_lat": 13.6500561,
//         "_long": 100.4945061,
//       },
//     },
//     "assignedTime": Array [
//       Timestamp {
//         "nanoseconds": 0,
//         "seconds": 946659600,
//       },
//       Timestamp {
//         "nanoseconds": 0,
//         "seconds": 978282000,
//       },
//       Timestamp {
//         "nanoseconds": 0,
//         "seconds": 980960400,
//       },
//     ],
//     "buyer": "huaweione",
//     "createTimestamp": Timestamp {
//       "nanoseconds": 792000000,
//       "seconds": 1578646010,
//     },
//     "saleList": Object {
//       "length": 1,
//       "plastic": Object {
//         "PP": Object {
//           "amount": 1,
//           "price": 15,
//         },
//       },
//     },
//     "seller": "huaweione",
//     "txStatus": 0,
//     "txType": 0,
//   },
//   "txId": "z4k7tNTMy3s53QztKREe",
// }
