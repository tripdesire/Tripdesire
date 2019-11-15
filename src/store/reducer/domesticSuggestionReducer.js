import { DOMESTIC_SUGGESTION } from "../action/actionTypes";

export const domesticSuggestionReducer = (state = [], action) => {
  switch (action.type) {
    case DOMESTIC_SUGGESTION:
      return action.payload;
    default:
      return state;
  }
};
