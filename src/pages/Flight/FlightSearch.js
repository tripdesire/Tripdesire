import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Picker,
  ScrollView,
  Modal
} from "react-native";
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
      flightType: 1,
      backgroundColor_domestic: "#5B89F9",
      Button_text_color_domestic: "#FFFFFF",
      Button_text_color_international: "#000000",
      backgroundColor_international: "#FFFFFF"
    };
  }

  _SelectFlightType = value => {
    this.setState({
      backgroundColor_domestic: value == "domestic" ? "#5B89F9" : "#FFFFFF",
      backgroundColor_international: value == "domestic" ? "#FFFFFF" : "#5B89F9",
      Button_text_color_domestic: value == "domestic" ? "#ffffff" : "#000000",
      Button_text_color_international: value == "domestic" ? "#000000" : "#ffffff",
      flightType: value == "domestic" ? 1 : 2
    });
  };

  render() {
    const {
      backgroundColor_domestic,
      backgroundColor_international,
      Button_text_color_domestic,
      Button_text_color_international,
      flightType
    } = this.state;
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <View style={{ backgroundColor: "#E4EAF6", flex: 1 }}>
          <Header firstName="Flights" lastName="Search" />
        </View>

        <View style={{ height: 30, width: "100%" }}>
          <View style={{ flex: 2, backgroundColor: "#E4EAF6" }}></View>
          <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}></View>
          <View
            style={{ flexDirection: "row", justifyContent: "center", ...StyleSheet.absoluteFill }}>
            <Button
              style={{
                backgroundColor: backgroundColor_domestic,
                elevation: 1,
                borderWidth: 1,
                borderColor: "#DDDDDD",
                height: 30,
                justifyContent: "center",
                paddingHorizontal: 50,
                borderBottomStartRadius: 5,
                borderTopStartRadius: 5
              }}
              onPress={() => this._SelectFlightType("domestic")}>
              <Text style={{ color: Button_text_color_domestic, fontSize: 12 }}>Domestic</Text>
            </Button>
            <Button
              style={{
                backgroundColor: backgroundColor_international,
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
              onPress={() => this._SelectFlightType("international")}>
              <Text style={{ fontSize: 12, color: Button_text_color_international }}>
                International
              </Text>
            </Button>
          </View>
        </View>
        <View style={{ elevation: 1, backgroundColor: "#FFFFFF", flex: 4 }}>
          {flightType == 1 && <DomesticFlights />}
          {flightType == 2 && <InternationalFlights />}
        </View>
      </View>
    );
  }
}

export default FlightSearch;
