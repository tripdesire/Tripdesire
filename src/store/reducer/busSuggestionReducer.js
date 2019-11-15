import { BUS_SUGGESTION } from "../action/actionTypes";

export const busSuggestionReducer = (state = [], action) => {
  switch (action.type) {
    case BUS_SUGGESTION:
      return action.payload;
    default:
      return state;
  }
};
