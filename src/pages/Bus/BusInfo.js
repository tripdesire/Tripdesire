import React from "react";
import { View, Modal, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { Button, Text, ActivityIndicator, Icon, DataNotFound } from "../../components";
import { orderBy } from "lodash";
import moment from "moment";
import { etravosApi } from "../../service";
import Filter from "./Filter";

class BusInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      sourceName: params.sourceName,
      destinationName: params.destinationName,
      journeyDate: moment(params.journeyDate, "DD-MM-YYYY").format("DD MMM"),
      day: moment(params.journeyDate, "DD-MM-YYYY").format("dddd"),
      loader: true,
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

  componentDidMount() {
    const { params } = this.props.navigation.state;
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
    return (
      <Button
        style={{
          paddingVertical: index % 2 == 0 ? 40 : 20,
          backgroundColor: index % 2 == 0 ? "#FFFFFF" : "#E5EBF7"
        }}
        onPress={this._bookNow(item)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 16
          }}>
          <Text style={{ flex: 1, fontWeight: "700" }}>{item.BusType}</Text>
          {/* <Button
            style={{
              backgroundColor: "#5191FB",
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5
            }}
            onPress={this._bookNow(item)}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Select Seats</Text>
          </Button> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            alignItems: "center",
            marginVertical: 10
          }}>
          <Icon name="bus" size={50} color="#6287F9" type="MaterialCommunityIcons" />
          <View style={{ flexShrink: 1 }}>
            <Text style={{ fontSize: 18, lineHeight: 20 }}>{item.DisplayName}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 16, lineHeight: 18 }}>{item.DepartureTime}</Text>
              <Text style={{ fontSize: 16, lineHeight: 18 }}> | </Text>
              <Text style={{ color: "#ADADAF", alignSelf: "center", lineHeight: 18 }}>
                {item.Duration}
              </Text>
              <Text style={{ fontSize: 16, lineHeight: 18 }}> | </Text>
              <Text style={{ fontSize: 16, lineHeight: 18 }}>{item.ArrivalTime}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginHorizontal: 16 }}>
          <Text style={{ flex: 1, paddingEnd: 10 }}>Rs. {item.Fares}</Text>
          <Button
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}
            onPress={this._onCanPolicy}>
            <Icon name="mobile-phone" size={24} color="#6287F9" type="FontAwesome" />
            <Text style={{ paddingStart: 5, fontWeight: "700", color: "#6287F9", zIndex: 1 }}>
              Cancellation Policy
            </Text>
          </Button>
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
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: "#E5EBF7" }}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%"
                }}>
                <Button onPress={this.goBack} style={{ padding: 16 }}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <View style={{ flex: 1, paddingTop: 16, paddingBottom: 8 }}>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
                      {sourceName} to {destinationName}
                    </Text>
                    <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                      {journeyDate}, {day ? day + " " : ""}
                      {!loader ? filteredBuses.length + " Buses Found" : ""}
                    </Text>
                  </View>
                </View>
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
              </View>
            </View>
            <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
              <FlatList
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
        <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View style={styles.headerContainer}>
              <Button onPress={this.props.onBackPress} style={{ padding: 16 }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>Cancellation Policy</Text>
            </View>
            <View style={{ marginHorizontal: 16 }}>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <Text style={{ fontWeight: "700", flex: 3 }}>Cancellation Time</Text>
                <Text style={{ fontWeight: "700", flex: 1 }}>Cancellation Charge</Text>
              </View>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <Text style={{ flex: 3 }}>
                  Between 0 days 5 hours and 0 hours before journey time
                </Text>
                <Text style={{ flex: 1 }}>100.0%</Text>
              </View>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <Text style={{ flex: 3 }}>Between 24 hours and 0 days before journey time</Text>
                <Text style={{ flex: 1 }}>10.0%</Text>
              </View>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
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
    backgroundColor: "#FFFFFF"
  }
});

export default BusInfo;
