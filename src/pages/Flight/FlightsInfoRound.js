import React, { PureComponent } from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  Modal,
  SafeAreaView
} from "react-native";
import {
  Button,
  Text,
  ActivityIndicator,
  HeaderFlights,
  Icon,
  DataNotFound,
  LinearGradient,
  CurrencyText
} from "../../components";
import Toast from "react-native-simple-toast";
import { orderBy } from "lodash";
import { withNavigation } from "react-navigation";
import SwiperFlatList from "react-native-swiper-flatlist";
import { etravosApi } from "../../service";
import moment from "moment";
import RenderDomesticRound from "./RenderDomesticRound";
import Filter from "./Filter";
import NumberFormat from "react-number-format";
import analytics from "@react-native-firebase/analytics";

const { width, height } = Dimensions.get("window");

class FlightsInfoRound extends React.PureComponent {
  constructor(props) {
    super();
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
      flight_type: "",
      onwardFlights: [],
      returnFlights: [],
      onwardFlightsList: [],
      returnFlightsList: [],
      onwardFare: "",
      returnFare: "",
      loader: true,
      swiperIndex: 0,
      selectedOnward: 0,
      selectedReturn: 0,
      sourceCode: "",
      destinationCode: "",
      sourceAirportName: "",
      destinationAirportName: "",
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

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };

  componentDidMount() {
    this.trackScreenView("Flight Round");
    let data = this.props.navigation.state.params;

    let jd = moment(data.journeyDate, "DD-MM-YYYY").format("DD MMM");
    let rt = moment(data.returnDate, "DD-MM-YYYY").format("DD MMM");
    this.setState({
      from: data.sourceName,
      to: data.destinationName,
      className: data.className,
      travelClass: data.travelClass,
      journey_date: jd,
      return_date: rt,
      journeyDate: data.journeyDate,
      returnDate: data.returnDate,
      Adult: data.adults,
      Child: data.children,
      Infant: data.infants,
      flight_type: data.flightType,
      sourceCode: data.source,
      destinationCode: data.destination,
      sourceAirportName: data.sourceAirportName,
      destinationAirportName: data.destinationAirportName
    });
    etravosApi
      .get("/Flights/AvailableFlights", data)
      .then(({ data }) => {
        this.setState({
          onwardFlightsList: data.DomesticOnwardFlights,
          returnFlightsList: data.DomesticReturnFlights,
          onwardFlights: data.DomesticOnwardFlights,
          returnFlights: data.DomesticReturnFlights,
          onwardFare:
            data.DomesticOnwardFlights.length > 0
              ? data.DomesticOnwardFlights[0].FareDetails.TotalFare
              : 0,
          selectedOnward: 0,
          returnFare:
            data.DomesticReturnFlights.length > 0
              ? data.DomesticReturnFlights[0].FareDetails.TotalFare
              : 0,
          selectedReturn: 0,
          loader: false
        });
      })
      .catch(error => {
        Toast.show(error.toString(), Toast.LONG);
        this.setState({ loader: false });
      });
  }

  _getDomesticFlightOnward = (value, index) => {
    this.setState({
      onwardFare: value.FareDetails.TotalFare,
      selectedOnward: index
    });
  };

  _getDomesticFlightReturn = (value, index) => {
    this.setState({
      returnFare: value.FareDetails.TotalFare,
      selectedReturn: index
    });
  };

  _bookNow = () => {
    console.log(this.state);
    if (Array.isArray(this.state.onwardFlights) && this.state.onwardFlights.length == 0) {
      return;
    }
    const { returnFlights, onwardFlights, selectedOnward, selectedReturn } = this.state;
    let param = {
      arrivalFlight: returnFlights[selectedReturn],
      departFlight: onwardFlights[selectedOnward],
      flightType: 1,
      tripType: 2,
      from: this.state.from,
      to: this.state.to,
      className: this.state.className,
      travelClass: this.state.travelClass,
      adult: this.state.Adult,
      child: this.state.Child,
      infant: this.state.Infant,
      journey_date: this.state.journey_date,
      return_date: this.state.return_date,
      journeyDate: this.state.journeyDate,
      returnDate: this.state.returnDate,
      Adult: this.state.Adult,
      Child: this.state.Child,
      Infant: this.state.Infant,
      sourceCode: this.state.sourceCode,
      destinationCode: this.state.destinationCode,
      sourceAirportName: this.state.sourceAirportName,
      destinationAirportName: this.state.destinationAirportName
    };

    this.props.navigation.navigate("CheckOut", param);
  };

  _onPress = value => () => {
    if (value == "Depart") {
      this.scrollRef.goToFirstIndex();
      this.setState({ swiperIndex: 0 });
    } else if (value == "Return") {
      this.scrollRef.goToLastIndex();
      this.setState({ swiperIndex: 1 });
    }
  };

  _onChangeIndex = ({ index }) => {
    this.setState({ swiperIndex: index });
  };

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
    const { filterValues, onwardFlightsList, returnFlightsList, flight_type } = this.state;

    let onwardFlights = onwardFlightsList.filter(
      item =>
        (filterValues.stops.length == 0 ||
          filterValues.stops.includes(item.FlightSegments.length - 1)) &&
        (filterValues.fareType.length == 0 ||
          filterValues.fareType.includes(item.FlightSegments[0].BookingClassFare.Rule.trim())) &&
        (filterValues.airlines.length == 0 ||
          filterValues.airlines.includes(item.FlightSegments[0].AirLineName)) &&
        (filterValues.connectingLocations.length == 0 ||
          item.FlightSegments.some(value =>
            filterValues.connectingLocations.includes(value.IntDepartureAirportName)
          )) &&
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

    switch (filterValues.sortBy) {
      case "Airline Asc":
        onwardFlights = orderBy(onwardFlights, "FlightSegments[0].AirLineName", "asc");
        break;
      case "Airline Desc":
        onwardFlights = orderBy(onwardFlights, "FlightSegments[0].AirLineName", "desc");
        break;
      case "Fare low to high":
        onwardFlights = orderBy(onwardFlights, "FareDetails.TotalFare", "asc");
        break;
      case "Fare high to low":
        onwardFlights = orderBy(onwardFlights, "FareDetails.TotalFare", "desc");
        break;
      case "Departure Asc":
        onwardFlights = orderBy(
          onwardFlights,
          new Date(item.FlightSegments[0].DepartureDateTime),
          "asc"
        );
        break;
      case "Departure Desc":
        onwardFlights = orderBy(
          onwardFlights,
          item => new Date(item.FlightSegments[0].DepartureDateTime),
          "desc"
        );
        break;
      case "Arrival Asc":
        onwardFlights = orderBy(
          onwardFlights,
          item => new Date(item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime),
          "asc"
        );
        break;
      case "Arrival Desc":
        onwardFlights = orderBy(
          onwardFlights,
          item => new Date(item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime),
          "desc"
        );
        break;
    }

    let returnFlights = returnFlightsList.filter(
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
          )) &&
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
    switch (filterValues.sortBy) {
      case "Airline Asc":
        returnFlights = orderBy(returnFlights, "FlightSegments[0].AirLineName", "asc");
        break;
      case "Airline Desc":
        returnFlights = orderBy(returnFlights, "FlightSegments[0].AirLineName", "desc");
        break;
      case "Fare low to high":
        returnFlights = orderBy(returnFlights, "FareDetails.TotalFare", "asc");
        break;
      case "Fare high to low":
        returnFlights = orderBy(returnFlights, "FareDetails.TotalFare", "desc");
        break;
      case "Departure Asc":
        returnFlights = orderBy(
          returnFlights,
          new Date(item.FlightSegments[0].DepartureDateTime),
          "asc"
        );
        break;
      case "Departure Desc":
        returnFlights = orderBy(
          returnFlights,
          item => new Date(item.FlightSegments[0].DepartureDateTime),
          "desc"
        );
        break;
      case "Arrival Asc":
        returnFlights = orderBy(
          returnFlights,
          item => new Date(item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime),
          "asc"
        );
        break;
      case "Arrival Desc":
        returnFlights = orderBy(
          returnFlights,
          item => new Date(item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime),
          "desc"
        );
        break;
    }

    if (onwardFlights.length == 0) {
      Toast.show("No any onward flights available for selected filter", Toast.LONG);
    } else if (returnFlights.length == 0) {
      Toast.show("No any return flights available for selected filter", Toast.LONG);
    } else {
      this.setState({
        onwardFlights,
        returnFlights,
        showFilter: false,
        onwardFare: onwardFlights[0].FareDetails.TotalFare,
        selectedOnward: 0,
        returnFare: returnFlights[0].FareDetails.TotalFare,
        selectedReturn: 0
      });
    }
  };

  _renderItemOnward = ({ item, index }) => {
    return (
      <RenderDomesticRound
        item={item}
        index={index}
        from={this.state.from}
        to={this.state.to}
        selected={index == this.state.selectedOnward}
        getDomesticFlights={this._getDomesticFlightOnward}
        className={this.state.className}
        travelClass={this.state.travelClass}
        journeyDate={this.state.journeyDate}
        returnDate={this.state.returnDate}
        sourceCode={this.state.sourceCode}
        destinationCode={this.state.destinationCode}
        sourceAirportName={this.state.sourceAirportName}
        destinationAirportName={this.state.destinationAirportName}
        trip_type={2}
        flight_type={1}
      />
    );
  };

  _renderItemReturn = ({ item, index }) => {
    return (
      <RenderDomesticRound
        item={item}
        index={index}
        selected={index == this.state.selectedReturn}
        getDomesticFlights={this._getDomesticFlightReturn}
        from={this.state.to}
        to={this.state.from}
        className={this.state.className}
        travelClass={this.state.travelClass}
        journeyDate={this.state.journeyDate}
        returnDate={this.state.returnDate}
        sourceCode={this.state.sourceCode}
        destinationCode={this.state.destinationCode}
        sourceAirportName={this.state.sourceAirportName}
        destinationAirportName={this.state.destinationAirportName}
        trip_type={2}
        flight_type={1}
      />
    );
  };

  _keyExtractorOnward = (item, index) => "OnwardFlights_" + index;

  _keyExtractorReturn = (item, index) => "ReturnFlights_" + index;

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    const {
      from,
      to,
      journey_date,
      return_date,
      loader,
      Adult,
      Child,
      Infant,
      className,
      onwardFare,
      returnFare,
      swiperIndex,
      flight_type,
      showFilter,
      onwardFlights,
      returnFlights,
      onwardFlightsList,
      returnFlightsList
    } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <HeaderFlights
              from={from}
              to={to}
              journey_date={journey_date}
              return_date={return_date}
              Adult={Adult}
              Child={Child}
              Infant={Infant}
              className={className}
              style={{ backgroundColor: "#E5EBF7", paddingBottom: 8, zIndex: 1 }}>
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
            {Array.isArray(onwardFlights) && onwardFlights.length > 0 && (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: 16,
                    alignItems: "center"
                  }}>
                  <View>
                    <Text style={{ color: "#5F6D78" }}>Departure</Text>
                    <Text style={{ color: "#212C4C", fontSize: 18, fontWeight: "700" }}>
                      <CurrencyText style={{ fontWeight: "700", fontSize: 18 }}>₹</CurrencyText>
                      <NumberFormat
                        decimalScale={0}
                        fixedDecimalScale
                        value={onwardFare}
                        displayType={"text"}
                        thousandSeparator={true}
                        thousandsGroupStyle="lakh"
                        renderText={value => (
                          <Text style={{ fontSize: 18, fontWeight: "700" }}>{value}</Text>
                        )}
                      />
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: "#5F6D78" }}>Return</Text>
                    <Text style={{ color: "#212C4C", fontSize: 18, fontWeight: "700" }}>
                      <CurrencyText style={{ fontWeight: "700", fontSize: 18 }}>₹</CurrencyText>
                      <NumberFormat
                        decimalScale={0}
                        fixedDecimalScale
                        value={returnFare}
                        displayType={"text"}
                        thousandSeparator={true}
                        thousandsGroupStyle="lakh"
                        renderText={value => (
                          <Text style={{ fontSize: 18, fontWeight: "700" }}>{value}</Text>
                        )}
                      />
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: "#5F6D78" }}>Total</Text>
                    <Text style={{ color: "#212C4C", fontSize: 18, fontWeight: "700" }}>
                      <CurrencyText style={{ fontWeight: "700", fontSize: 18 }}>₹</CurrencyText>
                      <NumberFormat
                        decimalScale={0}
                        fixedDecimalScale
                        value={onwardFare + returnFare}
                        displayType={"text"}
                        thousandSeparator={true}
                        thousandsGroupStyle="lakh"
                        renderText={value => (
                          <Text style={{ fontSize: 18, fontWeight: "700" }}>{value}</Text>
                        )}
                      />
                    </Text>
                  </View>
                  <Button
                    style={{ backgroundColor: "#F68E1F", borderRadius: 15 }}
                    onPress={this._bookNow}>
                    <Text style={{ color: "#fff", paddingHorizontal: 10, paddingVertical: 4 }}>
                      Book Now
                    </Text>
                  </Button>
                </View>
                <View
                  style={{
                    backgroundColor: "#DEDEDE",
                    height: 1,
                    marginHorizontal: 16
                    // marginTop: 10
                  }}
                />
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginHorizontal: 16,
                    marginVertical: 10
                  }}>
                  <LinearGradient
                    colors={swiperIndex == 0 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                    style={{ borderRadius: 20 }}>
                    <Button style={[styles.tabBtn]} onPress={this._onPress("Depart")}>
                      <Text
                        style={{ fontSize: 12, color: swiperIndex == 0 ? "#ffffff" : "#000000" }}>
                        Depart
                      </Text>
                    </Button>
                  </LinearGradient>
                  <LinearGradient
                    colors={swiperIndex == 1 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                    style={{ borderRadius: 20 }}>
                    <Button style={[styles.tabBtn]} onPress={this._onPress("Return")}>
                      <Text
                        style={{ fontSize: 12, color: swiperIndex == 1 ? "#ffffff" : "#000000" }}>
                        Return
                      </Text>
                    </Button>
                  </LinearGradient>
                </View>
              </View>
            )}
            {Array.isArray(onwardFlights) && onwardFlights.length == 0 && (
              <DataNotFound
                style={{ marginTop: 100 }}
                title="No flights found"
                onPress={this.goBack}
              />
            )}
            <SwiperFlatList
              //index={swiperIndex}
              ref={ref => (this.scrollRef = ref)}
              onChangeIndex={this._onChangeIndex}>
              <FlatList
                data={onwardFlights}
                keyExtractor={this._keyExtractorOnward}
                renderItem={this._renderItemOnward}
                contentContainerStyle={{ width, paddingHorizontal: 8 }}
                extraData={this.state.selectedOnward}
              />
              <FlatList
                data={returnFlights}
                keyExtractor={this._keyExtractorReturn}
                renderItem={this._renderItemReturn}
                contentContainerStyle={{ width, paddingHorizontal: 8 }}
                extraData={this.state.selectedReturn}
              />
            </SwiperFlatList>
            <Modal
              animationType="slide"
              transparent={false}
              visible={showFilter}
              onRequestClose={this.closeFilter}>
              <Filter
                data={[...onwardFlightsList, ...returnFlightsList]}
                //returnFlights={returnFlights}
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

const styles = StyleSheet.create({
  tabBtn: {
    elevation: 1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 50,
    borderRadius: 20
  }
});

export default withNavigation(FlightsInfoRound);
