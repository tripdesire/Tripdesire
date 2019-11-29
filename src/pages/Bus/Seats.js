import React, {PureComponent} from "react";
import {Dimensions, Image, StyleSheet, View, FlatList} from "react-native";
import {createMaterialTopTabNavigator} from "react-navigation-tabs";
import {ScrollView} from "react-native-gesture-handler";
import LowerSeats from "./LowerSeats";
import {Button, Text, AutoCompleteModal} from "../../components";
import moment from "moment";
import axios from "axios";
import Toast from "react-native-simple-toast";

class Seats extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      columns: [],
      seats: [
        {
          Column: 1,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "1",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 2,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "False",
          IsLadiesSeat: "True",
          Length: 1,
          Number: "2",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 3,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "True",
          Length: 1,
          Number: "3",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 4,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "4",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 5,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "5",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 6,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "6",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 7,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "7",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 8,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "8",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 9,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "False",
          IsLadiesSeat: "True",
          Length: 1,
          Number: "9",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 10,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "10",
          Row: 1,
          Width: 2,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 1,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "11",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 2,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "False",
          IsLadiesSeat: "True",
          Length: 1,
          Number: "12",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 3,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "13",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 4,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "False",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "14",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 5,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "15",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 6,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "16",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 7,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "17",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 8,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "18",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 9,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "19",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 10,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "20",
          Row: 2,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 10,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "41",
          Row: 3,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 1,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "21",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 2,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "22",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 3,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "23",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 4,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "24",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 5,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "25",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 6,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "26",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 7,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "27",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 8,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "28",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 9,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "29",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 10,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "30",
          Row: 4,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 1,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "31",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 2,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "32",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 3,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "33",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 4,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "34",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 5,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "35",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 6,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "36",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 7,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "37",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 8,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "38",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 9,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "39",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        },
        {
          Column: 10,
          Fare: "500",
          NetFare: "500",
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
          Length: 1,
          Number: "40",
          Row: 5,
          Width: 1,
          Zindex: 0,
          Servicetax: "75",
          OperatorServiceCharge: "10.00",
          SeatCode: null,
          BookingFee: 0,
          TollFee: 0,
          LevyFare: 0,
          SrtFee: 0
        }
      ]
    };
  }

  _backgroundColor = color => {
    if (color.IsAvailableSeat == "False") {
      return "#32CD32";
    } else if (color.IsLadiesSeat == "True") {
      return "#E6397F";
    }
  };

  _backgroundColorHorizontal = color => {
    if (color.IsAvailableSeat == "False") {
      return "#32CD32";
    }
  };

  componentDidMount() {
    ///  console.log(this.props.navigation.state.params);
  }

  _bookNow = () => {
    const {params, sourceName, destinationName, tripType} = this.props.navigation.state.params;
    console.log(params);
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
      select_seat: 1,
      select_seat_number: 20,
      base_fare: params.Fares,
      service_charge: params.ServiceTax,
      service_tax: 0,
      ConvenienceFee: params.ConvenienceFee,
      trip_type: tripType,
      journey_date: moment(params.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")
    };

    console.log(param);

    axios
      .post("https://demo66.tutiixx.com/wp-json/wc/v2/cart/add", param)
      .then(({data}) => {
        console.log(data);
        if (data.code == "1") {
          Toast.show(data.message, Toast.LONG);
          axios.get("https://demo66.tutiixx.com/wp-json/wc/v2/cart").then(({data}) => {
            console.log(data);
            this.props.navigation.navigate("CheckoutBus", {
              cartData: data,
              params,
              sourceName,
              destinationName
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
    const {rows, columns, seats} = this.state;
    return (
      <ScrollView contentContainerStyle={{}}>
        <Button
          style={{
            backgroundColor: "#F68E1F",
            marginHorizontal: 100,
            height: 40,
            justifyContent: "center",
            borderRadius: 20,
            marginVertical: 40
          }}
          onPress={this._bookNow}>
          <Text style={{color: "#fff", alignSelf: "center"}}>Book Now</Text>
        </Button>
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "space-between",
            flex: 1,
            marginHorizontal: 16
          }}>
          <View style={{alignItems: "center"}}>
            <View
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "black",
                marginHorizontal: 10,
                width: 45,
                height: 45
              }}>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View
                  style={{
                    borderColor: "black",
                    borderRadius: 5,
                    backgroundColor: "black",
                    borderWidth: 1,
                    height: 30,
                    width: 6,
                    paddingVertical: 4,
                    marginTop: 15,
                    marginStart: -3
                  }}></View>
                <View
                  style={{
                    borderColor: "black",
                    borderRadius: 5,
                    backgroundColor: "black",
                    borderWidth: 1,
                    height: 30,
                    width: 6,
                    paddingVertical: 4,
                    marginTop: 15,
                    marginEnd: -3
                  }}></View>
              </View>
              <View
                style={{
                  borderColor: "black",
                  borderRadius: 5,
                  backgroundColor: "black",
                  borderWidth: 1,
                  height: 6,
                  width: 45,
                  marginTop: -5,
                  paddingHorizontal: 4
                }}></View>
            </View>
            <Text style={{fontSize: 12}}>Seater</Text>
          </View>

          <View style={{alignItems: "center"}}>
            <View
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "black",
                backgroundColor: "#32CD32",
                marginHorizontal: 10,
                width: 45,
                height: 45
              }}>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View
                  style={{
                    borderColor: "black",
                    borderRadius: 5,
                    backgroundColor: "black",
                    borderWidth: 1,
                    height: 30,
                    width: 6,
                    paddingVertical: 4,
                    marginTop: 15,
                    marginStart: -3
                  }}></View>
                <View
                  style={{
                    borderColor: "black",
                    borderRadius: 5,
                    backgroundColor: "black",
                    borderWidth: 1,
                    height: 30,
                    width: 6,
                    paddingVertical: 4,
                    marginTop: 15,
                    marginEnd: -3
                  }}></View>
              </View>
              <View
                style={{
                  borderColor: "black",
                  borderRadius: 5,
                  backgroundColor: "black",
                  borderWidth: 1,
                  height: 6,
                  width: 45,
                  marginTop: -5,
                  paddingHorizontal: 4
                }}></View>
            </View>
            <Text style={{fontSize: 12}}>Selected Seat</Text>
          </View>

          <View style={{alignItems: "center"}}>
            <View
              style={{
                borderRadius: 2,
                borderColor: "#000000",
                borderWidth: 1,
                paddingHorizontal: 8
              }}>
              <Text style={{paddingHorizontal: 10, paddingVertical: 20}}></Text>
              <View
                style={{
                  borderRadius: 2,
                  borderColor: "#000000",
                  borderWidth: 1,
                  marginHorizontal: 1,
                  marginVertical: 5,
                  paddingHorizontal: 2,
                  paddingVertical: 2
                }}></View>
            </View>
            <Text style={{fontSize: 12}}>Sleeper</Text>
          </View>

          <View style={{alignItems: "center"}}>
            <View
              style={{
                borderRadius: 2,
                borderColor: "#000000",
                borderWidth: 1,
                marginStart: 5,
                width: 90,
                height: 45
              }}>
              <View
                style={{
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 2,
                  width: 2,
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  paddingVertical: 16,
                  paddingHorizontal: 2,
                  marginStart: 4,
                  marginVertical: 4
                }}></View>
            </View>
            <Text style={{fontSize: 12}}>Slepper</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "space-around",
            flex: 1,
            marginHorizontal: 16
          }}>
          <View style={{alignItems: "center"}}>
            <View
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "black",
                marginHorizontal: 10,
                backgroundColor: "grey",
                width: 45,
                height: 45
              }}>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View
                  style={{
                    borderColor: "black",
                    borderRadius: 5,
                    backgroundColor: "black",
                    borderWidth: 1,
                    height: 30,
                    width: 6,
                    paddingVertical: 4,
                    marginTop: 15,
                    marginStart: -3
                  }}></View>
                <View
                  style={{
                    borderColor: "black",
                    borderRadius: 5,
                    backgroundColor: "black",
                    borderWidth: 1,
                    height: 30,
                    width: 6,
                    paddingVertical: 4,
                    marginTop: 15,
                    marginEnd: -3
                  }}></View>
              </View>
              <View
                style={{
                  borderColor: "black",
                  borderRadius: 5,
                  backgroundColor: "black",
                  borderWidth: 1,
                  height: 6,
                  width: 45,
                  marginTop: -5,
                  paddingHorizontal: 4
                }}></View>
            </View>
            <Text style={{fontSize: 12}}>Booked</Text>
          </View>

          <View style={{alignItems: "center"}}>
            <View
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "black",
                marginHorizontal: 10,
                backgroundColor: "#E6397F",
                width: 45,
                height: 45
              }}>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View
                  style={{
                    borderColor: "black",
                    borderRadius: 5,
                    backgroundColor: "black",
                    borderWidth: 1,
                    height: 30,
                    width: 6,
                    paddingVertical: 4,
                    marginTop: 15,
                    marginStart: -3
                  }}></View>
                <View
                  style={{
                    borderColor: "black",
                    borderRadius: 5,
                    backgroundColor: "black",
                    borderWidth: 1,
                    height: 30,
                    width: 6,
                    paddingVertical: 4,
                    marginTop: 15,
                    marginEnd: -3
                  }}></View>
              </View>
              <View
                style={{
                  borderColor: "black",
                  borderRadius: 5,
                  backgroundColor: "black",
                  borderWidth: 1,
                  height: 6,
                  width: 45,
                  marginTop: -5,
                  paddingHorizontal: 4
                }}></View>
            </View>
            <Text style={{fontSize: 12}}>Female</Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderWidth: 1,
            marginVertical: 30,
            marginHorizontal: 40,
            padding: 10,
            borderRadius: 5,
            borderColor: "black"
          }}>
          <View>
            {seats.map(
              (x, i) =>
                x.Row == 1 &&
                (x.Column == 1 ||
                  x.Column == 2 ||
                  x.Column == 3 ||
                  x.Column == 4 ||
                  x.Column == 5 ||
                  x.Column == 6 ||
                  x.Column == 7 ||
                  x.Column == 8 ||
                  x.Column == 9 ||
                  x.Column == 10) &&
                x.Length == 1 &&
                x.Width == 1 && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      marginTop: 20,
                      paddingHorizontal: 8
                    }}>
                    <Text style={{paddingHorizontal: 10, paddingVertical: 20}}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: this._backgroundColor(x),
                        marginVertical: 5,
                        paddingHorizontal: 2,
                        paddingVertical: 2
                      }}></View>
                  </View>
                )
            )}
          </View>

          <View>
            {seats.map(
              (x, i) =>
                x.Row == 1 &&
                (x.Column == 1 ||
                  x.Column == 2 ||
                  x.Column == 3 ||
                  x.Column == 4 ||
                  x.Column == 5 ||
                  x.Column == 6 ||
                  x.Column == 7 ||
                  x.Column == 8 ||
                  x.Column == 9 ||
                  x.Column == 10) &&
                x.Length == 1 &&
                x.Width == 2 && (
                  <View
                    style={{
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "black",
                      marginHorizontal: 10,
                      backgroundColor: this._backgroundColor(x),
                      marginTop: 52,
                      width: 45,
                      height: 45
                    }}
                    key={"_sap" + i}>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                      <View
                        style={{
                          borderColor: "black",
                          borderRadius: 5,
                          backgroundColor: "black",
                          borderWidth: 1,
                          height: 30,
                          width: 6,
                          paddingVertical: 4,
                          marginTop: 15,
                          marginStart: -3
                        }}></View>
                      <View
                        style={{
                          borderColor: "black",
                          borderRadius: 5,
                          backgroundColor: "black",
                          borderWidth: 1,
                          height: 30,
                          width: 6,
                          paddingVertical: 4,
                          marginTop: 15,
                          marginEnd: -3
                        }}></View>
                    </View>
                    <View
                      style={{
                        borderColor: "black",
                        borderRadius: 5,
                        backgroundColor: "black",
                        borderWidth: 1,
                        height: 6,
                        width: 45,
                        marginTop: -5,
                        paddingHorizontal: 4
                      }}></View>
                  </View>
                )
            )}
          </View>

          <View style={{marginStart: 10}}>
            {seats.map(
              (x, i) =>
                x.Row == 2 &&
                (x.Column == 1 ||
                  x.Column == 2 ||
                  x.Column == 3 ||
                  x.Column == 4 ||
                  x.Column == 5 ||
                  x.Column == 6 ||
                  x.Column == 7 ||
                  x.Column == 8 ||
                  x.Column == 9 ||
                  x.Column == 10) &&
                x.Length == 1 &&
                x.Width == 1 && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      backgroundColor: this._backgroundColorHorizontal(x),
                      marginTop: 20,
                      paddingHorizontal: 8
                    }}>
                    <Text style={{paddingHorizontal: 10, paddingVertical: 20}}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: x.IsLadiesSeat == "True" ? "#E6397F" : null,
                        marginVertical: 5,
                        paddingHorizontal: 2,
                        paddingVertical: 2
                      }}></View>
                  </View>
                )
            )}
          </View>
          <View style={{marginStart: 10}}>
            {seats.map(
              (x, i) =>
                x.Row == 3 &&
                (x.Column == 1 ||
                  x.Column == 2 ||
                  x.Column == 3 ||
                  x.Column == 4 ||
                  x.Column == 5 ||
                  x.Column == 6 ||
                  x.Column == 7 ||
                  x.Column == 8 ||
                  x.Column == 9 ||
                  x.Column == 10) &&
                x.Length == 1 &&
                x.Width == 1 && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      marginTop: 20,
                      alignSelf: "flex-end",
                      paddingHorizontal: 8
                    }}>
                    <Text style={{paddingHorizontal: 10, paddingVertical: 20}}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: x.IsLadiesSeat == "True" ? "#E6397F" : null,
                        marginVertical: 5,
                        paddingHorizontal: 2,
                        paddingVertical: 2
                      }}></View>
                  </View>
                )
            )}
          </View>
          <View style={{marginStart: 10}}>
            {seats.map(
              (x, i) =>
                x.Row == 4 &&
                (x.Column == 1 ||
                  x.Column == 2 ||
                  x.Column == 3 ||
                  x.Column == 4 ||
                  x.Column == 5 ||
                  x.Column == 6 ||
                  x.Column == 7 ||
                  x.Column == 8 ||
                  x.Column == 9 ||
                  x.Column == 10) &&
                x.Length == 1 &&
                x.Width == 1 && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      marginTop: 20,
                      paddingHorizontal: 8
                    }}>
                    <Text style={{paddingHorizontal: 10, paddingVertical: 20}}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: x.IsLadiesSeat == "True" ? "#E6397F" : null,
                        marginVertical: 5,
                        paddingHorizontal: 2,
                        paddingVertical: 2
                      }}></View>
                  </View>
                )
            )}
          </View>
          <View style={{marginStart: 10}}>
            {seats.map(
              (x, i) =>
                x.Row == 5 &&
                (x.Column == 1 ||
                  x.Column == 2 ||
                  x.Column == 3 ||
                  x.Column == 4 ||
                  x.Column == 5 ||
                  x.Column == 6 ||
                  x.Column == 7 ||
                  x.Column == 8 ||
                  x.Column == 9 ||
                  x.Column == 10) &&
                x.Length == 1 &&
                x.Width == 1 && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      marginTop: 20,
                      paddingHorizontal: 8
                    }}>
                    <Text style={{paddingHorizontal: 10, paddingVertical: 20}}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: x.IsLadiesSeat == "True" ? "#E6397F" : null,
                        marginVertical: 5,
                        paddingHorizontal: 2,
                        paddingVertical: 2
                      }}></View>
                  </View>
                )
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default createMaterialTopTabNavigator(
  {
    UPPER: {screen: Seats},
    LOWER: {screen: LowerSeats}
  },
  {
    initialRouteName: "UPPER",
    activeColor: "#f0edf6",
    inactiveColor: "#3e2465",
    barStyle: {backgroundColor: "#694fad"}
  }
);
