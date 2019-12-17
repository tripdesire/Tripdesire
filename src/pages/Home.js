import React from "react";
import { View, Image, SafeAreaView } from "react-native";
import { Button, HomeButtonComponent, Text } from "../../src/components";

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      isSelect: true
    };
  }

  navigateToScreen = (page, params = {}) => () => {
    this.props.navigation.navigate(page);
  };

  render() {
    const { IconcolorFlight, IconcolorHotels, IconcolorBus, IconcolorCab } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <Text
              style={{
                fontSize: 28,
                color: "#1B294C",
                fontWeight: "600",
                marginHorizontal: 20,
                marginTop: 50,
                lineHeight: 34
              }}>
              WHERE WOULD
            </Text>
            <Text
              style={{
                color: "#5789FF",
                fontSize: 36,
                lineHeight: 40,
                fontWeight: "700",
                marginHorizontal: 20
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
                tintColor={"#616A71"}
                name="Flights"
                img_name={require("../assets/imgs/flight.png")}
                onPress={this.navigateToScreen("FlightSearch")}
              />
              <HomeButtonComponent
                name="Hotels"
                tintColor={"#616A71"}
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
                tintColor={"#616A71"}
                img_name={require("../assets/imgs/bus.png")}
                onPress={this.navigateToScreen("Bus")}
              />
              <HomeButtonComponent
                name="Cabs"
                tintColor={"#616A71"}
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

export default Home;
