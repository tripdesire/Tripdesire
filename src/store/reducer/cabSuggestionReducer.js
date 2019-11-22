import { CAB_SUGGESTION } from "../action/actionTypes";

export const cabSuggestionReducer = (state = [], action) => {
    switch (action.type) {
      case CAB_SUGGESTION:
        return action.payload;
      default:
        return state;
    }
  };
  