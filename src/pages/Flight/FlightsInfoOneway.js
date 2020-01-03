import React from "react";
import { View, Image, FlatList, Modal, SafeAreaView, SectionList } from "react-native";
import { Button, Text, ActivityIndicator, Icon, HeaderFlights } from "../../components";
import Toast from "react-native-simple-toast";
import { orderBy } from "lodash";
import FlightListRender from "./FlightListRender";
import FlightListInternational from "./FlightListInternational";
import { etravosApi } from "../../service";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import Filter from "./Filter";

class FlightsInfoOneway extends React.PureComponent {
  constructor(props) {
    super(props);
    let data = this.props.navigation.state.params;
    this.state = {
      from: data.sourceName,
      to: data.destinationName,
      className: data.className,
      travelClass: data.travelClass,
      journey_date: moment(data.journeyDate, "DD-MM-YYYY").format("DD MMM"),
      journeyDate: data.journeyDate,
      Adult: data.adults,
      Child: data.children,
      Infant: data.infants,
      flight_type: data.flightType,
      trip_type: data.tripType,
      sourceCode: data.source,
      destinationCode: data.destination,
      sourceAirportName: data.sourceAirportName,
      destinationAirportName: data.destinationAirportName,
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
        departure: ["00:00 AM", "11:45 PM"],
        arrival: ["00:00 AM", "11:45 PM"],
        sortBy: "Fare low to high"
      },
      filterFlights: [],
      propsName: props.navigation.state.params,
      showCalender: false
    };
  }

  componentDidMount() {
    let data = Object.assign({}, this.props.navigation.state.params);
    this.genrateDates(data.journeyDate);
    this.ApiCall(data);
  }

  ApiCall(data) {
    this.setState({ loader: true });
    etravosApi
      .get("/Flights/AvailableFlights", data)
      .then(({ data }) => {
        this.setState({ loader: false });
        if (this.state.flight_type == 1) {
          console.log(data.DomesticOnwardFlights);
          if (data.DomesticOnwardFlights.length != 0) {
            this.setState({
              flights: data.DomesticOnwardFlights,
              filterFlights: data.DomesticOnwardFlights,
              loader: false
            });
          } else {
            this.setState({ loader: false, flights: [], filterFlights: [] });
            Toast.show("Data not Found", Toast.LONG);
          }
        }
        if (this.state.flight_type == 2) {
          if (data.InternationalFlights.length != 0) {
            this.setState({
              flights: data.InternationalFlights,
              filterFlights: data.InternationalFlights,
              loader: false
            });
          } else {
            this.setState({ loader: false, flights: [], filterFlights: [] });
            Toast.show("Data not Found", Toast.LONG);
          }
        }
      })
      .catch(error => {
        Toast.show(error.toString(), Toast.LONG);
        this.setState({ loader: false });
      });
  }

  genrateDates(date) {
    let dates = [];
    date = moment(date, "DD-MM-YYYY");
    for (let i = 0; i < 90; i++) {
      let d = date.add(1, "days");
      let month = d.format("MMM");
      if (!dates.hasOwnProperty(month)) {
        dates[month] = [];
      }
      dates[month].push({
        fullDate: d.format("DD-MM-YYYY"),
        day: d.format("ddd"),
        date: d.format("DD")
      });
    }
    dates = Object.keys(dates).map(key => ({ title: key, data: dates[key] }));
    console.log(dates);
    let month = date.format("MMM");
    this.setState({ dates: dates, month });
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
    let filterFlights = [];
    console.log(filterValues);

    switch (flight_type) {
      case 1:
        filterFlights = flights.filter(item => {
          return (
            (filterValues.stops.length == 0 ||
              filterValues.stops.includes(item.FlightSegments.length - 1)) &&
            (filterValues.fareType.length == 0 ||
              filterValues.fareType.includes(item.FlightSegments[0].BookingClassFare.Rule)) &&
            (filterValues.airlines.length == 0 ||
              filterValues.airlines.includes(item.FlightSegments[0].AirLineName)) &&
            (filterValues.connectingLocations.length == 0 ||
              item.FlightSegments.some(value =>
                filterValues.connectingLocations.includes(value.IntDepartureAirportName)
              )) &&
            (filterValues.price.length == 0 ||
              (filterValues.price[0] <= item.FareDetails.TotalFare &&
                filterValues.price[1] >= item.FareDetails.TotalFare)) &&
            (filterValues.departure.length == 0 ||
              moment(item.FlightSegments[0].DepartureDateTime.split("T")[1], "HH:mm:ss").isBetween(
                moment(filterValues.departure[0], "hh:mm A"),
                moment(filterValues.departure[1], "hh:mm A"),
                null,
                "[]"
              )) &&
            (filterValues.arrival.length == 0 ||
              moment(
                item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime.split("T")[1],
                "HH:mm:ss"
              ).isBetween(
                moment(filterValues.arrival[0], "hh:mm A"),
                moment(filterValues.arrival[1], "hh:mm A"),
                null,
                "[]"
              ))
          );
        });
        switch (filterValues.sortBy) {
          case "Airline Asc":
            filterFlights = orderBy(filterFlights, "FlightSegments[0].AirLineName", "asc");
            break;
          case "Airline Desc":
            filterFlights = orderBy(filterFlights, "FlightSegments[0].AirLineName", "desc");
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
              item => new Date(item.FlightSegments[0].DepartureDateTime),
              "asc"
            );
            break;
          case "Departure Desc":
            filterFlights = orderBy(
              filterFlights,
              item => new Date(item.FlightSegments[0].DepartureDateTime),
              "desc"
            );
            break;
          case "Arrival Asc":
            filterFlights = orderBy(
              filterFlights,
              item => new Date(item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime),
              "asc"
            );
            break;
          case "Arrival Desc":
            filterFlights = orderBy(
              filterFlights,
              item => new Date(item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime),
              "desc"
            );
            break;
        }

        break;
      case 2:
        filterFlights = flights.filter(
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
              ))
        );
        switch (filterValues.sortBy) {
          case "Airline Asc":
            filterFlights = orderBy(
              filterFlights,
              "IntOnward.FlightSegments[0].AirLineName",
              "asc"
            );
            break;
          case "Airline Desc":
            filterFlights = orderBy(
              filterFlights,
              "IntOnward.FlightSegments[0].AirLineName",
              "desc"
            );
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
              item => new Date(item.IntOnward.FlightSegments[0].DepartureDateTime),
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
        break;
    }
    console.log(filterFlights);
    this.setState({ filterFlights, showFilter: false });
  };

  _ChangeDate = item => () => {
    this.setState({ journeyDate: item.fullDate });
    let data = Object.assign({}, this.props.navigation.state.params);
    data.journeyDate = item.fullDate;
    this.ApiCall(data);
  };

  handleDatePicked = date => {
    this.setState({ journeyDate: moment(date).format("DD-MM-YYYY") });
    let data = Object.assign({}, this.props.navigation.state.params);
    data.journeyDate = moment(date).format("DD-MM-YYYY");
    this.ApiCall(data);
  };

  _openCalenderShow = () => {
    this.setState({ showCalender: true });
  };

  hideDateTimePicker = () => {
    this.setState({ showCalender: false });
  };

  _renderItem = ({ item }) => (
    <Button
      style={{
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: "center",
        borderEndWidth: 1,
        borderColor: "#717984",
        justifyContent: "center"
      }}
      onPress={this._ChangeDate(item)}>
      <Text style={{ fontSize: 12, color: "#717984" }}>{item.day}</Text>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{item.date}</Text>
      {/* <Text style={{ fontSize: 12, color: "#717984" }}>{item.month}</Text> */}
    </Button>
  );
  // itemSeparator = () => (
  //   <View
  //     style={{
  //       width: 1,
  //       backgroundColor: "#DFDFDF",
  //       height: 10
  //       //paddingVertical: 10
  //     }}
  //   />
  // );
  // listheaderComponent = () => (
  //   <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //     <Text style={{ transform: [{ rotate: "270deg" }], textAlign: "center" }}>
  //       {this.state.month}
  //     </Text>
  //   </View>
  // );
  _keyExtractor = (item, index) => "dates_" + item + index;

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
      journeyDate,
      className,
      Adult,
      Child,
      Infant,
      loader,
      showFilter,
      filterFlights,
      dates,
      flight_type,
      flights,
      showCalender
    } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ paddingBottom: 40, backgroundColor: "#E5EBF7" }}>
              <HeaderFlights
                from={from}
                to={to}
                journey_date={moment(journeyDate, "DD-MM-YYYY").format("DD MMM")}
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
                  <Text style={{ fontSize: 14, marginHorizontal: 5, color: "#717984" }}>
                    Sort & Filter
                  </Text>
                </Button>
              </HeaderFlights>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                borderRadius: 5,
                marginTop: -40,
                borderWidth: 1,
                borderColor: "#d2d2d2d2",
                backgroundColor: "#FFFFFF"
              }}>
              {/* <FlatList
                  horizontal={true}
                  data={dates}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}
                  
                  showsHorizontalScrollIndicator={false}
                  ListHeaderComponent={this.listheaderComponent}
                /> */}
              <SectionList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                sections={dates}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                ItemSeparatorComponent={this.itemSeparator}
                renderSectionHeader={({ section: { title } }) => (
                  <Text
                    style={{
                      transform: [{ rotate: "270deg" }],
                      marginVertical: 20
                    }}>
                    {title}
                  </Text>
                )}
              />
              <Button
                style={{
                  backgroundColor: "#5B89F9",
                  justifyContent: "center",
                  borderBottomRightRadius: 5,
                  borderTopRightRadius: 5
                }}
                onPress={this._openCalenderShow}>
                <Icon name="md-calendar" size={24} color="#fff" style={{ paddingHorizontal: 10 }} />
                <DateTimePicker
                  isVisible={showCalender}
                  date={moment(journeyDate, "DD-MM-YYYY").toDate()}
                  maximumDate={moment()
                    .add(1, "years")
                    .toDate()}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                  minimumDate={new Date()}
                />
              </Button>
            </View>

            {Array.isArray(flights) && flights.length == 0 ? (
              <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "700" }}>Data not Found</Text>
              </View>
            ) : (
              <FlatList
                nestedScrollEnabled={true}
                vertical={true}
                data={filterFlights}
                keyExtractor={this._keyExtractoritems}
                renderItem={this._renderItemList}
              />
            )}
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
            {loader && <ActivityIndicator label={"FETCHING FLIGHTS"} />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default FlightsInfoOneway;
