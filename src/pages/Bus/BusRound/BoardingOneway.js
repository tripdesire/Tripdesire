import React, { PureComponent } from "react";
import { View, SafeAreaView } from "react-native";
import { Button, Text, Header } from "../../../components";
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
      boardingpoints: params.BoardingTimes.map(item => {
        let time = moment()
          .startOf("day")
          .add(item.Time, "minutes")
          .format("hh:mm a");
        return {
          value: item,
          label: item.Location + " (" + item.Landmark + ") " + time //rhours + ":" + rminutes
        };
      }),
      droppingpoints: params.DroppingTimes.map(item => {
        let time = moment()
          .startOf("day")
          .add(item.Time, "minutes")
          .format("hh:mm a");
        return {
          value: item,
          label: item.Location + " (" + item.Landmark + ") " + time
        };
      })
    };
  }

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
        <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <Header firstName="Select Boarding and Selected Point" />
            <View style={{ marginTop: 40 }}>
              <View style={{ paddingStart: 20, marginHorizontal: 16 }}>
                <Text style={{ color: "#5D666D" }}>--Boarding Points--</Text>
                <RNPickerSelect
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
                  value={bp}
                  style={{
                    inputAndroidContainer: { height: 40 },
                    inputAndroid: { paddingStart: 0, color: "#000" },
                    iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                  }}
                  onValueChange={itemValue => this.setState({ bp: itemValue })}
                  items={boardingpoints}
                  Icon={() => <Icon name="ios-arrow-down" size={20} />}
                />
              </View>
              <View style={{ paddingStart: 20, marginTop: 40, marginHorizontal: 16 }}>
                <Text style={{ color: "#5D666D" }}>--Dropping Points--</Text>
                <RNPickerSelect
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
                  value={dp}
                  style={{
                    inputAndroidContainer: { height: 40 },
                    inputAndroid: { paddingStart: 0, color: "#000" },
                    iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                  }}
                  onValueChange={itemValue => this.setState({ dp: itemValue })}
                  items={droppingpoints}
                  Icon={() => <Icon name="ios-arrow-down" size={20} />}
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
                marginVertical: 16
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
