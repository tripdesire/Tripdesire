import React, { PureComponent } from "react";
import { View, SafeAreaView } from "react-native";
import { Button, Text, Header } from "../../components";
import Icon from "react-native-vector-icons/Ionicons";
import { domainApi } from "../../service";
import moment from "moment";
import Toast from "react-native-simple-toast";
import RNPickerSelect from "react-native-picker-select";

class Boarding extends React.PureComponent {
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

    let Seats = [...selectedSheets.map(item => item.Number)].join("~");
    let param = {
      id: 273,
      quantity: 1,
      bus_item_result_data: params,
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
      service_charge: params.etravosApiTax,
      service_tax: 0,
      ConvenienceFee: params.ConvenienceFee,
      trip_type: tripType,
      journey_date: moment(params.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")
    };

    console.log(param);

    if (TripType == 1) {
      domainApi
        .post("/cart/add", param)
        .then(({ data }) => {
          console.log(data);
          if (data.code == "1") {
            Toast.show(data.message, Toast.LONG);
            domainApi.get("/cart").then(({ data }) => {
              console.log(data);
              const { bp, dp } = this.state;
              this.props.navigation.navigate("CheckoutBus", {
                cartData: data,
                ...this.props.navigation.state.params,
                BoardingPoint: bp,
                DroppingPoint: dp
              });
            });
          } else {
            Toast.show(res.data.message, Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.props.navigation.navigate("BusRound");
    }
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
                    inputAndroidContainer: { height: 35 },
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
                    inputAndroidContainer: { height: 35 },
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

export default Boarding;
