import React from "react";

import { StyleSheet, View, ScrollView } from "react-native";
import {} from "react-native-gesture-handler";
import LowerSeats from "./LowerSeats";
import { Button, Text, Header } from "../../components";
import moment from "moment";
import axios from "axios";
import Toast from "react-native-simple-toast";
import { etravosApi, domainApi } from "../../service";
import data1 from "./data";
console.log(data1);

class Seats extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      seats: { upper: [], lower: [] },
      data: [],
      selectedTab: "lower",
      selectedSheets: []
    };
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params);
    const {
      tripType,
      params: { Id, SourceId, DestinationId, Journeydate, Provider, Travels }
    } = this.props.navigation.state.params;
    const data = {
      tripId: Id,
      sourceId: SourceId,
      destinationId: DestinationId,
      journeyDate: moment(Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY"),
      provider: Provider,
      travelOperator: Travels,
      tripType,
      userType: 5,
      user: ""
      //returnDate: null
    };
    console.log(data);

    this.setState({ loading: true });
    etravosApi
      .get("/Buses/TripDetails", data)
      .then(({ data }) => {
        //data.Seats = data1;
        if (Array.isArray(data.Seats) && data.Seats) {
          let seats = { upper: [], lower: [] };
          for (let i of data.Seats) {
            switch (i.Zindex) {
              case 0:
                seats.lower.push(i);
                break;
              case 1:
                seats.upper.push(i);
                break;
            }
          }

          const lower = seats.lower.reduce((prev, current) => {
            let d = {
              Row: prev.Row > current.Row ? prev.Row : current.Row,
              Column: prev.Column > current.Column ? prev.Column : current.Column
            };
            return d;
          });
          let lastHasTwoHeight = seats.lower.some(
            val => lower.Column == val.Column && val.Length == 2
          );

          const upper =
            seats.upper.length > 0
              ? seats.upper.reduce((prev, current) => {
                  let d = {
                    Row: prev.Row > current.Row ? prev.Row : current.Row,
                    Column: prev.Column > current.Column ? prev.Column : current.Column
                  };
                  return d;
                })
              : undefined;
          let lastUpperHasTwoHeight =
            seats.upper.length > 0
              ? seats.upper.some(val => upper.Column == val.Column && val.Length == 2)
              : undefined;

          this.setState({
            loading: false,
            seats,
            data: data.Seats,
            selectedTab: seats.lower.length == 0 && seats.upper.length > 0 ? "upper" : "lower",
            lowerRows: lower.Row,
            upperRows: upper ? upper.Row : 0,
            lowerColumns: lastHasTwoHeight ? lower.Column + 1 : lower.Column,
            upperColumns: upper ? (lastUpperHasTwoHeight ? upper.Column + 1 : upper.Column) : 0
          });
          console.log(this.state);
        } else {
          Toast.show("Seats not available");
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  _bookNow = () => {
    const { params, sourceName, destinationName, tripType } = this.props.navigation.state.params;
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
      service_charge: params.etravosApiTax,
      service_tax: 0,
      ConvenienceFee: params.ConvenienceFee,
      trip_type: tripType,
      journey_date: moment(params.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")
    };

    console.log(param);

    domainApi
      .post("/cart/add", param)
      .then(({ data }) => {
        console.log(data);
        if (data.code == "1") {
          Toast.show(data.message, Toast.LONG);
          domainApi.get("/cart").then(({ data }) => {
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

  // renderTable=()=>{
  //   const { seats, loading, selectedTab, lowerRows, lowerColumns } = this.state;
  //   return(

  //   )
  // }

  updateSheets = item => () => {
    let selectedSheets = [...this.state.selectedSheets];
    let index = selectedSheets.findIndex(val => val.Number == item.Number);
    if (index != -1) {
      selectedSheets.splice(index, 1);
    } else {
      selectedSheets.push(item);
    }
    this.setState({ selectedSheets });
    console.log(selectedSheets);
  };

  renderSeat = item => {
    const { lowerRows, selectedSheets } = this.state;
    const backgroundColor = selectedSheets.some(val => item.Number == val.Number)
      ? "#757575"
      : "#FFF";

    if (item.Length == 2 && item.Width == 1) {
      //Horizonatl Sleeper
      return (
        <Button
          style={{
            width: `${100 / lowerRows}%`,
            height: item.Length * 60,
            alignItems: "center",
            justifyContent: "center"
          }}
          key={"seat_" + item.Number}
          onPress={this.updateSheets(item)}>
          <View
            style={{
              borderRadius: 5,
              borderColor: "#000000",
              borderWidth: 1,
              paddingHorizontal: 8,
              backgroundColor
            }}>
            <Text style={{ paddingHorizontal: 10, paddingVertical: 20 }}>{item.Number}</Text>
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
        </Button>
      );
    } else if (item.Length == 1 && item.Width == 2) {
      //Vertical Sleeper
      return (
        <Button
          style={{
            width: `${100 / lowerRows}%`,
            height: item.Length * 60,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ translateX: 20 }]
          }}
          key={"seat_" + item.Number}
          onPress={this.updateSheets(item)}>
          <View
            style={{
              borderRadius: 2,
              borderColor: "#000000",
              borderWidth: 1,
              marginStart: 5,
              width: 90,
              height: 45,
              backgroundColor
            }}>
            {/* <Text style={{ paddingHorizontal: 10, paddingVertical: 20 }}>{item.Number}</Text> */}
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
        </Button>
      );
    } else {
      //Seater
      return (
        <Button
          style={{
            width: `${100 / lowerRows}%`,
            height: item.Length * 60,
            alignItems: "center",
            justifyContent: "center"
          }}
          key={"seat_" + item.Number}
          onPress={this.updateSheets(item)}>
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "black",
              width: 45,
              height: 45,
              backgroundColor
            }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View
                style={{
                  borderRadius: 5,
                  backgroundColor: "black",
                  borderWidth: 1,
                  height: 30,
                  width: 6,
                  paddingVertical: 4,
                  marginTop: 15,
                  marginStart: -3
                }}
              />
              <View
                style={{
                  borderRadius: 5,
                  backgroundColor: "black",
                  borderWidth: 1,
                  height: 30,
                  width: 6,
                  paddingVertical: 4,
                  marginTop: 15,
                  marginEnd: -3
                }}
              />
            </View>
            <View
              style={{
                borderRadius: 5,
                backgroundColor: "black",
                borderWidth: 1,
                height: 6,
                width: 45,
                marginTop: -5,
                paddingHorizontal: 4
              }}
            />
          </View>
        </Button>
      );
    }
  };

  render() {
    const {
      seats,
      loading,
      selectedTab,
      lowerRows,
      lowerColumns,
      upperRows,
      upperColumns
    } = this.state;
    //console.log(lowerColumns);

    return (
      <View style={{ flex: 1 }}>
        <Header firstName="Seats" />

        {seats.lower.length > 0 && seats.upper.length > 0 && (
          <View style={styles.tabContainer}>
            <Button
              onPress={() => this.setState({ selectedTab: "lower" })}
              style={[selectedTab == "lower" ? { backgroundColor: "#5B89F9" } : null, styles.tab]}>
              <Text style={[selectedTab == "lower" ? { color: "#FFF" } : null]}>Lower Birth</Text>
            </Button>
            <Button
              onPress={() => this.setState({ selectedTab: "upper" })}
              style={[selectedTab == "upper" ? { backgroundColor: "#5B89F9" } : null, styles.tab]}>
              <Text style={[selectedTab == "upper" ? { color: "#FFF" } : null]}>Upper Birth</Text>
            </Button>
          </View>
        )}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 32 }}>
          {/* <View style={{ flexDirection: "row-reverse", width: "100%", flex: 1 }}> */}

          {selectedTab == "lower" && lowerRows > 0 && lowerColumns > 0 && (
            <View
              style={{
                //flex: lowerRows,
                flexDirection: "column",
                flexWrap: "wrap",
                height: 60 * lowerColumns
              }}>
              {[...Array(lowerRows)].map((c, row) => {
                return [...Array(lowerColumns)].map((r, column) => {
                  let item = seats.lower.find(v => v.Row == row + 1 && v.Column == column + 1);
                  let rowSpan = seats.lower.find(v => v.Row == row + 1 && v.Column == column);
                  let colSpan = seats.lower.find(v => v.Row == row && v.Column == column + 1);
                  if (item) {
                    return this.renderSeat(item);
                  } else if (rowSpan && rowSpan.Length == 2) {
                    return (
                      <View
                        style={{
                          width: `${100 / lowerRows}%`,
                          height: 0,
                          backgroundColor: "green"
                        }}
                        key={"seat_blank" + row + column}
                      />
                    );
                    /* } else if (colSpan && colSpan.Width == 2) {
                    console.log("here");
                    return <View style={{ width: "0%", height: 60 }}></View>; */
                  } else {
                    return (
                      <View
                        key={"seat_blank" + row + column}
                        style={{
                          width: `${100 / lowerRows}%`,
                          height: 60
                        }}
                      />
                    );
                  }
                });
              })}
              {/* </View> */}
            </View>
          )}

          {selectedTab == "upper" && upperRows > 0 && upperColumns > 0 && (
            <View
              style={{
                flexDirection: "column",
                flexWrap: "wrap",
                height: 60 * upperColumns
              }}>
              {[...Array(upperRows)].map((c, row) => {
                return [...Array(upperColumns)].map((r, column) => {
                  let item = seats.upper.find(v => v.Row == row + 1 && v.Column == column + 1);
                  let rowSpan = seats.upper.find(v => v.Row == row + 1 && v.Column == column);
                  let colSpan = seats.upper.find(v => v.Row == row && v.Column == column + 1);
                  if (item) {
                    return this.renderSeat(item);
                  } else if (rowSpan && rowSpan.Length == 2) {
                    return (
                      <View
                        style={{
                          width: `${100 / upperRows}%`,
                          height: 0,
                          backgroundColor: "green"
                        }}
                        key={"seat_blank" + row + column}
                      />
                    );
                    /* } else if (colSpan && colSpan.Width == 2) {
                    console.log("here");
                    return <View style={{ width: "0%", height: 60 }}></View>; */
                  } else {
                    return (
                      <View
                        ey={"seat_blank" + row + column}
                        style={{
                          width: `${100 / upperRows}%`,
                          height: 60
                        }}
                      />
                    );
                  }
                });
              })}
            </View>
          )}

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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    padding: 16
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4
  }
});

export default Seats;
