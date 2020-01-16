import {
  getWasteType,
  getSectionListFormatWasteType
} from "../../utils/firebaseFunctions";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";
export const UPDATE_PURCHASELIST = "UPDATE_PURCHASELIST";

export const fetchWasteType = () => {
  // ________returned.wastetypes format
  // Object {
  //   "danger": Object {
  //     "battery": Object {
  //       "description": "battery",
  //       "disposal": "fire",
  //       "name": "ถ่านไฟฉาย",
  //     },
  //   },
  //   "glass": Object {
  //     "redGlass": Object {
  //       "description": "aaaaaaaaaaaaaaaaaa",
  //       "disposal": "aaaaaaaaaaaaaaaaaa",
  //       "name": "แก้วแดง",
  //     },
  //   }
  // }

  // ________returned.majorType format
  // Object {
  //   "danger": Object {
  //     "battery": Object {
  //       "description": "battery",
  //       "disposal": "fire",
  //       "name": "ถ่านไฟฉาย",
  //     },
  //   },
  //   "glass": Object {
  //     "redGlass": Object {
  //       "description": "aaaaaaaaaaaaaaaaaa",
  //       "disposal": "aaaaaaaaaaaaaaaaaa",
  //       "name": "แก้วแดง",
  //     },
  //   }
  // }
  return async dispatch => {
    let result = await getWasteType();
    dispatch({
      type: FETCH_WASTETYPE,
      wasteTypes: result.wasteTypes,
      wasteTypeDropdownFormat: result.wasteTypeDropdownFormat
    });
  };
};
