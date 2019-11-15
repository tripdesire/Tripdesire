import { SIGN_IN } from "../action/actionTypes";

initialState = [];
export const signInReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return action.payload;
    default:
      return state;
  }
};
