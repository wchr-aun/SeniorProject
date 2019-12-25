export const SET_USERTRASH = "SET_USERTRASH";

export const setUserTrash = items => {
  return async dispatch => {
    dispatch({
      type: SET_USERTRASH,
      items: [...items]
    });
  };
};
