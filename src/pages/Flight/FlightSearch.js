import React, { PureComponent } from "react";
import { View, Image, StyleSheet, SafeAreaView } from "react-native";
import { Button, Text } from "../../components";
import DomesticFlights from "./DomesticFlights";
import InternationalFlights from "./InternationalFlights";
import Service from "../../service";
import Autocomplete from "react-native-autocomplete-input";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Header } from "../../components";
import Icon from "react-native-vector-icons/Ionicons";

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
        <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
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
                    elevation: 1,
                    borderWidth: 1,
                    borderColor: "#DDDDDD",
                    height: 30,
                    justifyContent: "center",
                    paddingHorizontal: 50,
                    borderBottomStartRadius: 5,
                    borderTopStartRadius: 5
                  }}
                  onPress={this.setDomesticActive}>
                  <Text style={{ color: flightType == 1 ? "#FFFFFF" : "#000000", fontSize: 12 }}>
                    Domestic
                  </Text>
                </Button>
                <Button
                  style={{
                    backgroundColor: flightType == 2 ? "#5B89F9" : "#FFFFFF",
                    elevation: 1,
                    height: 30,
                    borderEndWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#DDDDDD",
                    justifyContent: "center",
                    paddingHorizontal: 50,
                    borderBottomEndRadius: 5,
                    borderTopEndRadius: 5
                  }}
                  onPress={this.setInternationalActive}>
                  <Text style={{ fontSize: 12, color: flightType == 2 ? "#FFFFFF" : "#000000" }}>
                    International
                  </Text>
                </Button>
              </View>
            </View>
            <View style={{ backgroundColor: "#FFFFFF", flex: 4 }}>
              {flightType == 1 && <DomesticFlights />}
              {flightType == 2 && <InternationalFlights />}
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default FlightSearch;
