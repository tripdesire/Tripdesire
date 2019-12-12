import { SIGN_IN, LOGOUT, BILLING } from "../action/actionTypes";

const initialState = {};
export const signInReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return action.payload;
    case BILLING:
      return { ...state, billing: action.payload };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
