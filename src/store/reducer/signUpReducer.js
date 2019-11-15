import { SIGN_UP } from "../action/actionTypes";

initialState = [];
export const signUpReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_UP:
      return [...state, action.payload];
    default:
      return state;
  }
};
