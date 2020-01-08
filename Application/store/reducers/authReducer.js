import { LOGOUT, SIGNIN, CHANGE_ROLE } from "../actions/authAction";

const initialState = {
  userProfile: {
    uid: null,
    name: "",
    surname: "",
    addr: "",
    enableAddr: "",
    enableSearch: ""
  },
  userRole: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN:
      console.log("SIGN-IN --- reducer");
      console.log(action);
      return {
        userProfile: {
          uid: action.userProfile.uid,
          name: action.userProfile.name,
          surname: action.userProfile.surname,
          addr: action.userProfile.addr,
          enableSearch: action.userProfile.enableSearch,
          photoURL: action.userProfile.photoURL,
          phoneNo: action.userProfile.phoneNo
        },
        userRole: action.userRole
      };
    case CHANGE_ROLE:
      return {
        ...state,
        userRole: action.userRole
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
