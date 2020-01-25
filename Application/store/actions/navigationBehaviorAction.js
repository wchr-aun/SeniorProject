// export const FETCH_SELLER_ITEMS = "FETCH_SELLER_ITEMS";
export const OPERATION_COMPLETED = "OPERATION_COMPLETED";
export const START_OPERATION = "START_OPERATION";

export const finishOperation = () => {
  return {
    type: OPERATION_COMPLETED
  };
};

export const startOperation = () => {
  return {
    type: START_OPERATION
  };
};
