import React from "react";
import { Image, StyleSheet } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store";
import { PersistGate } from "redux-persist/lib/integration/react";
import { CustomDrawer, Icon } from "./src/components";
import { HotelThankYou, BusThankYou, CabThankYou, FlightThankYou } from "./src/components";
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
  PaymentCab,
  Wallet,
  ReferAndEarn
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
    BillingDetails,
    PaymentCab,
    Wallet,
    ReferAndEarn
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
    BillingDetails,
    Wallet,
    ReferAndEarn
  },
  {
    headerMode: "none",
    initialRouteName: "MyAccount"
  }
);

const OrderStack = createStackNavigator(
  {
    Order,
    HotelThankYou,
    BusThankYou,
    CabThankYou,
    FlightThankYou,
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
              source={require("./src/assets/imgs/HomeNew.png")}
              style={[styles.tabBarImg, { tintColor }]}
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
            source={require("./src/assets/imgs/bagNew.png")}
            style={[styles.tabBarImg, { tintColor }]}
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
              style={[styles.tabBarImg, { tintColor }]}
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
            source={require("./src/assets/imgs/HelpNew.png")}
            style={[styles.tabBarImg, { tintColor }]}
          />
        )
      }
    }
  },
  {
    tabBarOptions: {
      //activeBackgroundColor: "#1E2A48",
      //inactiveBackgroundColor: "#1E2A48",
      activeTintColor: "#5789FF",
      inactiveTintColor: "#616A71",
      labelStyle: {
        fontSize: 8,
        fontWeight: "600"
      },
      // tabBarComponent: TabBarComponent
      style: {
        backgroundColor: "#ffffff",
        height: 42,
        paddingVertical: 2
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

const styles = StyleSheet.create({
  tabBarImg: {
    width: 20,
    height: 20
  }
});

export default App;
