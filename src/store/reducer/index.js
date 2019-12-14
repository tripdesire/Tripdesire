import { combineReducers } from "redux";
import { domesticSuggestionReducer } from "./domesticSuggestionReducer";
import { internationalSuggestionReducer } from "./internationalSuggestionReducer";
import { domesticHotelSuggestionReducer } from "./domesticHotelSuggestionReducer";
import { userReducer } from "./userReducer";
import { busSuggestionReducer } from "./busSuggestionReducer";
import { cabSuggestionReducer } from "./cabSuggestionReducer";
import { intHotelSuggestionReducer } from "./intHotelSuggestionReducer";
import { hotelCountriesReducer } from "./hotelCountriesReducer";

export default combineReducers({
  domesticSuggestion: domesticSuggestionReducer,
  internationalSuggestion: internationalSuggestionReducer,
  domesticHotelSuggestion: domesticHotelSuggestionReducer,
  intHotelSuggestion: intHotelSuggestionReducer,
  user: userReducer,
  busSuggestion: busSuggestionReducer,
  cabSuggestion: cabSuggestionReducer,
  hotelCountries: hotelCountriesReducer
});
