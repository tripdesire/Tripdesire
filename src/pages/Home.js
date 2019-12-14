import React from "react";
import { View, Image, SafeAreaView } from "react-native";
import { Button, HomeButtonComponent, Text } from "../../src/components";
import { connect } from "react-redux";
import { DomSugg, IntSugg, DomHotelSugg } from "../store/action";

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],

      isSelect: true
    };
  }

  navigateToScreen = (page, params = {}) => () => {
    this.setState({
      IconcolorFlight: page == "FlightSearch" ? "#5789FF" : "#8898A7",
      IconcolorHotels: page == "Hotel" ? "#5789FF" : "#8898A7",
      IconcolorBus: page == "Bus" ? "#5789FF" : "#8898A7",
      IconcolorCab: page == "Cab" ? "#5789FF" : "#8898A7"
    });
    this.props.navigation.navigate(page);
  };

  render() {
    const { IconcolorFlight, IconcolorHotels, IconcolorBus, IconcolorCab } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
                marginTop: 40
              }}>
              <Text style={{ fontSize: 26, color: "#1B294C", fontWeight: "600" }}>WHERE WOULD</Text>
              <Button onPress={this.props.navigation.openDrawer}>
                <Image style={{ width: 30 }} source={require("../assets/imgs/bar.png")} />
              </Button>
            </View>
            <Text
              style={{
                color: "#5789FF",
                fontSize: 26,
                fontWeight: "600",
                marginHorizontal: 20,
                marginVertical: 5
              }}>
              YOU WANT TO GO?
            </Text>
            <Text style={{ marginHorizontal: 20, color: "#616A71" }}>
              Search Amazing Flights, Hotels, Bus & Cabs
            </Text>
            <Text style={{ marginHorizontal: 20, color: "#616A71" }}>at a good Price.</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 16,
                marginTop: 40
              }}>
              <HomeButtonComponent
                name="Flights"
                tintColor="#8396A5"
                img_name={require("../assets/imgs/flight.png")}
                onPress={this.navigateToScreen("FlightSearch")}
              />
              <HomeButtonComponent
                name="Hotels"
                //tintColor="#5789FF"
                img_name={require("../assets/imgs/Hotel.png")}
                onPress={this.navigateToScreen("Hotel")}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 16
              }}>
              <HomeButtonComponent
                name="Buses"
                //tintColor="#5789FF"
                img_name={require("../assets/imgs/bus.png")}
                onPress={this.navigateToScreen("Bus")}
              />
              <HomeButtonComponent
                name="Cabs"
                //tintColor="#5789FF"
                img_name={require("../assets/imgs/car.png")}
                onPress={this.navigateToScreen("Cab")}
              />
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapDispatchToProps = {
  DomSugg,
  IntSugg,
  DomHotelSugg
};

export default connect(null, mapDispatchToProps)(Home);
