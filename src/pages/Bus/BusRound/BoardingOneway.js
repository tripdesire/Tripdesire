import React, { PureComponent } from "react";
import { View, SafeAreaView } from "react-native";
import { Button, Text, Header, RNPicker } from "../../../components";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";

class BoardingOneway extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    const { params } = props.navigation.state.params;
    this.state = {
      bp: params.BoardingTimes[0],
      dp: params.DroppingTimes[0],
      boardingpoints: params.BoardingTimes,
      droppingpoints: params.DroppingTimes
    };
  }

  getLabel = item => {
    let time = moment()
      .startOf("day")
      .add(item.Time, "minutes")
      .format("hh:mm a");
    return item.Location + " (" + item.Landmark + ") " + time; //rhours + ":" + rminutes
  };

  _bookNow = () => {
    const {
      params,
      sourceName,
      destinationName,
      tripType,
      TripType,
      selectedSheets
    } = this.props.navigation.state.params;
    console.log(params, selectedSheets);

    const { bp, dp } = this.state;

    this.props.navigation.navigate("BusRoundReturn", {
      ...this.props.navigation.state.params,
      BoardingPoint: bp,
      DroppingPoint: dp
    });
  };

  render() {
    const { boardingpoints, droppingpoints, bp, dp } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View style={{ backgroundColor: "#E5EBF7" }}>
              <Header firstName="Select Boarding and Dropping Point" />
            </View>
            <View style={{ marginTop: 40 }}>
              <View style={{ marginHorizontal: 16 }}>
                <Text style={{ color: "#5D666D" }}>-- Boarding Points --</Text>

                <RNPicker
                  value={bp}
                  items={boardingpoints}
                  getLabel={this.getLabel}
                  fieldContainerStyle={{ height: 100 }}
                  onItemChange={itemValue => this.setState({ bp: itemValue })}
                />
              </View>
              <View style={{ marginHorizontal: 16 }}>
                <Text style={{ color: "#5D666D" }}>-- Dropping Points --</Text>

                <RNPicker
                  value={dp}
                  items={droppingpoints}
                  getLabel={this.getLabel}
                  fieldContainerStyle={{ height: 100 }}
                  onItemChange={itemValue => this.setState({ dp: itemValue })}
                />
              </View>
            </View>
            <Button
              style={{
                backgroundColor: "#F68E1F",
                marginHorizontal: 100,
                height: 40,
                justifyContent: "center",
                borderRadius: 20,
                marginVertical: 16,
                marginTop: 120
              }}
              onPress={this._bookNow}>
              <Text style={{ color: "#fff", alignSelf: "center" }}>Book Now</Text>
            </Button>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default BoardingOneway;
