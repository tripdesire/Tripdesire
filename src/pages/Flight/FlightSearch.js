import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Button, Text } from "../../components";
import DomesticFlights from "./DomesticFlights";
import InternationalFlights from "./InternationalFlights";
import { Header } from "../../components";

class FlightSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      flightType: 1
    };
  }

  setDomesticActive = () => {
    this.setState({ flightType: 1 });
  };
  setInternationalActive = () => {
    this.setState({ flightType: 2 });
  };

  render() {
    const { flightType } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E4EAF6" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ backgroundColor: "#E4EAF6", flex: 1 }}>
              <Header firstName="Flights" lastName="Search" />
            </View>

            <View style={{ height: 30, width: "100%" }}>
              <View style={{ flex: 2, backgroundColor: "#E4EAF6" }}></View>
              <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  ...StyleSheet.absoluteFill
                }}>
                <Button
                  style={{
                    backgroundColor: flightType == 1 ? "#5B89F9" : "#FFFFFF",
                    borderBottomStartRadius: 5,
                    borderTopStartRadius: 5,
                    ...styles.tabButtons
                  }}
                  onPress={this.setDomesticActive}>
                  <Text style={{ color: flightType == 1 ? "#FFFFFF" : "#000000", fontSize: 12 }}>
                    Domestic
                  </Text>
                </Button>
                <Button
                  style={{
                    borderBottomEndRadius: 5,
                    borderTopEndRadius: 5,
                    backgroundColor: flightType == 2 ? "#5B89F9" : "#FFFFFF",
                    ...styles.tabButtons
                  }}
                  onPress={this.setInternationalActive}>
                  <Text style={{ fontSize: 12, color: flightType == 2 ? "#FFFFFF" : "#000000" }}>
                    International
                  </Text>
                </Button>
              </View>
            </View>
            <View style={{ backgroundColor: "#FFFFFF", flex: 4 }}>
              {flightType == 1 ? <DomesticFlights /> : <InternationalFlights />}
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  tabButtons: {
    elevation: 1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    height: 30,
    justifyContent: "center",
    paddingHorizontal: 50
  }
});

export default FlightSearch;
