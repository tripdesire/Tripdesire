import {
  DOMESTIC_SUGGESTION,
  INTERNATIONAL_SUGGESTION,
  DOMESTIC_HOTEL_SUGGESTION,
  INTERNATIONAL_HOTEL_SUGGESTION,
  HOTEL_COUNTRY_SUGGESTION,
  SIGN_IN,
  SIGN_UP,
  BUS_SUGGESTION,
  CAB_SUGGESTION,
  LOGOUT,
  BILLING,
  UPDATE_PROFILE
} from "./actionTypes";

export const DomSugg = data => {
  return {
    type: DOMESTIC_SUGGESTION,
    payload: data
  };
};

export const IntSugg = data => {
  return {
    type: INTERNATIONAL_SUGGESTION,
    payload: data
  };
};

export const DomHotelSugg = data => {
  return {
    type: DOMESTIC_HOTEL_SUGGESTION,
    payload: data
  };
};
export const hotelCountrySugg = data => {
  return {
    type: HOTEL_COUNTRY_SUGGESTION,
    payload: data
  };
};
export const intHotelSugg = data => {
  return {
    type: INTERNATIONAL_HOTEL_SUGGESTION,
    payload: data
  };
};

export const Signup = data => {
  return {
    type: SIGN_UP,
    payload: data
  };
};

export const Signin = data => {
  return {
    type: SIGN_IN,
    payload: data
  };
};

export const BusSugg = data => {
  return {
    type: BUS_SUGGESTION,
    payload: data
  };
};

export const CabSugg = data => {
  return {
    type: CAB_SUGGESTION,
    payload: data
  };
};

export const Logout = data => {
  return {
    type: LOGOUT,
    payload: data
  };
};

export const Billing = data => {
  return {
    type: BILLING,
    payload: data
  };
};

export const UpdateProfile = data => {
  return {
    type: UPDATE_PROFILE,
    payload: data
  };
};
