import React from "react";
import { View, Modal, StyleSheet, FlatList, SafeAreaView, Image, StatusBar } from "react-native";
import {
  Button,
  Text,
  ActivityIndicator,
  Icon,
  DataNotFound,
  CurrencyText
} from "../../components";
import { orderBy } from "lodash";
import moment from "moment";
import { etravosApi } from "../../service";
import Filter from "./Filter";
import NumberFormat from "react-number-format";
import analytics from "@react-native-firebase/analytics";

class BusInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      sourceName: params.sourceName,
      destinationName: params.destinationName,
      journeyDate: moment(params.journeyDate, "DD-MM-YYYY").format("DD MMM"),
      day: moment(params.journeyDate, "DD-MM-YYYY").format("dddd"),
      loader: false,
      buses: [],
      filteredBuses: [],
      nofound: 1,
      CancellationPolicy: false,
      filterModalVisible: false,
      filterValues: {
        busTimings: [],
        busType: [],
        travels: [],
        boardingPoints: [],
        droppingPoints: [],
        sortBy: "Fare low to high"
      }
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };

  componentDidMount() {
    this.trackScreenView("Bus List");

    const { params } = this.props.navigation.state;
    this.setState({ loader: true });
    etravosApi
      .get("/Buses/AvailableBuses", params)
      .then(({ data }) => {
        console.log(data.AvailableTrips);

        this.setState({
          buses: data.AvailableTrips,
          filteredBuses: data.AvailableTrips,
          loader: false
        });
      })
      .catch(() => {
        this.setState({ loader: false });
      });
  }

  _onCanPolicy = () => {
    this.setState({ CancellationPolicy: true });
  };

  closePolicy = () => {
    this.setState({ CancellationPolicy: false });
  };

  openFilter = () => {
    this.setState({ filterModalVisible: true });
  };
  closeFilter = () => {
    this.setState({ filterModalVisible: false });
  };
  onChangeFilter = filterValues => {
    this.setState({ filterValues });
  };

  filter = () => {
    const { filterValues, buses } = this.state;
    let filteredBuses = buses.filter(
      item =>
        (filterValues.busTimings.length == 0 ||
          filterValues.busTimings.some(values => {
            values = values.split("to").map(v => v.trim());
            if (values[1].toLowerCase().includes("p")) {
              return moment(item.DepartureTime, "HH:mm A").isBetween(
                moment(values[0], "HH:mm A"),
                moment(values[1], "HH:mm A"),
                null,
                "[)"
              );
            } else {
              return moment(item.DepartureTime, "HH:mm A").isBetween(
                moment(values[0], "HH:mm A"),
                moment(values[1], "HH:mm A").add("1", "days"),
                null,
                "[)"
              );
            }
          })) &&
        (filterValues.busType.length == 0 ||
          filterValues.busType.some(val => item.BusType.includes(val))) &&
        (filterValues.travels.length == 0 || filterValues.travels.includes(item.DisplayName)) &&
        (filterValues.boardingPoints.length == 0 ||
          item.BoardingTimes.some(value => filterValues.boardingPoints.includes(value.Location))) &&
        (filterValues.droppingPoints.length == 0 ||
          item.DroppingTimes.some(value => filterValues.droppingPoints.includes(value.Location)))
    );

    switch (filterValues.sortBy) {
      case "Travels Asc":
        filteredBuses = orderBy(filteredBuses, "DisplayName", "asc");
        break;
      case "Travels Desc":
        filteredBuses = orderBy(filteredBuses, "DisplayName", "desc");
        break;
      case "Fare low to high":
        filteredBuses = orderBy(filteredBuses, "Fares", "asc");
        break;
      case "Fare high to low":
        filteredBuses = orderBy(filteredBuses, "Fares", "desc");
        break;
      case "Departure Asc":
        filteredBuses = orderBy(
          filteredBuses,
          item => moment(item.DepartureTime, "hh:mm A").toDate(),
          "asc"
        );
        break;
      case "Departure Desc":
        filteredBuses = orderBy(
          filteredBuses,
          item => moment(item.DepartureTime, "hh:mm A").toDate(),
          "desc"
        );
        break;
      case "Arrival Asc":
        filteredBuses = orderBy(
          filteredBuses,
          item => moment(item.ArrivalTime, "hh:mm A").toDate(),
          "asc"
        );
        break;
      case "Arrival Desc":
        filteredBuses = orderBy(
          filteredBuses,
          item => moment(item.ArrivalTime, "hh:mm A").toDate(),
          "desc"
        );
        break;
    }

    this.setState({
      filteredBuses,
      filterModalVisible: false
    });
  };

  _bookNow = item => () => {
    const {
      tripType,
      sourceName,
      destinationName,
      TripType,
      journeyDate,
      returnDate
    } = this.props.navigation.state.params;
    this.props.navigation.navigate("Seats", {
      params: item,
      tripType,
      sourceName,
      destinationName,
      TripType,
      journeyDate,
      returnDate
    });
  };

  _renderItemList = ({ item, index }) => {
    let rupee = item.Fares.split("/", 1);
    return (
      <Button
        style={{
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "rgba(0,0,0,0.1)",
          shadowOpacity: 1,
          shadowRadius: 4,
          marginHorizontal: 16,
          marginTop: 10,
          borderRadius: 8,
          paddingVertical: 10,
          backgroundColor: "#FFFFFF"
        }}
        onPress={this._bookNow(item)}>
        <View
          style={{
            flexDirection: "row",
            marginEnd: 8,
            alignItems: "flex-start"
            // marginVertical: 10
          }}>
          <Image
            style={{ width: 45, height: 45, marginEnd: 5 }}
            source={require("../../assets/imgs/busNew.png")}
          />
          <View style={{ flexShrink: 1 }}>
            <Text>{item.DisplayName}</Text>
            <Text style={{ fontSize: 12, color: "#5D666D" }}>{item.BusType}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between"
              }}>
              <Text style={{ fontSize: 18 }}>
                {moment(item.DepartureTime, ["h:mm A"]).format("HH:mm")}
              </Text>
              <Text style={{ color: "#5D666D", fontSize: 16 }}>{item.Duration}</Text>
              <Text style={{ fontSize: 18 }}>
                {moment(item.ArrivalTime, ["h:mm A"]).format("HH:mm")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 8,
            paddingTop: 8,
            marginTop: 8,
            borderTopWidth: 0.5,
            borderTopColor: "#d2d2d2",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between"
          }}>
          <Button onPress={this._onCanPolicy}>
            <Text
              style={{
                fontSize: 12,
                color: "green",
                zIndex: 1
              }}>
              Cancellation Policy
            </Text>
          </Button>
          <Text style={{ fontSize: 16, textAlign: "right", fontWeight: "600" }}>
            <CurrencyText style={{ fontSize: 16, fontWeight: "600" }}>₹</CurrencyText>
            <NumberFormat
              decimalScale={0}
              fixedDecimalScale
              value={parseInt(rupee[0])}
              displayType={"text"}
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              renderText={value => <Text style={{ fontSize: 16, fontWeight: "600" }}>{value}</Text>}
            />
          </Text>
        </View>
      </Button>
    );
  };

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  _keyExtractoritems = (item, index) => "key" + index;

  render() {
    const {
      sourceName,
      destinationName,
      journeyDate,
      day,
      loader,
      CancellationPolicy,
      filterModalVisible,
      filteredBuses
    } = this.state;
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: "#E5EBF7", flexDirection: "row", paddingBottom: 10 }}>
              <Button onPress={this.goBack} style={{ padding: 16 }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontWeight: "700", fontSize: 16, paddingTop: 16, flex: 1 }}>
                    {sourceName} to {destinationName}
                  </Text>

                  <Button
                    style={{
                      flexDirection: "row",
                      //marginStart: "auto",
                      paddingEnd: 8,
                      paddingTop: 16
                    }}
                    onPress={this.openFilter}>
                    <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
                    <Text style={{ fontSize: 14, marginHorizontal: 5, color: "#717984" }}>
                      Sort & Filter
                    </Text>
                  </Button>
                </View>
                <Text style={{ fontSize: 12, color: "#717984" }}>
                  {journeyDate}, {day ? day + " " : ""}
                  {!loader ? filteredBuses.length + " Buses Found" : ""}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredBuses}
                keyExtractor={this._keyExtractoritems}
                renderItem={this._renderItemList}
              />
              {!loader && filteredBuses.length == 0 && (
                <DataNotFound title="No buses found" onPress={this.goBack} />
                /* <View style={{ alignItems: "center", justifyContent: "center", flex: 4 }}>
                  <Text style={{ fontSize: 18, fontWeight: "700" }}>No bus found.</Text>
                </View> */
              )}
              {loader && <ActivityIndicator label={"FETCHING BUSES"} />}
            </View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={CancellationPolicy}
              onRequestClose={this.closePolicy}>
              <CanPolicy onBackPress={this.closePolicy} />
            </Modal>
            <Modal
              animationType="slide"
              transparent={false}
              visible={filterModalVisible}
              onRequestClose={this.closeFilter}>
              <Filter
                data={this.state.buses}
                onBackPress={this.closeFilter}
                filterValues={this.state.filterValues}
                onChangeFilter={this.onChangeFilter}
                filter={this.filter}
              />
            </Modal>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

class CanPolicy extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View style={styles.headerContainer}>
              <Button onPress={this.props.onBackPress} style={{ padding: 16 }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>Cancellation Policy</Text>
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 16 }}>
              <View style={styles.flexDirection}>
                <Text style={{ fontWeight: "700", flex: 3 }}>Cancellation Time</Text>
                <Text style={{ fontWeight: "700", flex: 1 }}>Cancellation Charge</Text>
              </View>
              <View style={styles.flexDirection}>
                <Text style={{ flex: 3 }}>
                  Between 0 days 5 hours and 0 hours before journey time
                </Text>
                <Text style={{ flex: 1 }}>100.0%</Text>
              </View>
              <View style={styles.flexDirection}>
                <Text style={{ flex: 3 }}>Between 24 hours and 0 days before journey time</Text>
                <Text style={{ flex: 1 }}>10.0%</Text>
              </View>
              <View style={styles.flexDirection}>
                <Text style={{ flex: 3 }}>24 hours before journey time</Text>
                <Text style={{ flex: 1 }}>10.0%</Text>
              </View>
              <Text style={{ color: "red" }}>*Partial cancellation not allowed</Text>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#E5EBF7"
  },
  flexDirection: { justifyContent: "space-between", flexDirection: "row" }
});

export default BusInfo;
