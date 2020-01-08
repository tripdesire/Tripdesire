import React, { PureComponent } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { Button, Text, Header, RNPicker } from "../../components";
import moment from "moment";

class Boarding extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    const { params } = props.navigation.state.params;
    this.state = {
      loader: false,
      bp: params.BoardingTimes[0],
      dp: params.DroppingTimes[0],
      boardingpoints: params.BoardingTimes,
      droppingpoints: params.DroppingTimes
    };
  }

  _bookNow = () => {
    const { TripType } = this.props.navigation.state.params;
    if (TripType == 1) {
      const { bp, dp } = this.state;
      this.props.navigation.navigate("CheckoutBus", {
        ...this.props.navigation.state.params,
        BoardingPoint: bp,
        DroppingPoint: dp
      });
    } else {
      this.props.navigation.navigate("BusRound");
    }
  };

  getLabel = item => {
    let time = moment()
      .startOf("day")
      .add(item.Time, "minutes")
      .format("hh:mm a");
    return item.Location + " (" + item.Landmark + ") " + time; //rhours + ":" + rminutes
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
                <Text style={{ color: "#5D666D" }}>--Boarding Points--</Text>
                <RNPicker
                  value={bp}
                  items={boardingpoints}
                  getLabel={this.getLabel}
                  fieldContainerStyle={{ height: 100 }}
                  onItemChange={itemValue => this.setState({ bp: itemValue })}
                />
              </View>
              <View style={{ marginHorizontal: 16 }}>
                <Text style={{ color: "#5D666D" }}>--Dropping Points--</Text>
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
                marginTop: 80
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

export default Boarding;
