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
      let sellerItems = new Wastes(await getSellerItems());
      dispatch({
        type: SET_SELLERITEMS,
        sellerItems: sellerItems,
        sellerItemsFlatListFormat: [...sellerItems.getFlatListFormat()]
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const updateSellerItems = sellerItems => {
  return async dispatch => {
    // update new wastesData on firebase
    try {
      console.log("sellerItemsAction -- updatedSellerItems -- ");
      console.log(sellerItems);
      await addWaste({
        items: sellerItems.getObject()
      });
      // set new wastesData
      dispatch({
        type: SET_SELLERITEMS,
        sellerItems,
        sellerItemsFlatListFormat: sellerItems.getFlatListFormat()
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const setSellerItemsForSell = sellerItemsForSell => {
  return async dispatch => {
    console.log("---------> setSellerItemsForSell Action <----------");
    console.log(sellerItemsForSell);

    let sellerItemsForSellCloned = Object.assign(
      Object.create(sellerItemsForSell),
      sellerItemsForSell
    );

    return dispatch({
      type: SET_WASTE_FOR_SELL,
      sellerItemsForSell: sellerItemsForSellCloned.getObject()
    });
  };
};

export const getBuyerList = queryData => {
  return async dispatch => {
    try {
      // search buyer
      console.log("--- queryData before --> queryBuyers(queryData)");
      console.log(queryData);
      let buyerList = await queryBuyers(queryData);
      console.log("--- queryData after sellerAction --- BuyerList");
      console.log(buyerList);

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
    console.log("price info");
    console.log(buyerPriceInfo);
    // // sellerItems in itemsFormat
    // for(let type in sellerItems){
    //   if(type != 'length'){
    //     for(let subtype in sellerItems[type]){
    //       console.log(subtype) //PP
    //       sellerItems[type][subtype] = {amount: sellerItems[type][subtype], price: }
    //     }
    //   }
    // }
    // do async task
    let transaction = {
      saleList: sellerItems,
      addr: sellAddr,
      buyer: buyerName,
      txType: 0,
      assignedTime: assignedTime
    };
    console.log("___ In chooseBuyerSell __ Action");
    console.log(transaction);

    try {
      await sellWaste(transaction);
      // update redux store
      dispatch({
        type: CHOOSEBUYER_SELL,
        transaction
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
