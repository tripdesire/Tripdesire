import React from "react";
import { Image } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store";
import { PersistGate } from "redux-persist/lib/integration/react";
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
  BusRoundReturn,
  MyAccount,
  Help,
  OTPScreen,
  OTPVerify,
  PaymentCab
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

const LoginStack = createStackNavigator(
  {
    SignIn,
    SignUp,
    OTPScreen,
    OTPVerify,
    ForgetPassword
  },
  {
    headerMode: "none",
    initialRouteName: "SignIn"
  }
);
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
    BusRound,
    SeatOneway,
    SeatRound,
    BoardingOneway,
    BoardingRound,
    BusRoundReturn,
    LoginStack,
    BillingDetails,PaymentCab
  },
  {
    headerMode: "none",
    initialRouteName: "Home"
  }
);

const AuthStack = createStackNavigator(
  {
    MyAccount,
    LoginStack,
    ProfilePage,
    BillingDetails
  },
  {
    headerMode: "none",
    initialRouteName: "MyAccount"
  }
);

const OrderStack = createStackNavigator(
  {
    Order,
    OrderDetails,
    LoginStack
  },
  {
    headerMode: "none",
    initialRouteName: "Order"
  }
);

// const DrawerNavigator = createDrawerNavigator(
//   {
//     HomeStack,
//     OrderStack
//   },
//   {
//     contentComponent: CustomDrawer
//   }
// );

const TabNavigator = createBottomTabNavigator(
  {
    HomeStack: {
      screen: HomeStack,
      //barStyle: { marginBottom: 10 },

      navigationOptions: ({ navigation }) => {
        let { routeName } = navigation.state.routes[navigation.state.index];
        return {
          title: "HOME",
          tabBarVisible: routeName === "Home" ? true : false,
          tabBarIcon: ({ tintColor }) => (
            <Image
              source={require("./src/assets/imgs/home.png")}
              style={{ width: 26, height: 26, tintColor }}
            />
          )
        };
      }
    },
    OrderStack: {
      screen: OrderStack,
      navigationOptions: {
        title: "MY TRIPS",
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("./src/assets/imgs/my_trips_tab.png")}
            style={{ width: 26, height: 26, tintColor }}
          />
        )
      }
    },
    AuthStack: {
      screen: AuthStack,
      navigationOptions: ({ navigation }) => {
        let { routeName } = navigation.state.routes[navigation.state.index];
        return {
          title: "ACCOUNT",
          tabBarVisible: routeName === "MyAccount" ? true : false,
          tabBarIcon: ({ tintColor }) => (
            <Image
              source={require("./src/assets/imgs/my_account.png")}
              style={{ width: 26, height: 26, tintColor }}
            />
          )
        };
      }
    },
    Help: {
      screen: Help,
      navigationOptions: {
        title: "HELP",
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("./src/assets/imgs/help_tab.png")}
            style={{ width: 26, height: 26, tintColor }}
          />
        )
      }
    }
  },
  {
    tabBarOptions: {
      //activeBackgroundColor: "#1E2A48",
      //inactiveBackgroundColor: "#1E2A48",
      activeTintColor: "#FFFFFF",
      inactiveTintColor: "#828E99",
      labelStyle: {
        fontSize: 8
      },
      // tabBarComponent: TabBarComponent
      style: {
        backgroundColor: "#1E2A48",
        //paddingVertical: 12,
        height: 60,
        paddingVertical: 10
      }
    }
    //contentComponent: CustomDrawer
  }
);

const AppNavigator = createSwitchNavigator({
  Splash,
  //HomeStack,
  TabNavigator
});

const AppContainer = createAppContainer(AppNavigator);
export default App;
