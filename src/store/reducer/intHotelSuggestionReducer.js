import { INTERNATIONAL_HOTEL_SUGGESTION } from "../action/actionTypes";

export const intHotelSuggestionReducer = (state = [], action) => {
  switch (action.type) {
    case INTERNATIONAL_HOTEL_SUGGESTION:
      return action.payload;
    default:
      return state;
  }
};
