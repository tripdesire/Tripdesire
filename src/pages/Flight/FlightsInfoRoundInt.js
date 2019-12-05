import React from "react";
import { Dimensions, View, FlatList, SafeAreaView, Modal } from "react-native";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import RenderInternationRound from "./RenderInternationRound";
import Filter from "./Filter";
import { etravosApi } from "../../service";
import moment from "moment";
import Toast from "react-native-simple-toast";

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
        depature: [],
        arrival: []
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
      console.log(data);
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
        Toast.show("Data not found", Toast.LONG);
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
        (!filterValues.price.min ||
          filterValues.price.min <= item.IntOnward.FareDetails.TotalFare) &&
        (!filterValues.price.max ||
          filterValues.price.max >= item.IntOnward.FareDetails.TotalFare) &&
        (!filterValues.price.min || filterValues.price.min <= item.IntOnward.IntReturn.TotalFare) &&
        (!filterValues.price.max || filterValues.price.max >= item.IntOnward.IntReturn.TotalFare)
    );

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
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: "#E5EBF7", height: 56 }}>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  marginTop: 10
                }}>
                <Button onPress={() => this.props.navigation.goBack(null)}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    flex: 1
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginHorizontal: 5
                      }}>
                      {from} To {to}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginHorizontal: 5,
                        color: "#717984"
                      }}>
                      {journey_date + " - " + return_date} | {Adult > 0 ? Adult + " Adult" : ""}
                      {Child > 0 ? "," + Child + " Child" : ""}{" "}
                      {Infant > 0 ? "," + Infant + " Infant" : ""} | {className}
                    </Text>
                  </View>
                  <Button
                    style={{
                      flexDirection: "row",
                      marginStart: "auto",
                      paddingEnd: 8
                    }}
                    onPress={this.openFilter}>
                    <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
                    <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                      Sort & Filter
                    </Text>
                  </Button>
                </View>
              </View>
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
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text>Data not found</Text>
              </View>
            )}
            {loader && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default FlightsInfoRoundInt;
