import React, { PureComponent } from "react";
import { View, SafeAreaView } from "react-native";
import { Button, Text, Header } from "../../../components";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import { domainApi } from "../../../service";
import Toast from "react-native-simple-toast";

class BoardingRound extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    const { paramsRound } = props.navigation.state.params;
    this.state = {
      bp: paramsRound.BoardingTimes[0],
      dp: paramsRound.DroppingTimes[0],
      boardingpoints: paramsRound.BoardingTimes.map(item => {
        let time = moment()
          .startOf("day")
          .add(item.Time, "minutes")
          .format("hh:mm a");
        return {
          value: item,
          label: item.Location + " (" + item.Landmark + ") " + time //rhours + ":" + rminutes
        };
      }),
      droppingpoints: paramsRound.DroppingTimes.map(item => {
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
      paramsRound,
      sourceName,
      destinationName,
      tripType,
      selectedSheets,
      selectedSheetsRound
    } = this.props.navigation.state.params;
    console.log(params, selectedSheets, selectedSheetsRound);

    let Seats = [...selectedSheets.map(item => item.Number)].join("~");
    let SeatsRound = [...selectedSheetsRound.map(item => item.Number)].join("~");
    let param = {
      id: 273,
      quantity: 1,
      bus_item_result_data: params,
      return_bus_item_result_data: paramsRound,
      display_name: params.DisplayName,
      bus_type: params.BusType,
      departure_time: params.DepartureTime,
      arrival_time: params.ArrivalTime,
      source_city: sourceName,
      source_id: params.SourceId,
      destination_city: destinationName,
      destination_id: params.DestinationId,
      boarding_point: params.SourceId + ";" + sourceName,
      dropping_point: params.DestinationId + ";" + destinationName,
      time_duration: params.Duration,
      select_seat: selectedSheets.length,
      select_seat_number: Seats,
      base_fare: params.Fares,
      service_charge: params.OperatorServiceCharge,
      service_tax: params.ServiceTax,
      ConvenienceFee: params.ConvenienceFee,
      trip_type: tripType,
      journey_date: moment(params.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY"),

      return_display_name: paramsRound.DisplayName, ////Return
      return_bus_type: paramsRound.BusType,
      return_departure_time: paramsRound.DepartureTime,
      return_arrival_time: params.ArrivalTime,
      return_source_city: destinationName,
      return_source_id: paramsRound.SourceId,
      return_destination_city: destinationName,
      return_destination_id: paramsRound.DestinationId,
      return_boarding_point: paramsRound.SourceId + ";" + sourceName,
      return_dropping_point: paramsRound.DestinationId + ";" + destinationName,
      return_time_duration: paramsRound.Duration,
      return_select_seat: selectedSheetsRound.length,
      return_select_seat_number: SeatsRound,
      return_base_fare: paramsRound.Fares,
      return_service_charge: paramsRound.OperatorServiceCharge,
      return_service_tax: paramsRound.ServiceTax,
      return_ConvenienceFee: paramsRound.ConvenienceFee,
      return_trip_type: tripType,
      return_journey_date: moment(paramsRound.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")
    };

    console.log(param);
    // this.props.navigation.navigate("CheckoutBus", {
    //   // cartData: data,
    //   ...this.props.navigation.state.params,
    //   BoardingPointReturn: this.state.bp,
    //   DroppingPointReturn: this.state.dp
    // });
    //return;

    domainApi
      .post("/cart/add", param)
      .then(({ data }) => {
        console.log(data);
        if (data.code == "1") {
          //Toast.show(data.message, Toast.LONG);
          domainApi.get("/cart").then(({ data }) => {
            console.log(data);
            const { bp, dp } = this.state;
            this.props.navigation.navigate("CheckoutBus", {
              cartData: data,
              ...this.props.navigation.state.params,
              BoardingPointReturn: bp,
              DroppingPointReturn: dp
            });
          });
        } else {
          Toast.show(res.data.message, Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
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
              <View style={{ paddingStart: 20 }}>
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
              <View style={{ paddingStart: 20, marginTop: 40 }}>
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

export default BoardingRound;
