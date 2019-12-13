import { combineReducers } from "redux";
import { domesticSuggestionReducer } from "./domesticSuggestionReducer";
import { internationalSuggestionReducer } from "./internationalSuggestionReducer";
import { domesticHotelSuggestionReducer } from "./domesticHotelSuggestionReducer";
import { signInReducer } from "./signInReducer";
import { signUpReducer } from "./signUpReducer";
import { busSuggestionReducer } from "./busSuggestionReducer";
import { cabSuggestionReducer } from "./cabSuggestionReducer";
import { intHotelSuggestionReducer } from "./intHotelSuggestionReducer";
import { hotelCountriesReducer } from "./hotelCountriesReducer";

export default combineReducers({
  domesticSuggestion: domesticSuggestionReducer,
  internationalSuggestion: internationalSuggestionReducer,
  domesticHotelSuggestion: domesticHotelSuggestionReducer,
  intHotelSuggestion: intHotelSuggestionReducer,
  signIn: signInReducer,
  signUp: signUpReducer,
  busSuggestion: busSuggestionReducer,
  cabSuggestion: cabSuggestionReducer,
  hotelCountries: hotelCountriesReducer
});
