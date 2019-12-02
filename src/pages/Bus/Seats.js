import React from "react";

import {StyleSheet, View, ScrollView} from "react-native";
import {} from "react-native-gesture-handler";
import LowerSeats from "./LowerSeats";
import {Button, Text} from "../../components";
import moment from "moment";
import axios from "axios";
import Toast from "react-native-simple-toast";

class Seats extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      seats: {upper: [], lower: []},
      data: [],
      selectedTab: "lower"
    };
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params);
    const {
      tripType,
      item: {Id, SourceId, DestinationId, Journeydate, Provider, Travels}
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

    this.setState({loading: true});
    Service.get("/Buses/TripDetails", data)
      .then(({data}) => {
        if (Array.isArray(data.Seats) && data.Seats) {
          let seats = {upper: [], lower: []};
          for (let i of data.Seats) {
            switch (i.Zindex) {
              case 0:
                seats.lower.push(i);
                break;
              case 0:
                seats.upper.push(i);
                break;
            }
          }
          const lowerRows = seats.lower.reduce((prev, current) => {
            return prev.Row > current.Row ? prev : current;
          });

          const lowerColumns = seats.lower.reduce((prev, current) => {
            return prev.Column > current.Column ? prev : current;
          });

          const upperRows =
            seats.upper.length > 0
              ? seats.upper.reduce((prev, current) => {
                  return prev.Row > current.Row ? prev : current;
                })
              : null;

          const upperColumns =
            seats.upper.length > 0
              ? seats.upper.reduce((prev, current) => {
                  return prev.Column > current.Column ? prev : current;
                })
              : null;
          this.setState({
            loading: false,
            seats,
            data: data.Seats,
            selectedTab: seats.lower.length == 0 && seats.upper.length > 0 ? "upper" : "lower",
            lowerRows: lowerRows.Row,
            upperRows: upperRows ? upperRows.Row : 0,
            lowerColumns: lowerColumns.Column,
            upperColumns: upperColumns ? upperColumns.Column : 0
          });
          console.log(this.state);
        } else {
          Toast.show("Seats not available");
          this.setState({loading: false});
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({loading: false});
      });
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
    const {seats, loading, selectedTab, rows, columns} = this.state;
    return (
      <View style={{flex: 1}}>
        <Header firstName="Seats" />
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
        {seats.lower.length > 0 && seats.upper.length > 0 && (
          <View style={styles.tabContainer}>
            <Button
              style={[selectedTab == "lower" ? {backgroundColor: "#5B89F9"} : null, styles.tab]}>
              <Text style={[selectedTab == "lower" ? {color: "#FFF"} : null]}>Lower Birth</Text>
            </Button>
            <Button
              style={[selectedTab == "upper" ? {backgroundColor: "#5B89F9"} : null, styles.tab]}>
              <Text style={[selectedTab == "upper" ? {color: "#FFF"} : null]}>Upper Birth</Text>
            </Button>
          </View>
        )}
        {/*selectedTab == "lower" && [...Array(10)].map((e, i) => {
    return <li key={i}>{i}</li>
  })*/}
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
