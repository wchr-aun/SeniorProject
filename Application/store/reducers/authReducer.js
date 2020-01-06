import { LOGOUT, SIGNIN } from "../actions/authAction";

const initialState = {
  user: {
    uid: null,
    name: "",
    surname: "",
    addr: "",
    enableAddr: "",
    enableSearch: ""
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN:
      return {
        user: {
          uid: action.userProfile.uid,
          name: action.userProfile.name,
          surname: action.userProfile.surname,
          addr: action.userProfile.addr,
          enableSearch: action.userProfile.enableSearch,
          photoURL: action.userProfile.photoURL,
          phoneNo: action.userProfile.phoneNo
        }
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
