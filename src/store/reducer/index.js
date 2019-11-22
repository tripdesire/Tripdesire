import { combineReducers } from "redux";
import { domesticSuggestionReducer } from "./domesticSuggestionReducer";
import { internationalSuggestionReducer } from "./internationalSuggestionReducer";
import { domesticHotelSuggestionReducer } from "./domesticHotelSuggestionReducer";
import { signInReducer } from "./signInReducer";
import { signUpReducer } from "./signUpReducer";
import { busSuggestionReducer } from "./busSuggestionReducer";
import {cabSuggestionReducer} from "./cabSuggestionReducer";

export default combineReducers({
  domesticSuggestion: domesticSuggestionReducer,
  internationalSuggestion: internationalSuggestionReducer,
  domesticHotelSuggestion: domesticHotelSuggestionReducer,
  signIn: signInReducer,
  signUp: signUpReducer,
  busSuggestion: busSuggestionReducer,
  cabSuggestion:cabSuggestionReducer
});
