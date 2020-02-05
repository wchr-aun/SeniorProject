import {
  SELLED_SELLERITEMS,
  SET_WASTE_FOR_SELL,
  GET_BUYER_LIST,
  FETCH_SELLER_ITEMS,
  SET_SELLERITEMS,
  CLEAR_SELLERITEMSCAMERA
} from "../actions/sellerItemsAction";
import {
  GET_PREDICTION,
  CONFIRM_SELLERITEMSCAMERA
} from "../actions/imageAction";
import { LOGOUT } from "../actions/authAction";

const initialState = {
  sellerItems: {},
  sellerItemsForSell: {},
  sellerItemsFlatListFormat: [],
  sellerItemsCamera: [],
  sellerItemsCameraObj: {},
  buyerList: [],
  buyerInfomation: "",
  assignedTime: ""
};

export default function(state = initialState, action) {
  let sellerItemsForSellCloned = "";
  switch (action.type) {
    case SET_SELLERITEMS:
      console.log("SET_SELLERITEMS Redux Reducer Run");
      return {
        ...state,
        sellerItems: action.sellerItems,
        sellerItemsForSell: action.sellerItemsForSell,
        sellerItemsFlatListFormat: action.sellerItemsFlatListFormat
      };
    case GET_PREDICTION:
      console.log("GET_PREDICTION");

      let foundedSubtype = [];
      let sellerItemsFromCamera = [];
      let sellerItemsCameraObj = {};
      action.results.forEach((item, index) => {
        if (foundedSubtype.includes(item.class)) {
          // already pushed
          let targetIndex = sellerItemsFromCamera.indexOf(
            sellerItemsFromCamera.filter(
              waste => waste.subtype === item.class
            )[0]
          );
          sellerItemsFromCamera[targetIndex].amount += 1;
          sellerItemsCameraObj[sellerItemsFromCamera[targetIndex].type][
            item.class
          ] += 1;
        } else {
          // not pushed yet
          let majortype = "";
          for (let type in action.wasteTypesDB) {
            if (action.wasteTypesDB[type][item.class] != undefined)
              majortype = type;
          }
          // array for showing on FlatList
          sellerItemsFromCamera.push({
            subtype: item.class,
            amount: 1,
            type: majortype
          });
          // obj
          if (sellerItemsCameraObj[majortype] == undefined) {
            sellerItemsCameraObj[majortype] = {};
          }
          sellerItemsCameraObj[majortype][item.class] = 1;
          foundedSubtype.push(item.class);
        }
      });
      return {
        ...state,
        sellerItemsCamera: [...sellerItemsFromCamera],
        sellerItemsCameraObj: sellerItemsCameraObj
      };
    case CONFIRM_SELLERITEMSCAMERA:
      console.log("CONFIRM_CAMERA Reducer Run");
      return {
        ...state,
        sellerItemsCameraObj: action.sellerItemsCameraObj
      };
    case CLEAR_SELLERITEMSCAMERA:
      return {
        ...state,
        sellerItemsCameraObj: {}
      };
    case SET_WASTE_FOR_SELL:
      console.log("SET_WASTE_FOR_SELL Reducer Run");
      sellerItemsForSellCloned = Object.assign(
        Object.create(action.sellerItemsForSell),
        action.sellerItemsForSell
      );
      sellerItemsForSellCloned.confirmValue();

      return {
        ...state,
        sellerItemsForSell: sellerItemsForSellCloned,
        sellerItemsFlatListFormat: [
          ...sellerItemsForSellCloned.getFlatListFormat(true)
        ]
      };
    case SELLED_SELLERITEMS:
      console.log("CHOOSEBUYER_SELL Reducer Run");
      let sellerItemsCloned = Object.assign(
        Object.create(state.sellerItems),
        state.sellerItems
      );

      sellerItemsForSellCloned = Object.assign(
        Object.create(state.sellerItems),
        state.sellerItems
      );
      // reduce sellerItems
      console.log(action.sellRequest);
      for (let type in action.sellRequest["saleList"]) {
        if (type !== "_count" && type !== "length") {
          // got object
          for (let subtype in action.sellRequest["saleList"][type]) {
            sellerItemsCloned.incrementalValue(
              type,
              subtype,
              -action.sellRequest["saleList"][type][subtype].amount
            );
          }
        }
      }
      sellerItemsCloned.confirmValue();
      return {
        ...state,
        sellerItems: sellerItemsCloned,
        sellerItemsForSell: sellerItemsForSellCloned,
        sellerItemsFlatListFormat: sellerItemsCloned.getFlatListFormat(true)
      };
    case GET_BUYER_LIST:
      console.log("GET_BUYER_LIST Reducer Run");
      return {
        ...state,
        buyerList: [...action.buyerList]
      };
    case LOGOUT:
      return initialState;
  }
  return state;
}
