import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { Button, Text, LinearGradient } from "../../components";
import DomesticFlights from "./DomesticFlights";
import InternationalFlights from "./InternationalFlights";
import { Header } from "../../components";
import analytics from "@react-native-firebase/analytics";

class FlightSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    const { item } = this.props.navigation.state.params;
    this.state = {
      flightType: item ? item.flightType : 1
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Flight Search");
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
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ backgroundColor: "#E4EAF6", height: 72 }}>
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
                <LinearGradient
                  colors={flightType == 1 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                  style={{
                    ...styles.shadowAndElevation,
                    borderBottomLeftRadius: 5,
                    borderTopLeftRadius: 5
                  }}>
                  <Button
                    style={{
                      ...styles.shadowAndElevation,
                      borderBottomStartRadius: 5,
                      borderTopStartRadius: 5,
                      ...styles.tabButtons
                    }}
                    onPress={this.setDomesticActive}>
                    <Text
                      style={{
                        color: flightType == 1 ? "#FFFFFF" : "#000000",
                        fontSize: 16,
                        fontWeight: "600"
                      }}>
                      Domestic
                    </Text>
                  </Button>
                </LinearGradient>
                <LinearGradient
                  colors={flightType == 2 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                  style={{
                    ...styles.shadowAndElevation,
                    borderBottomRightRadius: 5,
                    borderTopRightRadius: 5
                  }}>
                  <Button
                    style={{
                      ...styles.shadowAndElevation,
                      borderBottomEndRadius: 5,
                      borderTopEndRadius: 5,
                      ...styles.tabButtons
                    }}
                    onPress={this.setInternationalActive}>
                    <Text
                      style={{
                        color: flightType == 2 ? "#FFFFFF" : "#000000",
                        fontSize: 16,
                        fontWeight: "600"
                      }}>
                      International
                    </Text>
                  </Button>
                </LinearGradient>
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
    paddingHorizontal: 30
  },
  shadowAndElevation: {
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    shadowRadius: 4
  }
});

export default FlightSearch;
