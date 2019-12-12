import { HOTEL_COUNTRY_SUGGESTION } from "../action/actionTypes";

export const hotelCountriesReducer = (state = [], action) => {
  switch (action.type) {
    case HOTEL_COUNTRY_SUGGESTION:
      return action.payload;
    default:
      return state;
  }
};
