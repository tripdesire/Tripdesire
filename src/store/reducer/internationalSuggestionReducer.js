import { INTERNATIONAL_SUGGESTION } from "../action/actionTypes";

initialState = [];
export const internationalSuggestionReducer = (state = initialState, action) => {
  switch (action.type) {
    case INTERNATIONAL_SUGGESTION:
      return action.payload;
    default:
      return state;
  }
};
