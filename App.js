import React from "react";
import { Image } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator, BottomTabBar } from "react-navigation-tabs";
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
  Help
} from "./src/pages";

import Splash from "./src/pages/Splash";

function TabBarComponent(props) {
  return (
    <View>
      <BottomTabBar {...props} style={{ backgroundColor: "#1E2A48" }} />
    </View>
  );
}

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

const AuthStack = createStackNavigator(
  {
    MyAccount
  },
  {
    headerMode: "none",
    initialRouteName: "MyAccount"
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

const TabNavigator = createBottomTabNavigator(
  {
    HomeStack: {
      screen: HomeStack,
      navigationOptions: {
        title: "Home",
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("./src/assets/imgs/home.png")}
            tintColor={tintColor}
            style={{ width: 24, height: 24 }}
          />
        )
      }
    },
    OrderStack: {
      screen: OrderStack,
      navigationOptions: {
        title: "My Trips",
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("./src/assets/imgs/my_trips_tab.png")}
            tintColor={tintColor}
            style={{ width: 24, height: 24 }}
          />
        )
      }
    },
    AuthStack: {
      screen: AuthStack,
      navigationOptions: {
        title: "My Account",
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("./src/assets/imgs/my_account.png")}
            tintColor={tintColor}
            style={{ width: 24, height: 24 }}
          />
        )
      }
    },
    Help: {
      screen: Help,
      navigationOptions: {
        title: "Help",
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("./src/assets/imgs/help_tab.png")}
            tintColor={tintColor}
            style={{ width: 24, height: 24 }}
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
      // tabBarComponent: TabBarComponent
      style: {
        backgroundColor: "#1E2A48"
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
