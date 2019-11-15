import { DOMESTIC_HOTEL_SUGGESTION } from "../action/actionTypes";

export const domesticHotelSuggestionReducer = (state = [], action) => {
  switch (action.type) {
    case DOMESTIC_HOTEL_SUGGESTION:
      return action.payload;
    default:
      return state;
  }
};
