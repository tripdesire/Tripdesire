import React from "react";
import { StatusBar, View, FlatList, SafeAreaView, Modal } from "react-native";
import { orderBy } from "lodash";
import {
  Button,
  Text,
  ActivityIndicator,
  Icon,
  HeaderFlights,
  DataNotFound
} from "../../components";
import RenderInternationRound from "./RenderInternationRound";
import Filter from "./Filter";
import { etravosApi } from "../../service";
import moment from "moment";

class FlightsInfoRoundInt extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      to: "",
      journey_date: "",
      return_date: "",
      journeyDate: "",
      returnDate: "",
      className: "",
      travelClass: "",
      Adult: "",
      Child: "",
      Infant: "",
      triptype: "",
      flighttype: "",
      flights: [],
      sourceCode: "",
      destinationCode: "",
      sourceAirportName: "",
      destinationAirportName: "",
      loader: true,
      flightCount: 0,
      showFilter: false,
      filterValues: {
        stops: [],
        fareType: [],
        airlines: [],
        connectingLocations: [],
        price: [],
        departure: ["00:00 AM", "11:45 PM"],
        arrival: ["00:00 AM", "11:45 PM"],
        sortBy: "Fare low to high"
      }
    };
  }
  componentDidMount() {
    let data = [];
    data = this.props.navigation.state.params;
    console.log(data);

    let jd = moment(data.journeyDate, "DD-MM-YYYY").format("DD MMM");
    let rd = moment(data.returnDate, "DD-MM-YYYY").format("DD MMM");
    this.setState({
      from: data.sourceName,
      to: data.destinationName,
      travelClass: data.travelClass,
      className: data.className,
      journey_date: jd,
      return_date: rd,
      journeyDate: data.journeyDate,
      returnDate: data.returnDate,
      Adult: data.adults,
      Child: data.children,
      Infant: data.infants,
      triptype: data.tripType,
      flighttype: data.flightType,
      sourceCode: data.source,
      destinationCode: data.destination,
      sourceAirportName: data.sourceAirportName,
      destinationAirportName: data.destinationAirportName
    });

    etravosApi.get("/Flights/AvailableFlights", data).then(({ data }) => {
      console.log(JSON.stringify(data));
      if (data.InternationalFlights.length != 0) {
        this.setState({
          flights: data.InternationalFlights,
          filterFlights: data.InternationalFlights,
          loader: false,
          flightCount: 1
        });
      } else {
        this.setState({
          loader: false,
          flightCount: 0
        });
        // Toast.show("Data not found", Toast.LONG);
      }
    });
  }

  openFilter = () => {
    this.setState({ showFilter: true });
  };
  closeFilter = () => {
    this.setState({ showFilter: false });
  };
  onChangeFilter = filterValues => {
    this.setState({ filterValues });
  };
  filter = () => {
    const { filterValues, flights } = this.state;
    let filterFlights = flights.filter(
      item =>
        //stops
        (filterValues.stops.length == 0 ||
          filterValues.stops.includes(item.IntOnward.FlightSegments.length - 1) ||
          filterValues.stops.includes(item.IntReturn.FlightSegments.length - 1)) &&
        //faretype
        (filterValues.fareType.length == 0 ||
          filterValues.fareType.includes(item.IntOnward.FlightSegments[0].BookingClassFare.Rule) ||
          filterValues.fareType.includes(item.IntReturn.FlightSegments[0].BookingClassFare.Rule)) &&
        //airlines
        (filterValues.airlines.length == 0 ||
          filterValues.airlines.includes(item.IntOnward.FlightSegments[0].AirLineName) ||
          filterValues.airlines.includes(item.IntReturn.FlightSegments[0].AirLineName)) &&
        //connectingLocations
        (filterValues.connectingLocations.length == 0 ||
          item.IntOnward.FlightSegments.some(value =>
            filterValues.connectingLocations.includes(value.IntDepartureAirportName)
          ) ||
          item.IntReturn.FlightSegments.some(value =>
            filterValues.connectingLocations.includes(value.IntDepartureAirportName)
          )) &&
        (filterValues.price.length == 0 ||
          (filterValues.price[0] <= item.FareDetails.TotalFare &&
            filterValues.price[1] >= item.FareDetails.TotalFare)) &&
        (filterValues.departure.length == 0 ||
          moment(
            item.IntOnward.FlightSegments[0].DepartureDateTime.split("T")[1],
            "HH:mm:ss"
          ).isBetween(
            moment(filterValues.departure[0], "hh:mm A"),
            moment(filterValues.departure[1], "hh:mm A"),
            null,
            "[]"
          ) ||
          moment(
            item.IntReturn.FlightSegments[0].DepartureDateTime.split("T")[1],
            "HH:mm:ss"
          ).isBetween(
            moment(filterValues.departure[0], "hh:mm A"),
            moment(filterValues.departure[1], "hh:mm A"),
            null,
            "[]"
          )) &&
        (filterValues.arrival.length == 0 ||
          moment(
            item.IntOnward.FlightSegments[
              item.IntOnward.FlightSegments.length - 1
            ].ArrivalDateTime.split("T")[1],
            "HH:mm:ss"
          ).isBetween(
            moment(filterValues.arrival[0], "hh:mm A"),
            moment(filterValues.arrival[1], "hh:mm A"),
            null,
            "[]"
          ) ||
          moment(
            item.IntReturn.FlightSegments[
              item.IntReturn.FlightSegments.length - 1
            ].ArrivalDateTime.split("T")[1],
            "HH:mm:ss"
          ).isBetween(
            moment(filterValues.arrival[0], "hh:mm A"),
            moment(filterValues.arrival[1], "hh:mm A"),
            null,
            "[]"
          ))
    );

    switch (filterValues.sortBy) {
      case "Airline Asc":
        filterFlights = orderBy(filterFlights, "IntOnward.FlightSegments[0].AirLineName", "asc");
        break;
      case "Airline Desc":
        filterFlights = orderBy(filterFlights, "IntOnward.FlightSegments[0].AirLineName", "desc");
        break;
      case "Fare low to high":
        filterFlights = orderBy(filterFlights, "FareDetails.TotalFare", "asc");
        break;
      case "Fare high to low":
        filterFlights = orderBy(filterFlights, "FareDetails.TotalFare", "desc");
        break;
      case "Departure Asc":
        filterFlights = orderBy(
          filterFlights,
          new Date(item.IntOnward.FlightSegments[0].DepartureDateTime),
          "asc"
        );
        break;
      case "Departure Desc":
        filterFlights = orderBy(
          filterFlights,
          item => new Date(item.IntOnward.FlightSegments[0].DepartureDateTime),
          "desc"
        );
        break;
      case "Arrival Asc":
        filterFlights = orderBy(
          filterFlights,
          item =>
            new Date(
              item.IntOnward.FlightSegments[
                item.IntOnward.FlightSegments.length - 1
              ].ArrivalDateTime
            ),
          "asc"
        );
        break;
      case "Arrival Desc":
        filterFlights = orderBy(
          filterFlights,
          item =>
            new Date(
              item.IntOnward.FlightSegments[
                item.IntOnward.FlightSegments.length - 1
              ].ArrivalDateTime
            ),
          "desc"
        );
        break;
    }
    console.log(filterFlights);
    this.setState({ filterFlights, showFilter: false });
  };

  _renderItem = ({ item, index }) => {
    return (
      <RenderInternationRound
        item={item}
        index={index}
        from={this.state.from}
        to={this.state.to}
        className={this.state.className}
        travelClass={this.state.travelClass}
        TripType={this.state.triptype}
        FlightType={this.state.flighttype}
        journey_date={this.state.journey_date}
        return_date={this.state.return_date}
        journeyDate={this.state.journeyDate}
        returnDate={this.state.returnDate}
        Adult={this.state.Adult}
        Child={this.state.Child}
        Infant={this.state.Infant}
        sourceCode={this.state.sourceCode}
        destinationCode={this.state.destinationCode}
        sourceAirportName={this.state.sourceAirportName}
        destinationAirportName={this.state.destinationAirportName}
      />
    );
  };

  _keyExtractor = (item, index) => "key" + index;

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    const {
      flights,
      from,
      to,
      journey_date,
      return_date,
      Adult,
      Child,
      Infant,
      className,
      loader,
      showFilter,
      filterFlights,
      flighttype,
      flightCount
    } = this.state;

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: "#E5EBF7" }}>
              <HeaderFlights
                from={from}
                to={to}
                journey_date={journey_date}
                return_date={return_date}
                Adult={Adult}
                Child={Child}
                Infant={Infant}
                className={className}
                style={{ backgroundColor: "#E5EBF7", paddingBottom: 8 }}>
                <Button
                  style={{
                    flexDirection: "row",
                    marginStart: "auto",
                    paddingEnd: 8,
                    paddingVertical: 16
                  }}
                  onPress={this.openFilter}>
                  <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
                  <Text style={{ fontSize: 14, marginHorizontal: 5, color: "#717984" }}>
                    Sort & Filter
                  </Text>
                </Button>
              </HeaderFlights>
            </View>
            <FlatList
              data={filterFlights}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
            <Modal
              animationType="slide"
              transparent={false}
              visible={showFilter}
              onRequestClose={this.closeFilter}>
              <Filter
                data={flights}
                onBackPress={this.closeFilter}
                filterValues={this.state.filterValues}
                onChangeFilter={this.onChangeFilter}
                flight_type={flighttype}
                filter={this.filter}
              />
            </Modal>
            {flightCount == 0 && (
              <DataNotFound title="No flights found" onPress={this.goBack} />
              /* <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "700" }}>No flight found</Text>
              </View>*/
            )}
            {loader && <ActivityIndicator label={"FETCHING FLIGHTS"} />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default FlightsInfoRoundInt;
