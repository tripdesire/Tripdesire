import React, { PureComponent } from "react";
import { Dimensions, Image, StyleSheet, View, FlatList, Text, ScrollView } from "react-native";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
class LowerSeats extends React.PureComponent {
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
          Number: "2",
          Row: 1,
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
          Number: "3",
          Row: 1,
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
          Number: "4",
          Row: 1,
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
          Number: "5",
          Row: 1,
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
          Number: "6",
          Row: 1,
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
          Number: "7",
          Row: 1,
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
          Number: "8",
          Row: 1,
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
          Number: "9",
          Row: 1,
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
          Number: "10",
          Row: 1,
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
          IsAvailableSeat: "True",
          IsLadiesSeat: "False",
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
          IsAvailableSeat: "True",
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

  render() {
    const { rows, columns, seats } = this.state;
    return (
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderWidth: 1,
            marginVertical: 30,
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
                  x.Column == 10) && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      marginTop: 20,
                      paddingHorizontal: 8
                    }}>
                    <Text style={{ paddingHorizontal: 10, paddingVertical: 20 }}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: x.IsLadiesSeat == "True" ? "purple" : null,
                        marginVertical: 5,
                        paddingHorizontal: 2,
                        paddingVertical: 2
                      }}></View>
                  </View>
                )
            )}
          </View>
          <View style={{ marginStart: 10 }}>
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
                  x.Column == 10) && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      marginTop: 20,
                      paddingHorizontal: 8
                    }}>
                    <Text style={{ paddingHorizontal: 10, paddingVertical: 20 }}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: x.IsLadiesSeat == "True" ? "purple" : null,
                        marginVertical: 5,
                        paddingHorizontal: 2,
                        paddingVertical: 2
                      }}></View>
                  </View>
                )
            )}
          </View>
          <View style={{ marginStart: 10 }}>
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
                  x.Column == 10) && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      marginTop: 20,
                      paddingHorizontal: 8
                    }}>
                    <Text style={{ paddingHorizontal: 10, paddingVertical: 20 }}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: x.IsLadiesSeat == "True" ? "red" : null,
                        marginVertical: 5,
                        paddingHorizontal: 2,
                        paddingVertical: 2
                      }}></View>
                  </View>
                )
            )}
          </View>
          <View style={{ marginStart: 10 }}>
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
                  x.Column == 10) && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      marginTop: 20,
                      paddingHorizontal: 8
                    }}>
                    <Text style={{ paddingHorizontal: 10, paddingVertical: 20 }}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: x.IsLadiesSeat == "True" ? "red" : null,
                        marginVertical: 5,
                        paddingHorizontal: 2,
                        paddingVertical: 2
                      }}></View>
                  </View>
                )
            )}
          </View>
          <View style={{ marginStart: 10 }}>
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
                  x.Column == 10) && (
                  <View
                    style={{
                      borderRadius: 2,
                      borderColor: "#000000",
                      borderWidth: 1,
                      marginTop: 20,
                      paddingHorizontal: 8
                    }}>
                    <Text style={{ paddingHorizontal: 10, paddingVertical: 20 }}></Text>
                    <View
                      style={{
                        borderRadius: 2,
                        borderColor: "#000000",
                        borderWidth: 1,
                        marginHorizontal: 1,
                        backgroundColor: x.IsLadiesSeat == "True" ? "red" : null,
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

export default LowerSeats;
