import React from "react";
import { View, Image, FlatList, Modal, SafeAreaView } from "react-native";
import { Button, Text, Activity_Indicator, Icon, HeaderFlights } from "../../components";
import Toast from "react-native-simple-toast";
import FlightListRender from "./FlightListRender";
import FlightListInternational from "./FlightListInternational";
import Service from "../../service";
import moment from "moment";
import Filter from "./Filter";

class FlightsInfoOneway extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      to: "",
      journeyDate: "",
      journey_date: "",
      className: "",
      Adult: "",
      Child: "",
      Infant: "",
      flight_type: "",
      loader: true,
      trip_type: "",
      sourceAirportName: "",
      destinationAirportName: "",
      _selectFlightType: false,
      month: "",
      dates: [],
      flights: [],
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
    let data = this.props.navigation.state.params;
    this.genrateDates(data.journeyDate);
    console.log(data);

    let jd = moment(data.journeyDate, "DD-MM-YYYY").format("DD MMM");
    this.setState({
      from: data.sourceName,
      to: data.destinationName,
      className: data.className,
      travelClass: data.travelClass,
      journey_date: jd,
      journeyDate: data.journeyDate,
      Adult: data.adults,
      Child: data.children,
      Infant: data.infants,
      flight_type: data.flightType,
      trip_type: data.tripType,
      sourceCode: data.source,
      destinationCode: data.destination,
      sourceAirportName: data.sourceAirportName,
      destinationAirportName: data.destinationAirportName
    });
    Service.get("/Flights/AvailableFlights", data)
      .then(({ data }) => {
        console.log(data);
        if (this.state.flight_type == 1) {
          console.log(data.DomesticOnwardFlights);
          this.setState({
            flights: data.DomesticOnwardFlights,
            filterFlights: data.DomesticOnwardFlights,
            loader: false
          });
        }
        if (this.state.flight_type == 2) {
          console.log(data.InternationalFlights);
          this.setState({
            flights: data.InternationalFlights,
            filterFlights: data.InternationalFlights,
            loader: false
          });
        }
      })
      .catch(error => {
        Toast.show(error, Toast.LONG);
        this.setState({ loader: false });
      });
  }

  genrateDates(date) {
    let dates = [];
    date = moment(date, "DD-MM-YYYY");
    for (let i = 0; i < 7; i++) {
      let d = date.add(1, "days");
      dates.push({
        fullDate: d.format("DD-MM-YYYY"),
        day: d.format("ddd"),
        date: d.format("DD")
      });
    }
    let month = date.format("MMM");
    this.setState({ dates, month });
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
    const { filterValues, flights, flight_type } = this.state;
    let filterFlights = [...flights];

    switch (flight_type) {
      case 1:
        filterFlights = filterFlights.filter(
          item =>
            (filterValues.stops.length == 0 ||
              filterValues.stops.includes(item.FlightSegments.length - 1)) &&
            (filterValues.fareType.length == 0 ||
              filterValues.fareType.includes(item.FlightSegments[0].BookingClassFare.Rule)) &&
            (filterValues.airlines.length == 0 ||
              filterValues.airlines.includes(item.FlightSegments[0].AirLineName)) &&
            (filterValues.connectingLocations.length == 0 ||
              item.FlightSegments.some(value =>
                filterValues.connectingLocations.includes(value.IntDepartureAirportName)
              ))
        );
        break;
      case 2:
        filterFlights = filterFlights.filter(
          item =>
            (filterValues.stops.length == 0 ||
              filterValues.stops.includes(item.IntOnward.FlightSegments.length - 1)) &&
            (filterValues.fareType.length == 0 ||
              filterValues.fareType.includes(
                item.IntOnward.FlightSegments[0].BookingClassFare.Rule
              )) &&
            (filterValues.airlines.length == 0 ||
              filterValues.airlines.includes(item.IntOnward.FlightSegments[0].AirLineName)) &&
            (filterValues.connectingLocations.length == 0 ||
              item.IntOnward.FlightSegments.some(value =>
                filterValues.connectingLocations.includes(value.IntDepartureAirportName)
              ))
        );
        break;
    }

    console.log(filterFlights);
    this.setState({ filterFlights, showFilter: false });
  };

  _renderItem = ({ item }) => (
    <Button style={{ paddingHorizontal: 15, paddingVertical: 10, alignItems: "center" }}>
      <Text style={{ fontSize: 12, color: "#717984" }}>{item.day}</Text>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{item.date}</Text>
    </Button>
  );
  itemSeparator = () => (
    <View style={{ width: 1, backgroundColor: "#DFDFDF", paddingVertical: 10 }} />
  );
  listheaderComponent = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ transform: [{ rotate: "270deg" }], textAlign: "center" }}>
        {this.state.month}
      </Text>
    </View>
  );
  _keyExtractor = (item, index) => "dates_" + index;

  _renderItemList = ({ item, index }) => {
    if (this.state.flight_type == 1) {
      return (
        <FlightListRender
          item={item}
          index={index}
          from={this.state.from}
          to={this.state.to}
          className={this.state.className}
          travelClass={this.state.travelClass}
          journey_date={this.state.journey_date}
          journeyDate={this.state.journeyDate}
          adult={this.state.Adult}
          child={this.state.Child}
          infant={this.state.Infant}
          flight_type={this.state.flight_type}
          trip_type={this.state.trip_type}
          sourceCode={this.state.sourceCode}
          destinationCode={this.state.destinationCode}
          sourceAirportName={this.state.sourceAirportName}
          destinationAirportName={this.state.destinationAirportName}
        />
      );
    } else if (this.state.flight_type == 2) {
      return (
        <FlightListInternational
          item={item}
          index={index}
          from={this.state.from}
          to={this.state.to}
          className={this.state.className}
          travelClass={this.state.travelClass}
          journeyDate={this.state.journeyDate}
          journey_date={this.state.journey_date}
          adult={this.state.Adult}
          child={this.state.Child}
          infant={this.state.Infant}
          flight_type={this.state.flight_type}
          trip_type={this.state.trip_type}
          sourceCode={this.state.sourceCode}
          destinationCode={this.state.destinationCode}
          sourceAirportName={this.state.sourceAirportName}
          destinationAirportName={this.state.destinationAirportName}
        />
      );
    }
  };
  _keyExtractoritems = (item, index) => "key" + index;

  render() {
    const {
      from,
      to,
      journey_date,
      className,
      Adult,
      Child,
      Infant,
      loader,
      showFilter,
      filterFlights,
      dates,
      flight_type
    } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flex: 1, backgroundColor: "#E5EBF7" }}>
              <HeaderFlights
                from={from}
                to={to}
                journey_date={journey_date}
                Adult={Adult}
                Child={Child}
                Infant={Infant}
                className={className}>
                <Button
                  style={{
                    flexDirection: "row",
                    marginStart: "auto",
                    paddingEnd: 8,
                    paddingVertical: 16
                  }}
                  onPress={this.openFilter}>
                  <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
                  <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                    Sort & Filter
                  </Text>
                </Button>
              </HeaderFlights>
            </View>

            <View style={{ flex: 4 }}>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 30,
                  borderRadius: 5,
                  marginTop: -40,
                  borderWidth: 1,
                  borderColor: "#d2d2d2d2",
                  backgroundColor: "#FFFFFF"
                }}>
                <FlatList
                  horizontal={true}
                  data={dates}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}
                  ItemSeparatorComponent={this.itemSeparator}
                  showsHorizontalScrollIndicator={false}
                  ListHeaderComponent={this.listheaderComponent}
                />
                <Button
                  style={{
                    backgroundColor: "#5B89F9",
                    justifyContent: "center",
                    borderBottomRightRadius: 5,
                    borderTopRightRadius: 5
                  }}>
                  <Image
                    style={{ width: 20, marginHorizontal: 8 }}
                    resizeMode="contain"
                    source={require("../../assets/imgs/cal.png")}
                  />
                </Button>
              </View>

              <FlatList
                nestedScrollEnabled={true}
                vertical={true}
                data={filterFlights}
                keyExtractor={this._keyExtractoritems}
                renderItem={this._renderItemList}
              />
            </View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={showFilter}
              onRequestClose={this.closeFilter}>
              <Filter
                data={this.state.flights}
                onBackPress={this.closeFilter}
                filterValues={this.state.filterValues}
                onChangeFilter={this.onChangeFilter}
                flight_type={flight_type}
                filter={this.filter}
              />
            </Modal>
            {loader && <Activity_Indicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default FlightsInfoOneway;
