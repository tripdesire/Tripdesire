import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store";
import { TouchableOpacity } from "react-native";
import { PersistGate } from "redux-persist/lib/integration/react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { CustomDrawer, Icon } from "./src/components";
import {
  Home,
  FlightSearch,
  FlightsInfoOneway,
  Hotel,
  Bus,
  Cab,
  HotelInfo,
  BusInfo,
  CheckOut,
  CheckOut1,
  CheckoutBus,
  BusPayment,
  HotelCheckout,
  HotelPayment,
  FlightListRender,
  FlightListInternational,
  FlightsInfoRound,
  Seats,
  RenderDomesticRound,
  RenderInternationRound,
  FlightsInfoRoundInt,
  SignIn,
  SignUp,
  RoomDetails,
  ThankYou,
  Order,
  OrderDetails,
  Filter,
  Payment,
  CabList,
  CheckoutCab,
  ThankYouCab,
  ThankYouBus,
  ThankYouHotel,
  Boarding,
  ForgetPassword,
  ProfilePage,
  BillingDetails,
  BusRound,
  SeatOneway,
  SeatRound,
  BoardingOneway,
  BoardingRound,
  BusRoundReturn
} from "./src/pages";

import Splash from "./src/pages/Splash";

class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}

const HomeStack = createStackNavigator(
  {
    Home,
    FlightSearch,
    FlightsInfoOneway,
    Hotel,
    Bus,
    Cab,
    HotelInfo,
    BusInfo,
    CheckOut,
    CheckOut1,
    CheckoutBus,
    BusPayment,
    HotelCheckout,
    HotelPayment,
    FlightListRender,
    FlightListInternational,
    FlightsInfoRound,
    Seats,
    RenderDomesticRound,
    RenderInternationRound,
    FlightsInfoRoundInt,
    Splash,
    SignIn,
    SignUp,
    RoomDetails,
    ThankYou,
    Filter,
    Payment,
    CabList,
    CheckoutCab,
    ThankYouCab,
    ThankYouBus,
    ThankYouHotel,
    Boarding,
    ForgetPassword,
    ProfilePage,
    BillingDetails,
    BusRound,
    SeatOneway,
    SeatRound,
    BoardingOneway,
    BoardingRound,
    BusRoundReturn
  },
  {
    headerMode: "none",
    initialRouteName: "Home"
  }
);

const OrderStack = createStackNavigator(
  {
    Order,
    OrderDetails
  },
  {
    headerMode: "none",
    initialRouteName: "Order"
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    HomeStack,
    OrderStack
  },
  {
    contentComponent: CustomDrawer
  }
);

const AppNavigator = createSwitchNavigator({
  Splash,
  //HomeStack,
  DrawerNavigator
});

const AppContainer = createAppContainer(AppNavigator);
export default App;
