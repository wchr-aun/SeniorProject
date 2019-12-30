import firebaseFunctions from "../../utils/firebaseFunctions";

export const FETCH_WASTETYPE = "FETCH_WASTETYPE";

export const fetchWasteType = () => {
  return async dispatch => {
    let wasteTypes = [];
    wasteTypes = await firebaseFunctions.getWasteType();
    // Get only wasteType name
    wasteTypes.forEach((item, index) => {
      // wasteTypes.push(...item, { value: item.wasteTypeId });
      wasteTypes[index] = { ...item, value: item.wasteTypeId };
    });

    dispatch({ type: FETCH_WASTETYPE, wasteTypes });
  };
};
