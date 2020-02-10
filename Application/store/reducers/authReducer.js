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
      console.log("SIGNIN");
      return {
        userProfile: {
          uid: action.userProfile.uid,
          name: action.userProfile.name,
          surname: action.userProfile.surname,
          addr: action.userProfile.addr,
          enableSearch: action.userProfile.enableSearch,
          img: action.userProfile.img,
          phoneNo: action.userProfile.phoneNo
        },
        userRole: action.userRole
      };
    case CHANGE_ROLE:
      console.log("CHANGE_ROLE");

      return {
        ...state,
        userRole: action.userRole
      };
    case LOGOUT:
      console.log("LOGOUT");
      return initialState;
    default:
      return state;
  }
};
